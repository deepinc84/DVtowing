import {NextResponse} from "next/server";
import {estimate,selectedRate} from "../../../lib/towing-quotes.mjs";
import {saveQuote} from "../../../lib/towing-quote-store.mjs";
export const runtime="nodejs";
export async function POST(req){
 const origin=req.headers.get("origin");if(origin!==new URL(req.url).origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 let data,q;
 try{if(!req.headers.get("content-type")?.startsWith("application/json"))throw Error("Invalid request");const body=await req.text();if(body.length>4096)throw Error("Invalid request");data=JSON.parse(body);q=estimate(data,selectedRate());}catch(e){return NextResponse.json({error:e.message},{status:400});}
 let saved=false;try{saved=await saveQuote(q,data.consent===true);}catch{console.warn("Quote capture failed");}
 return NextResponse.json({quote:q,saved,preview:!process.env.DV_RATE_VERSION},{headers:{"Cache-Control":"no-store"}});
}
