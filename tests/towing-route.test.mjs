import test from "node:test";
import assert from "node:assert/strict";
import {waypoint,routeDistance,calculateRoadRoute} from "../lib/towing-route.mjs";
import {estimate,rateById} from "../lib/towing-quotes.mjs";
test("address and opted-in GPS waypoints",()=>{assert.deepEqual(waypoint("123 Example St"),{address:"123 Example St, Alberta, Canada"});assert.deepEqual(waypoint({lat:50.7,lng:-114.2}),{location:{latLng:{latitude:50.7,longitude:-114.2}}});assert.throws(()=>waypoint({lat:0,lng:0}));});
test("road route request and distance conversion",async()=>{let body;const r=await calculateRoadRoute("123 Example St","456 Example Rd",{key:"fake",enabled:"true",fetcher:async(url,opts)=>{body=JSON.parse(opts.body);assert.equal(opts.cache,"no-store");return {ok:true,json:async()=>({routes:[{distanceMeters:23740}]})};}});assert.equal(r.km,23.7);assert.equal(body.travelMode,"DRIVE");assert.throws(()=>routeDistance(-1));});
test("route feature disabled without configuration",async()=>{await assert.rejects(calculateRoadRoute("123 Example St","456 Example Rd",{enabled:"false",key:"fake"}));});
test("flat price overrides mileage; approved long-distance example",()=>{const i={service:"tow",pickup:"black-diamond",destination:"okotoks",vehicle:"light",km:40,approvedMileageBaseCents:12500};assert.equal(estimate(i,rateById("fuel-15")).total,18113);assert.equal(estimate({...i,destination:"longview"},rateById("fuel-15")).total,34414);assert.throws(()=>estimate({...i,destination:"longview",approvedMileageBaseCents:undefined},rateById("fuel-15")));});
