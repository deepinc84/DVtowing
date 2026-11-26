import Link from "next/link";
import {notFound} from "next/navigation";
import {services,getService,candidateIds} from "../../lib/registry.mjs";
import GeoFeed from "../../components/GeoFeed";
export const revalidate=300;
export function generateStaticParams(){return services.filter(s=>candidateIds.includes(s.id)).map(s=>({service:s.id}));}
export async function generateMetadata({params}){const s=getService((await params).service);return {title:s?.label||"Service"};}
export default async function ServicePage({params}){const s=getService((await params).service);if(!s||!candidateIds.includes(s.id))notFound();return <><section className="hero subhero"><div className="hero-inner"><Link href="/#services">← Services</Link><p className="eyebrow">DIAMOND VALLEY</p><h1 className="hero-in">{s.label}</h1><p>Service page concept. Dispatch information, operating limits and approved service copy will be added before publication.</p></div></section><section className="section" data-reveal="right"><h2>Service information</h2><p>Final details pending verification.</p><details><summary>What information will dispatch need?</summary><p>Your general location, vehicle type, issue and destination if applicable. Do not share private job information on public pages.</p></details></section><GeoFeed serviceId={s.id}/></>}
