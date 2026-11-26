import {verifySignature,validatePost,FeedError,LIMIT_BYTES} from "../../../lib/geoposts.mjs";
import {policy,persistPost} from "../../../lib/geopost-store.mjs";
export const runtime="nodejs";
export async function POST(request){
 try{
  if(!process.env.GEOPOST_SECRET||process.env.GEOPOST_SECRET.length<32||!process.env.GEO_GITHUB_WRITE_TOKEN||!process.env.GEO_GITHUB_READ_TOKEN)return Response.json({error:"Receiver not configured"},{status:503});
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return Response.json({error:"JSON required"},{status:415});
  const timestamp=request.headers.get("x-geopost-timestamp"),signature=request.headers.get("x-geopost-signature");
  if(!timestamp||!signature)return Response.json({error:"Unauthorized"},{status:401});
  const reader=request.body?.getReader();if(!reader)return Response.json({error:"Body required"},{status:400});
  let size=0;const chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMIT_BYTES){await reader.cancel();throw new FeedError(413,"Payload too large");}chunks.push(Buffer.from(value));}
  const body=Buffer.concat(chunks);
  if(!verifySignature(body,timestamp,signature,process.env.GEOPOST_SECRET))return Response.json({error:"Unauthorized"},{status:401});
  let parsed;try{parsed=JSON.parse(body.toString("utf8"));}catch{throw new FeedError(400,"Invalid JSON");}
  const post=validatePost(parsed,policy());const changed=await persistPost(post);
  return Response.json({ok:true,changed,id:post.id,revision:post.revision});
 }catch(err){return Response.json({error:err instanceof FeedError?err.message:"Internal error"},{status:err instanceof FeedError?err.status:500});}
}
