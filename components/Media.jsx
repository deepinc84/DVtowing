"use client";
import {useState} from "react";
import {localMedia,mediaUrl} from "../lib/media.mjs";
export default function Media({asset,alt="",className="",eager=false,fallback, ...props}){
 const [step,setStep]=useState(0);
 const sources=[localMedia(asset),mediaUrl(asset),...(fallback?[localMedia(fallback),mediaUrl(fallback)]:[]),"/media/road-illustration.svg"];
 const i=Math.min(step,sources.length-1);
 return <img {...props} src={sources[i]} alt={alt} className={className} loading={eager?"eager":"lazy"} fetchPriority={eager?"high":"auto"} decoding="async" onError={()=>setStep(s=>Math.min(s+1,sources.length-1))}/>;
}
