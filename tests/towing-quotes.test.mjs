import test from "node:test";
import assert from "node:assert/strict";
import {estimate,rateById} from "../lib/towing-quotes.mjs";
const local={service:"tow",pickup:"black-diamond",destination:"turner-valley",vehicle:"light"};
test("local quote uses integer cents and rate history",()=>{assert.equal(estimate(local,rateById("fuel-15")).total,15094);assert.equal(estimate(local,rateById("fuel-25")).total,16406);});
test("Okotoks flat rates and high river",()=>{assert.equal(estimate({...local,destination:"okotoks"},rateById("fuel-15")).total,18113);assert.equal(estimate({...local,destination:"okotoks",vehicle:"one"},rateById("fuel-15")).total,21131);assert.equal(estimate({...local,destination:"high-river"},rateById("fuel-15")).total,21131);});
test("recovery distance",()=>{assert.equal(estimate({...local,service:"recovery",km:20},rateById("fuel-15")).total,39848);});
test("unconfirmed rules fail closed",()=>{assert.throws(()=>estimate({...local,vehicle:"threeQuarter"},rateById("fuel-15")));assert.throws(()=>estimate({...local,pickup:"okotoks"},rateById("fuel-15")));assert.throws(()=>estimate({...local,destination:"longview"},rateById("fuel-15")));assert.throws(()=>estimate({...local,service:"recovery",km:-1},rateById("fuel-15")));});
