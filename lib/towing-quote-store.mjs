import "server-only";
import {createHash} from "node:crypto";
const config=()=>({url:process.env.DV_QUOTE_DB_URL,key:process.env.DV_QUOTE_DB_SERVICE_KEY});
async function request(path,options={}){
 const {url,key}=config();if(!url||!key)throw new Error("Quote store not configured");
 const r=await fetch(url.replace(/\/$/,"")+"/rest/v1/"+path,{...options,cache:"no-store",headers:{apikey:key,...(!key.startsWith("sb_secret_")?{Authorization:"Bearer "+key}:{}),"Content-Type":"application/json",...options.headers}});
 if(!r.ok)throw new Error("Quote store unavailable");
 return r;
}
export async function saveQuote(q,consent){
 if(process.env.DV_QUOTE_CAPTURE!=="true"||!process.env.DV_RATE_VERSION)return false;
 const day=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Edmonton",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const id=createHash("sha256").update(JSON.stringify([day,q,consent])).digest("hex");
 await request("towing_quotes?on_conflict=id",{method:"POST",headers:{Prefer:"resolution=ignore-duplicates,return=minimal"},body:JSON.stringify({id,quoted_on:day,service_id:q.serviceId,pickup_area:q.pickup,destination_area:q.destination,rate_id:q.rate.id,quote:q,consent:consent===true})});
 return true;
}
export async function publicQuotes({serviceId,areaId,group,limit=12,offset=0}={}){
 if(process.env.DV_QUOTE_CAPTURE!=="true")return [];
 const p=new URLSearchParams({select:"id,quoted_on,quote",approved:"eq.true",consent:"eq.true",order:"quoted_on.desc,id.asc",limit:String(limit),offset:String(offset)});
 if(serviceId)p.set("service_id","eq."+serviceId);
 if(areaId)p.set("or","(pickup_area.eq."+areaId+",destination_area.eq."+areaId+")");
 if(group==="towing")p.set("service_id","eq.general-towing");
 if(group==="roadside")p.set("service_id","eq.winch-out-recovery");
 try{return await (await request("towing_quotes?"+p)).json();}catch{console.warn("DV quote feed unavailable");return [];}
}
