import {NextResponse} from "next/server";
import {signInOwner,verifyOwner} from "../../../../lib/towing-admin-auth.mjs";
import {activeRate,rateHistory,publishRate,adminEnabled} from "../../../../lib/towing-rate-store.mjs";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const json=(body,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
export async function GET(req){
 try{if(!adminEnabled()||!await verifyOwner(req))return json({error:"Not authorized."},401);return json({active:await activeRate(),history:await rateHistory()});}catch{return json({error:"Rate dashboard unavailable."},503);}
}
export async function POST(req){
 if(!adminEnabled())return json({error:"Dashboard disabled."},503);
 if(req.headers.get("origin")!==new URL(req.url).origin)return json({error:"Invalid origin."},403);
 try{
  if(!req.headers.get("content-type")?.startsWith("application/json"))return json({error:"Invalid request."},400);
  const raw=await req.text();if(raw.length>8192)return json({error:"Invalid request."},400);const data=JSON.parse(raw);
  if(data.action==="login"){const token=await signInOwner(data.email,data.password);return token?json({token}):json({error:"Invalid credentials or not authorized."},401);}
  const owner=await verifyOwner(req);if(!owner)return json({error:"Not authorized."},401);
  if(data.action!=="publish"||data.confirm!==true||typeof data.expectedId!=="string")return json({error:"Confirm the new rate version."},400);
  try{await publishRate(data.rates,data.expectedId,owner);return json({active:await activeRate(),history:await rateHistory()});}catch{return json({error:"Rates could not be published. Reload, validate values, and try again."},409);}
 }catch{return json({error:"Dashboard unavailable."},503);}
}
