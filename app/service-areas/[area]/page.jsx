import Link from "next/link";
import {notFound} from "next/navigation";
import {areas,getArea} from "../../../lib/registry.mjs";
import GeoFeed from "../../../components/GeoFeed";
export const revalidate=300;
export function generateStaticParams(){return areas.filter(a=>a.id!=="diamond-valley").map(a=>({area:a.id}));}
export async function generateMetadata({params}){return {title:getArea((await params).area)?.label||"Service area"};}
export default async function AreaPage({params}){const a=getArea((await params).area);if(!a||a.id==="diamond-valley")notFound();return <><section className="hero subhero"><div className="hero-inner"><Link href="/#coverage">← Coverage</Link><p className="eyebrow">PROPOSED SERVICE AREA</p><h1 className="hero-in">{a.label}</h1><p>Coverage and service details require customer approval before launch.</p></div></section><GeoFeed areaId={a.id}/></>}
