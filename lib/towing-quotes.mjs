import {getArea} from "./registry.mjs";
import {validateRateValues} from "./towing-rate-fields.mjs";
const common={local:12500,okotoksLight:15000,okotoksOne:17500,highRiver:17500,recovery:25000,mileage:400,cleanup:17500,storage:7900,gst:5,longDistanceBase:null,mileageBasis:"loaded-tow-distance"};
export const RATE_HISTORY=Object.freeze([
 Object.freeze({...common,id:"fuel-25",fuel:25,status:"previous",effectiveFrom:null}),
 Object.freeze({...common,id:"fuel-15",fuel:15,status:"planned",effectiveFrom:null})
]);
export const SERVICES={tow:"general-towing",recovery:"winch-out-recovery"};
const local=new Set(["diamond-valley","black-diamond","turner-valley"]);
export const vehicles={light:"Car / SUV / less than ¾-ton",threeQuarter:"¾-ton",one:"1-ton",other:"Other / specialized"};
export function rateById(id){return RATE_HISTORY.find(r=>r.id===id);}
export function selectedRate(env=process.env){if(env.DV_RATE_VERSION&&!rateById(env.DV_RATE_VERSION))throw Error("Invalid configured rate version");return rateById(env.DV_RATE_VERSION)||rateById("fuel-15");}
function fail(message){throw new Error(message);}
export function estimate(input,rate){
 if(!input||!rate||typeof rate.id!=="string"||!rate.id)fail("Invalid quote or rate");
 validateRateValues(rate);
 const {service,pickup,destination,vehicle}=input;
 if(!getArea(pickup)||!getArea(destination)||!Object.hasOwn(vehicles,vehicle)||!Object.hasOwn(SERVICES,service))fail("Select valid locations, vehicle and service.");
 if(vehicle==="other"||vehicle==="threeQuarter")fail("Contact dispatch for this vehicle class.");
 if(service==="tow"&&!local.has(pickup))fail("Contact dispatch for pickup outside Diamond Valley.");
 const raw=input.km;const km=raw===""||raw==null?null:Number(raw);
 if(km!==null&&(!Number.isFinite(km)||km<0||km>1000||Math.abs(Math.round(km*10)-km*10)>1e-8))fail("Enter a distance from 0 to 1000 km (one decimal).");
 let base,mileage=0;
 if(service==="recovery"){if(km===null||km===0)fail("Enter the chargeable recovery distance.");base=rate.recovery;mileage=Math.round(km*rate.mileage); }
 else if(local.has(destination)){if(vehicle!=="light")fail("Contact dispatch to confirm local heavy-vehicle pricing.");base=rate.local;}
 else if(destination==="okotoks"){base=vehicle==="one"?rate.okotoksOne:rate.okotoksLight;}
 else if(destination==="high-river"){if(vehicle!=="light")fail("Contact dispatch to confirm heavy-vehicle pricing.");base=rate.highRiver;}
 else if(Number.isSafeInteger(rate.longDistanceBase)&&rate.longDistanceBase>=0&&input.verifiedRoute===true&&vehicle==="light"&&km!==null&&km>0){base=rate.longDistanceBase;mileage=Math.round(km*rate.mileage);}
 else fail("Contact dispatch for this route; mileage-only towing rules are not confirmed.");
 const subtotal=base+mileage,fuel=Math.round(subtotal*rate.fuel/100),tax=Math.round((subtotal+fuel)*rate.gst/100);
 return {serviceId:SERVICES[service],pickup,destination,vehicle,km:service==="recovery"||mileage>0?km:null,base,mileage,subtotal,fuel,tax,total:subtotal+fuel+tax,rate:{...rate},currency:"CAD"};
}
export const money=c=>new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD"}).format(c/100);
