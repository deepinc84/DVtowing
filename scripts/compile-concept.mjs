import {JSDOM} from "jsdom";
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {services,areas} from "../lib/registry.mjs";
const body=await readFile("design/concept07/body.html","utf8");
const script=await readFile("design/concept07/prototype.js","utf8");
const dom=new JSDOM("<!doctype html><html><head><title>Diamond Valley</title></head><body>"+body+"</body></html>",{url:"https://dvtowing.vercel.app/#/",runScripts:"outside-only",pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.HTMLElement.prototype.scrollBy=function(){};
const cutoff=script.indexOf("window.addEventListener('hashchange'");
if(cutoff<0)throw Error("Prototype route entry not found");
w.eval(script.slice(0,cutoff)+"route();window.__renderRoute=route;");
const doc=w.document;
const paths=["/",...services.map(s=>s.href),"/towing-services/","/roadside-assistance/","/service-areas/",...areas.filter(a=>a.id!=="diamond-valley").map(a=>a.href),"/about-us/","/contact-us/","/towing-cost/"];
if(new Set(paths).size!==30)throw Error("Core30 route count changed");
const fix=(root,path)=>{for(const a of root.querySelectorAll("a[href]")){const h=a.getAttribute("href");if(h.startsWith("#/"))a.setAttribute("href",h.slice(1));else if(h==="#services"||h==="#reviews")a.setAttribute("href",(path==="/"?"":"/")+h);a.removeAttribute("data-home");}
 for(const el of root.querySelectorAll("[data-ready]"))el.removeAttribute("data-ready");
 for(const el of root.querySelectorAll(".geo-prev,.geo-next"))el.removeAttribute("disabled");
 for(const el of root.querySelectorAll(".geo-counter"))el.textContent=el.closest(".geo-section").querySelectorAll(".geo-card").length+" examples";
};
const pages={};
for(const path of paths){w.__renderRoute("#"+path);const node=doc.querySelector(path==="/"?"#home":"#detail").cloneNode(true);node.removeAttribute("hidden");fix(node,path);
 const geo=node.querySelector("[data-geopost-feed]");let scope=null,samples=null;
 if(geo){scope={serviceId:geo.dataset.service||null,areaId:geo.dataset.area||null,group:geo.dataset.group||null};samples=geo.outerHTML;geo.replaceWith(doc.createComment("GEOPost_SLOT"));}
 if(!node.querySelector("h1"))throw Error("Missing H1 "+path);
 pages[path]={title:doc.title,description:node.querySelector(".route-description,.hero-copy p:not(.eyebrow)")?.textContent||"Towing and roadside assistance in Diamond Valley and the Alberta Foothills.",html:node.outerHTML,scope,samples};}
const header=[doc.querySelector(".top"),doc.querySelector(".header")].map(n=>{const x=n.cloneNode(true);fix(x,"/interior/");return x.outerHTML}).join("");
const footer=[doc.querySelector(".foot"),doc.querySelector(".mobile-call")].map(n=>{const x=n.cloneNode(true);fix(x,"/interior/");return x.outerHTML}).join("");
await mkdir("generated",{recursive:true});
await writeFile("generated/concept-pages.json",JSON.stringify({pages,header,footer}));
w.close();
console.log("Compiled "+paths.length+" independent HTML routes from approved Concept 07.");
