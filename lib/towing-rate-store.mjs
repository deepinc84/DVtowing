import "server-only";
import {randomUUID} from "node:crypto";
import {quoteDbRequest} from "./towing-quote-store.mjs";
import {RATE_HISTORY,selectedRate} from "./towing-quotes.mjs";
import {validateRateValues} from "./towing-rate-fields.mjs";
export const adminEnabled=()=>process.env.DV_RATE_ADMIN_ENABLED==="true";
function unpack(row){return {...validateRateValues(row.rates),id:row.id,effectiveFrom:row.effective_at,status:"published"};}
export async function rateHistory(){
 if(!adminEnabled())return [...RATE_HISTORY];
 const rows=[];for(let offset=0;;offset+=100){const data=await (await quoteDbRequest("towing_rate_versions?select=id,effective_at,rates&order=effective_at.asc,id.asc&limit=100&offset="+offset)).json();if(!Array.isArray(data))throw Error("Rate history unavailable.");rows.push(...data.map(unpack));if(data.length<100)break;if(offset>=9900)throw Error("Rate history capacity reached.");}
 return [...RATE_HISTORY,...rows];
}
export async function activeRate(){
 if(!adminEnabled())return selectedRate();
 const rows=await (await quoteDbRequest("towing_rate_versions?select=id,effective_at,rates&order=effective_at.desc,id.desc&limit=1")).json();
 if(!Array.isArray(rows))throw Error("Rate store unavailable.");
 return rows.length?unpack(rows[0]):selectedRate();
}
export async function publishRate(input,expectedId,ownerId){
 const rates=validateRateValues(input),current=await activeRate();
 if(current.id!==expectedId)throw Error("Rates changed. Reload before publishing.");
 const id=randomUUID();
 const row={id,previous_id:expectedId,rates,created_by:ownerId};
 await quoteDbRequest("towing_rate_versions",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(row)});
 return await activeRate();
}
