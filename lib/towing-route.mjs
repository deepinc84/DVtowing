// Transient Google route adapter. Do not log, store or publish provider results.
const fail=()=>{throw Error("Unable to verify this route. Check the addresses or call dispatch.");};
export function waypoint(value){
 if(typeof value==="string"&&value.trim().length>=5&&value.length<=220)return {address:value.trim()+", Alberta, Canada"};
 if(value&&typeof value.lat==="number"&&typeof value.lng==="number"&&Number.isFinite(value.lat)&&Number.isFinite(value.lng)&&value.lat>=48.9&&value.lat<=60.1&&value.lng>=-120.1&&value.lng<=-109.9)return {location:{latLng:{latitude:value.lat,longitude:value.lng}}};
 return fail();
}
export function routeDistance(meters){if(!Number.isFinite(meters)||meters<0||meters>1000000)return fail();return Math.round(meters/100)/10;}
export async function calculateRoadRoute(origin,destination,{key=process.env.DV_GOOGLE_MAPS_SERVER_KEY,enabled=process.env.DV_ROUTE_ENABLED,fetcher=fetch}={}){
 if(enabled!=="true"||!key)throw Error("Automatic routing is not configured. Choose a community estimate or contact dispatch.");
 const from=waypoint(origin),to=waypoint(destination);
 const response=await fetcher("https://routes.googleapis.com/directions/v2:computeRoutes",{method:"POST",cache:"no-store",signal:AbortSignal.timeout(10000),headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":"routes.distanceMeters,routes.duration"},body:JSON.stringify({origin:from,destination:to,travelMode:"DRIVE",routingPreference:"TRAFFIC_UNAWARE",regionCode:"CA",units:"METRIC"})});
 if(!response.ok)return fail();
 const r=(await response.json()).routes?.[0];if(!r)return fail();
 const km=routeDistance(r.distanceMeters);
 return {km,provider:"Google Maps"};
}
