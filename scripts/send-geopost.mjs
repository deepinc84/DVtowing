// Run only against an explicitly configured, authorized receiver.
import {readFile} from "node:fs/promises";
import {createHmac} from "node:crypto";
const file=process.argv[2],target=process.env.GEOPOST_RECEIVER_URL,secret=process.env.GEOPOST_SECRET;
if(!file||!target||!secret||secret.length<32)throw Error("Usage: set GEOPOST_RECEIVER_URL and GEOPOST_SECRET, then node scripts/send-geopost.mjs approved-job.json");
const url=new URL(target);
if((url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1","[::1]"].includes(url.hostname)))||url.username||url.password||url.search||url.hash||!["/api/geoposts/","/api/geoposts"].includes(url.pathname))throw Error("Use the exact receiver endpoint");
url.pathname="/api/geoposts/";
const body=await readFile(file);if(body.length>32000)throw Error("Payload exceeds 32 KB");
JSON.parse(body.toString("utf8"));
const timestamp=String(Math.floor(Date.now()/1000));
const signature="sha256="+createHmac("sha256",secret).update(timestamp+".").update(body).digest("hex");
const response=await fetch(url,{method:"POST",redirect:"error",headers:{"content-type":"application/json","x-geopost-timestamp":timestamp,"x-geopost-signature":signature},body,signal:AbortSignal.timeout(30000)});
if(!response.ok){console.error("Receiver returned HTTP "+response.status);process.exitCode=1;}else{const result=await response.json();console.log(JSON.stringify({ok:result.ok,changed:result.changed,id:result.id,revision:result.revision}));}
