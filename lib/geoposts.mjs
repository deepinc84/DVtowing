import {createHmac,timingSafeEqual} from "node:crypto";
import {getService,getArea} from "./registry.mjs";
export const LIMIT_BYTES=32000;
export class FeedError extends Error {constructor(status,message){super(message);this.status=status;}}
const fail=(s,m)=>{throw new FeedError(s,m);};
const plain=(v,min,max)=>typeof v==="string"&&v.trim().length>=min&&v.length<=max&&!/[<>\u0000-\u0008]/u.test(v);
const idPattern=/^[a-z0-9][a-z0-9-]{2,79}$/;
const obj=v=>v&&typeof v==="object"&&!Array.isArray(v);
const keysOnly=(o,keys)=>Object.keys(o).every(k=>keys.includes(k));
export function verifySignature(raw,timestamp,signature,secret,now=Date.now()){
 if(!secret||secret.length<32||!/^\d{10}$/.test(timestamp||"")||!/^sha256=[a-f0-9]{64}$/.test(signature||""))return false;
 if(Math.abs(now-Number(timestamp)*1000)>300000)return false;
 const expected=createHmac("sha256",secret).update(timestamp+".").update(raw).digest();
 return timingSafeEqual(expected,Buffer.from(signature.slice(7),"hex"));
}
export function validatePost(p,policy,now=Date.now()){
 if(!obj(p)||!idPattern.test(p.id||"")||!Number.isSafeInteger(p.revision)||p.revision<1)fail(422,"Invalid id or revision");
 if(p.status==="withdrawn"){
  if(!keysOnly(p,["id","revision","status"]))fail(422,"Withdrawal accepts only id, revision and status");
  return {id:p.id,revision:p.revision,status:"withdrawn"};
 }
 const allowed=["id","revision","status","title","summary","serviceIds","areaId","completedOn","approved","photo"];
 if(!keysOnly(p,allowed)||p.status!=="published"||p.approved!==true)fail(422,"Only explicitly approved, public records accepted");
 if(!plain(p.title,8,100)||!plain(p.summary,40,1800))fail(422,"Invalid public title or summary");
 if(!Array.isArray(p.serviceIds)||p.serviceIds.length<1||p.serviceIds.length>4||new Set(p.serviceIds).size!==p.serviceIds.length||p.serviceIds.some(id=>!getService(id)||!policy.services.has(id)))fail(422,"Unknown or unapproved service");
 if(!getArea(p.areaId)||!policy.areas.has(p.areaId))fail(422,"Unknown or unapproved area");
 if(typeof p.completedOn!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(p.completedOn))fail(422,"Invalid completedOn");
 const date=new Date(p.completedOn+"T00:00:00Z");
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==p.completedOn||date.getTime()>now+86400000)fail(422,"Invalid completion date");
 let photo;
 if(p.photo!==undefined){
  if(!obj(p.photo)||!keysOnly(p.photo,["url","alt","publicApproved"])||p.photo.publicApproved!==true||!plain(p.photo.alt,5,180))fail(422,"Photo requires public-use approval and alt text");
  let u;try{u=new URL(p.photo.url);}catch{fail(422,"Invalid photo URL");}
  if(u.protocol!=="https:"||u.username||u.password||u.port||u.search||u.hash||!policy.hosts.has(u.hostname)||! /\.(webp|avif|jpe?g|png)$/i.test(u.pathname))fail(422,"Photo URL not approved");
  photo={url:u.href,alt:p.photo.alt.trim(),publicApproved:true};
 }
 return {id:p.id,revision:p.revision,status:"published",title:p.title.trim(),summary:p.summary.trim(),serviceIds:[...p.serviceIds].sort(),areaId:p.areaId,completedOn:p.completedOn,approved:true,...(photo?{photo}:{})};
}
export function applyPost(feed,post){
 if(!Array.isArray(feed))fail(502,"Invalid stored feed");
 const existing=feed.find(p=>p.id===post.id);
 if(existing&&post.revision<existing.revision)fail(409,"Stale revision");
 if(existing&&post.revision===existing.revision){
  if(JSON.stringify(existing)===JSON.stringify(post))return {changed:false,feed};
  fail(409,"Revision already used for different content");
 }
 if(!existing&&feed.length>=500)fail(507,"Feed capacity reached; archive before accepting new records");
 const next=[...feed.filter(p=>p.id!==post.id),post].sort((a,b)=>a.id.localeCompare(b.id));
 if(Buffer.byteLength(JSON.stringify(next))>850000)fail(507,"Feed byte limit reached");
 return {changed:true,feed:next};
}
export function selectPosts(feed,{serviceId,areaId,limit=6}={}){
 return feed.filter(p=>p.status==="published"&&(!serviceId||p.serviceIds.includes(serviceId))&&(!areaId||p.areaId===areaId))
 .sort((a,b)=>b.completedOn.localeCompare(a.completedOn)||a.id.localeCompare(b.id)).slice(0,limit);
}
