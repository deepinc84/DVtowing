import {NextResponse} from "next/server";
import {estimate,selectedRate} from "../../../lib/towing-quotes.mjs";
import {saveQuote} from "../../../lib/towing-quote-store.mjs";
import {calculateRoadRoute} from "../../../lib/towing-route.mjs";
export const runtime="nodejs";
export async function POST(req){
 const origin=req.headers.get("origin");if(origin!==new URL(req.url).origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 let data,q,route=null;
 try{
 if(!req.headers.get("content-type")?.startsWith("application/json"))throw Error("Invalid request");const body=await req.text();if(body.length>4096)throw Error("Invalid request");data=JSON.parse(body);
 const {service,pickup,destination,vehicle,km}=data;
 const input={service,pickup,destination,vehicle,km};
 const rate=selectedRate();
 if(data.routeMode===true){
  if(!data.originPoint||!data.destinationPoint||typeof data.destinationPoint!=="string")throw Error("Enter both pickup and destination.");
  if(service==="recovery"&&process.env.DV_RECOVERY_ROUTE_BILLING!=="true")throw Error("Route-based recovery mileage is not approved. Call dispatch or enter confirmed chargeable mileage manually.");
  route=await calculateRoadRoute(data.originPoint,data.destinationPoint,{pickupArea:pickup,destinationArea:destination});
  input.km=route.km;
  // Only server configuration can approve a mileage-based tow rule.
  const configured=process.env.DV_LONG_DISTANCE_BASE_CENTS;
  if(configured!==undefined&&/^\d+$/.test(configured)&&Number(configured)<=1000000)input.approvedMileageBaseCents=Number(configured);
 }
 q=estimate(input,rate);
 }catch(e){return NextResponse.json({error:e.message},{status:400,headers:{"Cache-Control":"no-store"}});}
 let saved=false;
 // Google Maps results and route-derived estimates are not written to the SEO archive.
 if(!route){try{saved=await saveQuote(q,data.consent===true);}catch{console.warn("Quote capture failed");}}
 return NextResponse.json({quote:q,route,saved,preview:!process.env.DV_RATE_VERSION},{headers:{"Cache-Control":"no-store"}});
}
