import "server-only";
import {adminEnabled} from "./towing-rate-store.mjs";
function config(){const url=process.env.DV_QUOTE_DB_URL,key=process.env.DV_QUOTE_AUTH_PUBLIC_KEY;const owners=(process.env.DV_RATE_ADMIN_USER_IDS||"").split(",").map(s=>s.trim()).filter(Boolean);if(!adminEnabled()||!url||!key||!owners.length)return null;return {url:url.replace(/\/$/,""),key,owners};}
export async function signInOwner(email,password){
 const c=config();if(!c||typeof email!=="string"||typeof password!=="string"||email.length>254||password.length>256)return null;
 const r=await fetch(c.url+"/auth/v1/token?grant_type=password",{method:"POST",cache:"no-store",headers:{apikey:c.key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 if(!r.ok)return null;const d=await r.json();if(!c.owners.includes(d.user?.id)||typeof d.access_token!=="string")return null;
 return d.access_token;
}
export async function verifyOwner(req){
 const c=config(),authorization=req.headers.get("authorization");if(!c||!authorization?.startsWith("Bearer ")||authorization.length>8192)return null;
 const r=await fetch(c.url+"/auth/v1/user",{cache:"no-store",headers:{apikey:c.key,Authorization:authorization}});
 if(!r.ok)return null;const u=await r.json();return c.owners.includes(u.id)?u.id:null;
}
