import Link from "next/link";
import {notFound} from "next/navigation";
import {areas,getArea} from "../../../lib/registry.mjs";
import {featured} from "../../../lib/site-content.mjs";
import GeoFeed from "../../../components/GeoFeed";
import Media from "../../../components/Media";
import {Call,Heading,Card,DispatchStrip} from "../../../components/SiteParts";
export const revalidate=300;
export function generateStaticParams(){return areas.filter(a=>a.id!=="diamond-valley").map(a=>({area:a.id}));}
export async function generateMetadata({params}){return {title:"Towing and roadside assistance near "+(getArea((await params).area)?.label||"Diamond Valley")};}
export default async function AreaPage({params}){const a=getArea((await params).area);if(!a||a.id==="diamond-valley")notFound();return <><section className="subhero"><div className="subhero-copy"><Link className="crumb" href="/service-areas/">← Service areas</Link><p className="eyebrow"><i/> ALBERTA FOOTHILLS</p><h1>Towing &amp; roadside help near {a.label}</h1><p>Contact Diamond Valley Tow &amp; Recovery to confirm service coverage and availability at your location.</p><Call/></div><div className="subhero-photo"><Media asset="emergency" alt="" eager/></div></section><section className="section"><Heading kicker="PLAN YOUR CALL" title={"Need help near "+a.label+"?"} copy="Share the nearest road, intersection or safe landmark, vehicle type and destination. For rural locations, a map pin can help dispatch identify your position."/></section><GeoFeed areaId={a.id}/><section className="section"><Heading kicker="SERVICES" title="Find the assistance you need."/><div className="cards">{featured.slice(0,4).map((id,i)=><Card key={id} id={id} index={i}/>)}</div></section><DispatchStrip/></>}
