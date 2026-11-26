import Link from "next/link";
import {readPublicFeed} from "../lib/geopost-store.mjs";
import {selectPosts} from "../lib/geoposts.mjs";
import {getService,getArea} from "../lib/registry.mjs";
export default async function GeoFeed({serviceId,areaId,limit=6}){
 const records=selectPosts(await readPublicFeed(),{serviceId,areaId,limit});
 if(!records.length)return null;
 return <section className="section evidence" aria-label="Recent towing jobs" data-reveal="up">
 <p className="eyebrow">LOCAL WORK / REAL JOBS</p><h2>Recent work in our service area</h2>
 <div className="cards">{records.map(p=><article className="post" key={p.id}>
 {p.photo&&<img src={p.photo.url} alt={p.photo.alt} width="640" height="360" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>}
 <div className="post-body"><p className="eyebrow"><time dateTime={p.completedOn}>{p.completedOn}</time> · {getArea(p.areaId).label}</p><h3>{p.title}</h3><p>{p.summary}</p>
 <div className="related">{p.serviceIds.filter(id=>id!==serviceId).map(id=><Link key={id} href={getService(id).href}>{getService(id).label}</Link>)}{p.areaId!==areaId&&<Link href={getArea(p.areaId).href}>{getArea(p.areaId).label}</Link>}</div></div></article>)}</div>
 </section>;
}
