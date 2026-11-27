export const RATE_FIELDS=[["local","Local towing"],["okotoksLight","Okotoks light vehicle"],["okotoksOne","Okotoks 1-ton"],["highRiver","High River"],["recovery","Recovery base"],["mileage","Mileage / km"],["cleanup","Cleanup / hour"],["storage","Impound / day"],["longDistanceBase","Mileage-based tow base"]];
export function validateRateValues(input){
 if(!input||typeof input!=="object")throw Error("Invalid rates.");
 const result={};
 for(const [key,label] of RATE_FIELDS){
  const n=input[key];if(key==="longDistanceBase"&&n===null){result[key]=null;continue;}
  if(!Number.isSafeInteger(n)||n<0||n>1000000)throw Error(label+" must be 0 to 10,000 dollars in cents.");
  result[key]=n;
 }
 for(const key of ["fuel","gst"]){const n=input[key];if(typeof n!=="number"||!Number.isFinite(n)||n<0||n>100||Math.abs(n*100-Math.round(n*100))>1e-8)throw Error("Invalid "+key+" percentage.");result[key]=n;}
 return {...result,mileageBasis:"loaded-tow-distance"};
}
