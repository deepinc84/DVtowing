"use client";
import {usePathname} from "next/navigation";
import Motion from "./Motion";
export default function MotionShell(){const pathname=usePathname();return <Motion key={pathname}/>;}
