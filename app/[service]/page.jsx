import Link from "next/link";
import {notFound} from "next/navigation";
import {services,getService} from "../../lib/registry.mjs";
import {details,phone,tel} from "../../lib/site-content.mjs";
import GeoFeed from "../../components/GeoFeed";
import Media from "../../components/Media";
import Icon from "../../components/Icons";
import {Call,Card,Heading,DispatchStrip,Faq,Process} from "../../components/SiteParts";
export const revalidate=300;
export function generateStaticParams(){return services.map(s=>({service:s.id}));}
export async function generateMetadata({params}){const s=getService((await params).service);return {title:s?s.label+" in Diamond Valley":"Service",description:s?details[s.id].intro:undefined};}
export default async function ServicePage({params}){const s=getService((await params).service);if(!s)notFound();const d=details[s.id];return <><section className="subhero"><div className="subhero-copy"><Link className="crumb" href={s.group==="towing"?"/towing-services/":"/roadside-assistance/"}>← {s.group==="towing"?"Towing services":"Roadside assistance"}</Link><p className="eyebrow hero-in"><i/> DIAMOND VALLEY / ALBERTA</p><h1 className="hero-in">{s.label}</h1><p>{d.intro}</p><Call/></div><div className="subhero-photo">{d.asset?<Media asset={d.asset} alt="" eager/>:<div className="icon-scene"><Icon name={d.icon} size={110}/></div>}</div></section><DispatchStrip/><section className="section service-detail"><Heading kicker="SERVICE INFORMATION" title="What to know before you call."/><div className="detail-grid"><div><p className="lead">{d.intro}</p>{d.points.map(p=><p className="check-line" key={p}><Icon name="check"/>{p}</p>)}</div><aside className="quote-box"><h3>Request a quote</h3><p>Have your location, vehicle details and destination ready. Dispatch can confirm equipment, coverage and price.</p><Call/></aside></div></section><Process/><GeoFeed serviceId={s.id}/><Faq items={d.faq}/><section className="section"><Heading kicker="RELATED SERVICES" title="Other ways we can help."/><div className="cards">{services.filter(x=>x.group===s.group&&x.id!==s.id).slice(0,3).map((x,i)=><Card key={x.id} id={x.id} index={i}/>)}</div></section></>}
