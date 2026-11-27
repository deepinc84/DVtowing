// Transient Google route adapter. Do not log, store or publish provider results.
const fail=()=>{throw Error("Unable to verify this route. Check the addresses or call dispatch.");};
export function waypoint(value){
 if(typeof value==="string"&&value.trim().length>=5&&value.length<=220)return {address:value.trim()+", Alberta, Canada"};
 if(value&&typeof value.lat==="number"&&typeof value.lng==="number"&&Number.isFinite(value.lat)&&Number.isFinite(value.lng)&&value.lat>=48.9&&value.lat<=60.1&&value.lng>=-120.1&&value.lng<=-109.9)return {location:{latLng:{latitude:value.lat,longitude:value.lng}}};
 return fail();
}
export function routeDistance(meters){if(!Number.isFinite(meters)||meters<0||meters>1000000)return fail();return Math.round(meters/100)/10;}
const aliases={"diamond valley":"diamond-valley","black diamond":"black-diamond","turner valley":"turner-valley","okotoks":"okotoks","high river":"high-river","longview":"longview","millarville":"millarville","foothills county":"foothills-county"};
export function communityMatches(components,selected){
 const pick=type=>components.find(c=>c.types?.includes(type));
 if(pick("country")?.short_name!=="CA"||pick("administrative_area_level_1")?.short_name!=="AB")return false;
 const candidates=components.filter(c=>c.types?.some(t=>["locality","sublocality","sublocality_level_1","neighborhood","administrative_area_level_3"].includes(t))).map(c=>aliases[c.long_name?.toLowerCase()]).filter(Boolean);
 const local=new Set(["diamond-valley","black-diamond","turner-valley"]);
 if(candidates.length)return candidates.includes(selected)||(selected==="diamond-valley"&&candidates.some(c=>local.has(c)))||(local.has(selected)&&candidates.includes("diamond-valley")&&!candidates.some(c=>c==="black-diamond"||c==="turner-valley"));
 return selected==="foothills-county"&&components.some(c=>c.long_name?.toLowerCase()==="foothills county");
}
async function verify(point,selected,key,fetcher){
 const p=new URLSearchParams({key,region:"ca"});if(point.address)p.set("address",point.address);else p.set("latlng",point.location.latLng.latitude+","+point.location.latLng.longitude);
 const res=await fetcher("https://maps.googleapis.com/maps/api/geocode/json?"+p,{cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!res.ok)return fail();const data=await res.json();if(data.status!=="OK")return fail();const r=data.results?.[0];if(!r||r.partial_match||!r.place_id||!communityMatches(r.address_components||[],selected))throw Error("Address and selected community could not be matched. Check both or call dispatch.");
 return {placeId:r.place_id};
}
export async function calculateRoadRoute(origin,destination,{pickupArea,destinationArea,key=process.env.DV_GOOGLE_MAPS_SERVER_KEY,enabled=process.env.DV_ROUTE_ENABLED,fetcher=fetch}={}){
 if(enabled!=="true"||!key)throw Error("Automatic routing is not configured. Choose a community estimate or contact dispatch.");
 let from=waypoint(origin),to=waypoint(destination);
 if(!pickupArea||!destinationArea)throw Error("Select both communities to verify route pricing.");
 [from,to]=await Promise.all([verify(from,pickupArea,key,fetcher),verify(to,destinationArea,key,fetcher)]);
 const response=await fetcher("https://routes.googleapis.com/directions/v2:computeRoutes",{method:"POST",cache:"no-store",signal:AbortSignal.timeout(10000),headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":"routes.distanceMeters,routes.duration"},body:JSON.stringify({origin:from,destination:to,travelMode:"DRIVE",routingPreference:"TRAFFIC_UNAWARE",regionCode:"CA",units:"METRIC"})});
 if(!response.ok)return fail();
 const r=(await response.json()).routes?.[0];if(!r)return fail();
 const km=routeDistance(r.distanceMeters);
 return {km,provider:"Google Maps"};
}
