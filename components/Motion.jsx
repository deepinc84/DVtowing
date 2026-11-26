"use client";
import {useEffect} from "react";
export default function Motion(){
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(reduced.matches||!("IntersectionObserver" in window))return;
  const items=[...document.querySelectorAll("[data-reveal]:not([data-motion-state])")];
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.dataset.motionState="shown";observer.unobserve(entry.target);}},{threshold:.12,rootMargin:"0px 0px -15px 0px"});
  for(const el of items){if(el.getBoundingClientRect().top>window.innerHeight){el.dataset.motionState="pending";observer.observe(el);}else el.dataset.motionState="shown";}
  const clear=()=>{observer.disconnect();for(const el of items)delete el.dataset.motionState;};
  reduced.addEventListener?.("change",clear);
  return ()=>{reduced.removeEventListener?.("change",clear);clear();};
 }); // Re-run after client route changes via layout key below.
 return null;
}
