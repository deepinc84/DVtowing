const origin="https://dvtowing.ca/wp-content/uploads/";
export const media={
 logo:"2026/04/diamond-valley-logo-1-300x300.png",
 hero:"2026/08/diamondvalley-banner.png",
 general:"2026/08/towing-a-toyota-1-e1611577573942-1536x814-1.jpg",
 emergency:"2026/08/247car.webp",
 lockout:"2026/08/car-lockout.jpg",
 flatbed:"2026/08/Flatbed-Towing-1.png",
 wrecker:"2026/08/Wrecker-Towed.webp",
 motorcycle:"2026/08/Motorcycle-Towing.jpg",
 equipment:"2026/08/Equipment-Towing.png",
 rv:"2026/08/RV-Towing.png",
 about:"2026/08/woman-insurance-agent-prepares-documents-car-that-is-taken-away-by-tow-truck_151013-15738.avif",
 trucks:"2026/08/back-view-new-tow-trucks-parked-near-road-city_75939-188.avif"
};
export function mediaUrl(key){return origin+media[key];}
export function localMedia(key){return "/media/"+key+"."+media[key].split(".").pop();}
