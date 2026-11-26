import {FeedError,applyPost,validatePost} from "./geoposts.mjs";
import {allowedIds,candidateIds} from "./registry.mjs";
const endpoint="https://api.github.com/repos/deepinc84/DVtowing/contents/data/geoposts.json";
const branch="geopost-data";
function headers(token){return {Authorization:"Bearer "+token,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"};}
export function policy(){return {services:new Set([...allowedIds(process.env.GEO_APPROVED_SERVICES)].filter(id=>candidateIds.includes(id))),areas:allowedIds(process.env.GEO_APPROVED_AREAS),hosts:allowedIds(process.env.GEO_IMAGE_HOSTS)};}
async function read(token,write=false){
 const r=await fetch(endpoint+"?ref="+branch,{headers:headers(token),...(write?{cache:"no-store"}:{next:{revalidate:300,tags:["dv-geoposts"]}})});
 if(!r.ok)throw new FeedError(502,"Feed store unavailable");
 const f=await r.json();if(f.encoding!=="base64"||typeof f.sha!=="string")throw new FeedError(502,"Unsupported feed encoding");
 let records;try{records=JSON.parse(Buffer.from(f.content,"base64").toString("utf8"));}catch{throw new FeedError(502,"Invalid stored feed");}
 if(!Array.isArray(records))throw new FeedError(502,"Invalid stored feed");
 return {records,sha:f.sha};
}
export async function readPublicFeed(){
 const token=process.env.GEO_GITHUB_READ_TOKEN;if(!token)return [];
 const {records}=await read(token);
 // Revalidate persisted records against current allowlists. A disabled capability immediately stops appearing after cache refresh.
 return records.flatMap(p=>{try{return p.status==="published"?[validatePost(p,policy())]:[];}catch{return [];}});
}
export async function persistPost(post){
 const token=process.env.GEO_GITHUB_WRITE_TOKEN;if(!token)throw new FeedError(503,"Feed store not configured");
 for(let attempt=0;attempt<3;attempt++){
  const {records,sha}=await read(token,true);const next=applyPost(records,post);
  if(!next.changed)return false;
  const r=await fetch(endpoint,{method:"PUT",cache:"no-store",headers:headers(token),body:JSON.stringify({branch,sha,message:"GeoPost "+post.id+" revision "+post.revision,content:Buffer.from(JSON.stringify(next.feed)+"\n").toString("base64")})});
  if(r.ok)return true;if(r.status!==409&&r.status!==422)throw new FeedError(502,"Feed write failed");
 }
 throw new FeedError(409,"Concurrent update; retry with same revision");
}
