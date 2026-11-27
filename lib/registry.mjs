// Core30 route IDs; registry is not a statement of current capabilities.
export const services = [
["general-towing","Car towing","towing"],["24-7-emergency-towing","Emergency towing","towing"],["flatbed-towing","Flatbed towing","towing"],["car-lockout","Car lockouts","roadside"],["battery-boost","Battery boosts","roadside"],["fuel-delivery","Fuel delivery","roadside"],["local-hauling","Local hauling","towing"],["tire-change","Tire changes","roadside"],["winch-out-recovery","Winch-out recovery","roadside"],["accident-recovery","Accident recovery","towing"],["wrecker","Wrecker towing","towing"],["motorcycle-towing","Motorcycle towing","towing"],["rv-towing","RV towing","towing"],["equipment-towing","Equipment towing","towing"],["long-distance-towing","Long-distance towing","towing"],["commercial-fleet-towing","Fleet towing","towing"]
].map(([id,label,group])=>({id,label,group,href:"/"+id+"/"}));
export const areas = [["diamond-valley","Diamond Valley"],["black-diamond","Black Diamond"],["turner-valley","Turner Valley"],["longview","Longview"],["okotoks","Okotoks"],["high-river","High River"],["millarville","Millarville"],["foothills-county","Foothills County"]].map(([id,label])=>({id,label,href:id==="diamond-valley"?"/":"/service-areas/"+id+"/"}));
export const getService=id=>services.find(s=>s.id===id);
export const getArea=id=>areas.find(a=>a.id===id);
export const candidateIds=services.map(s=>s.id);
export function allowedIds(value=""){return new Set(value.split(",").map(s=>s.trim()).filter(Boolean));}
