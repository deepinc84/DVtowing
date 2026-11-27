import test from "node:test";
import assert from "node:assert/strict";
import {validateRateValues} from "../lib/towing-rate-fields.mjs";
import {estimate,rateById} from "../lib/towing-quotes.mjs";
test("new rate version does not change historic quote",()=>{const input={service:"tow",pickup:"black-diamond",destination:"turner-valley",vehicle:"light"};const old=rateById("fuel-15");const before=estimate(input,old);const updated={...validateRateValues({...old,local:15000}),id:"new-version",effectiveFrom:"2026-11-27T12:00:00Z"};assert.equal(estimate(input,updated).total,18113);assert.equal(before.total,15094);assert.equal(before.rate.local,12500);assert.equal(updated.mileageBasis,"loaded-tow-distance");});
test("reject invalid rate fields",()=>{const r=rateById("fuel-15");assert.throws(()=>validateRateValues({...r,local:-1}));assert.throws(()=>validateRateValues({...r,fuel:101}));assert.throws(()=>validateRateValues({...r,mileage:3.4}));});
