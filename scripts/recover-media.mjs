import {mkdir,writeFile,access} from "node:fs/promises";
import {media,mediaUrl,localMedia} from "../lib/media.mjs";
await mkdir("public/media",{recursive:true});
await Promise.all(Object.keys(media).map(async key=>{
 const path="public"+localMedia(key);
 try{await access(path);console.log("Media already staged:",key);return;}catch{}
 try{const r=await fetch(mediaUrl(key),{signal:AbortSignal.timeout(10000),redirect:"error"});if(!r.ok||!r.headers.get("content-type")?.startsWith("image/"))throw Error("HTTP "+r.status);const b=Buffer.from(await r.arrayBuffer());if(b.length>12000000||b.length<100)throw Error("Invalid image size");await writeFile(path,b);console.log("Recovered media:",key,b.length);}catch(e){console.warn("Media unavailable at build:",key,e.message);}
}));
