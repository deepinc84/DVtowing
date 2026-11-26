# Diamond Valley Towing — Core30 service architecture and recovery strategy
Date: 2026-11-26 | Status: planning, not production approval | Repo: deepinc84/DVtowing

## Objective and constraints
Recover the owner's independent web presence, retain visual recognition, and build a standalone SEO-first Next.js site using the Core30 principles from Trusted Engine, without importing its proprietary code, database, account or deployment infrastructure. No Vercel Git integration, production DNS, GBP edits, paid spend, or Trusted Engine calls now. Later demo: a separate project in the StackSync Vercel account, not the StackSync project itself, after the content and brand are ready. Use preview noindex/auth where practical; never point dvtowing.ca at a demo.

## Evidence and identity gate
Sources: supplied HTML ZIP (11 complete browser-saved HTML pages and assets), recovered text ZIP, live public business lookup and PlePer service scrape on 2026-11-26. Client public listing matches 403-561-0126, 394081 168 St W, Foothills County AB T0L 0H0, primary category Towing service, place ID ChIJ18tLImKlcVMR4lw4z10c40I, no reviews found. Existing site email info@dvtowing.ca. Public business listing advertises 24-hour availability; site homepage claims 23.5/6.5 and contact page lists office 9AM–5PM. Confirm dispatch days/hours and office hours separately. Other domain https://diamondvalleytowing.ca/ uses same business name and 1-368-210-0096 with links to Dave's Towing; relationship unverified. Do not use its number, logo, claims or review data. Older recycling listings share the client phone/address; confirm legal business relationship, dedicated towing line if applicable, correct public NAP and whether customers are served at a signed staffed premises. Do not display a map pin/address as a storefront if this is a service-area-only business. Confirm actual GBP owner/manager access before changes.

## PlePer exact snapshot
Tool: https://pleper.com/index.php?do=tools&sdo=scrape_google_listing_services
Client: Car towing; Battery; Battery service; Car lockouts; Fuel delivery; Local hauling.
Red Rescue Towing (ChIJu3gEbJeGfaMRTBc7XIDXs2A): Battery service; Car lockouts; Car towing; Fuel delivery; Local hauling; Long distance hauling; Tire change; 24 Hour Emergency Towing Services; Car Battery Boosting; Car Lockout Assistance; Car Unlocking Services; Cars And Trucks; Emergency Roadside Assistance; Fuel Delivery Service; Light Duty Towing; Locked Out; Medium Duty Towing; Prompt Assistance; Quick Service; Rescue Towing; Tire Change Services; Tow Trucks; Towing Assistance; Towing For Cars; Winch Out Services.
All entries in Towing service; no descriptions or prices returned. Client has 6 entries, Red Rescue 25; many duplicate intents. Public business lookup: Red Rescue 5.0/495 reviews; A & A 4.8/18 reviews; client zero found. Snapshot only; not a grid rank test. Other competitors' GBP services not scraped, do not infer their GBP menus from websites.

## Competitor comparison
| Competitor | Evidence | What DV should learn |
|---|---|---|
| Red Rescue | https://www.towingservicesturnervalley.ca/ | Most direct local competitor; unlock, fuel, winch-out, heavy duty pages; broad local coverage, strong review proof. Prioritize genuine customer reviews and distinct roadside pages. |
| Same-name website | https://diamondvalleytowing.ca/ | Extensive service, community and highway architecture with different phone. Identity conflict to investigate; do not copy the other brand. |
| A & A | https://www.highrivertowingcompany.ca/ | Towing, lockouts, impound pages, boosts/fuel/tire service, High River presence. Don't offer impound unless real. |
| RST | https://rsttowing.ca/service-areas/okotoks/ | Strong location page with roads, local context, service links and local FAQs. Model the useful structure, not text. |
| Okotoks Towing Services | https://okotokstowingservices.ca/ | Extensive service/area navigation; avoid mass-produced location pages and thin boilerplate. |
| Dave's | https://highrivertowing.ca/ | Emergency and intercity positioning; monitor only after identity clarification. |
No verified search volume, competitor word counts, map rank or conversion data. These are qualitative public-page comparisons, not measured rankings.

## Original site audit (HTML main-content whitespace word count; includes repeated headings and FAQ text)
| URL | Words | Decision |
|---|---:|---|
| / | 644 | Rewrite: local dispatch, primary intent and service hierarchy; keep palette, logo, calls, useful process. |
| /about-us/ | 93 | Expand with owner-approved history, real crew, fleet, coverage. |
| /contact-us/ | 74 | Rebuild actual dispatch and contact flow, office vs emergency hours. |
| /car-lockout/ | 490 | Retain URL; fix wrong general-towing intro; rewrite genuine lockout service. |
| /general-towing/ | 504 | Retain URL as canonical car/light-duty towing page; remove US mileage wording. |
| /24-7-emergency-towing/ | 531 | Preserve URL only with confirmed hours; otherwise redirect to /emergency-towing/. |
| /motorcycle-towing/ | 564 | Verify equipment, straps and vehicle compatibility; hold until approved. |
| /flatbed-towing/ | 561 | Verify actual flatbed fleet; remove universal damage guarantees. |
| /wrecker/ | 563 | Retain if actually operated; focus recovery; no assumed heavy boom fleet. |
| /equipment-towing/ | 529 | Confirm weights, trailer types, insurance and actual transport capabilities. |
| /rv-towing/ | 625 | Confirm RV classes, GVWR and equipment; hold if unavailable. |
All 11 have zero H1 in saved page content. Contact page contains Elementor form with name/email/phone/message; backend destination and submission handling not recoverable. Original FAQs, duplicate headings, unsupported certifications, 15–30 minute response, testimonials, achievement counters, zero-damage guarantees and US DOT language must not be republished without evidence. Keep business facts after owner confirmation; preserve valuable URLs or relevant 301 redirects. Do not assume no existing rankings: export GSC landing pages and queries before migration.

## Core30 target map: 30 distinct routes, not 30 automatic indexable pages
P0 = launch candidate after owner verification, P1 = capability/coverage approval and unique content, P2 = evidence or meaningful demand required. No sitemap/GBP entry for unavailable services. Hold unapproved routes out of production; use noindex only on private demo. Homepage owns brand + broad Diamond Valley towing; no separate duplicate Diamond Valley landing page.
| # | Route | Intent / parent | Stage |
|---:|---|---|---|
| 1 | / | Brand + towing service Diamond Valley | P0 |
| 2 | /towing-services/ | Towing hub | P0 |
| 3 | /roadside-assistance/ | Roadside hub | P0 |
| 4 | /general-towing/ | Car towing/light duty; towing hub | P0 |
| 5 | /24-7-emergency-towing/ | Emergency towing; confirm hours | P1 |
| 6 | /flatbed-towing/ | Flatbed; towing hub | P1 |
| 7 | /car-lockout/ | Car lockouts; roadside hub | P0 |
| 8 | /battery-boost/ | Battery service/jump starts; roadside hub | P0 |
| 9 | /fuel-delivery/ | Emergency fuel delivery; roadside hub | P0 |
| 10 | /local-hauling/ | Scheduled local vehicle hauling; towing hub | P0 |
| 11 | /tire-change/ | Spare tire assistance; roadside hub | P1 |
| 12 | /winch-out-recovery/ | Snow/ditch recovery; roadside hub | P1 |
| 13 | /accident-recovery/ | Collision vehicle recovery; towing hub | P1 |
| 14 | /wrecker/ | Wrecker equipment/vehicle recovery; towing hub; merge with recovery if no distinct intent | P1 |
| 15 | /motorcycle-towing/ | Motorcycle transport; towing hub | P1 |
| 16 | /rv-towing/ | RV/trailer towing; towing hub | P1 |
| 17 | /equipment-towing/ | Compatible equipment hauling; towing hub | P1 |
| 18 | /long-distance-towing/ | Intercity transport; towing hub | P1 |
| 19 | /commercial-fleet-towing/ | Fleet/repair shop accounts; towing hub | P2 |
| 20 | /service-areas/ | Coverage hub | P0 |
| 21 | /service-areas/black-diamond/ | Former Black Diamond area, distinct real coverage | P1 |
| 22 | /service-areas/turner-valley/ | Former Turner Valley area, distinct real coverage | P1 |
| 23 | /service-areas/longview/ | Longview local coverage | P1 |
| 24 | /service-areas/okotoks/ | Okotoks local coverage | P1 |
| 25 | /service-areas/high-river/ | High River local coverage | P1 |
| 26 | /service-areas/millarville/ | Millarville local coverage | P2 |
| 27 | /service-areas/foothills-county/ | Rural Foothills, highway and rural dispatch | P1 |
| 28 | /about-us/ | Business and fleet evidence | P0 |
| 29 | /contact-us/ | Dispatch/contact | P0 |
| 30 | /towing-cost/ | Pricing factors, approved quote process, no fabricated rate | P1 |
Privacy page outside Core30; project evidence/case studies only once genuine work is supplied. If areas lack evidence or unique content consolidate into service-areas hub, not doorway pages. Black Diamond and Turner Valley are now Diamond Valley; do not imply independent storefronts. Avoid keyword-swapped service × location combinations. Final count depends on verified services.

## GBP mirror and proposed descriptions (owner approve first)
Primary category Towing service. Keep current accurate standard services; Battery and Battery service map to one battery-boost page, avoid duplicate custom labels. All P0 services still require owner verification.
| GBP service name | Route | Draft description |
|---|---|---|
| Car towing | /general-towing/ | Local towing for cars and compatible passenger vehicles in Diamond Valley. Call with vehicle details, pickup location and destination for availability and a quote. |
| Battery service | /battery-boost/ | Roadside battery boost for compatible vehicles that will not start. Call with your location and vehicle details so we can confirm availability. |
| Car lockouts | /car-lockout/ | Vehicle lockout assistance in our service area. Contact dispatch with your vehicle details and proof of authorization. |
| Fuel delivery | /fuel-delivery/ | Roadside fuel delivery for drivers who run out of fuel. Contact us with your location and required fuel type. |
| Local hauling | /local-hauling/ | Scheduled local transport for compatible vehicles. Share pickup, destination and vehicle condition for a quote. |
Conditional new GBP services map one-to-one to approved pages: Emergency towing, Flatbed towing, Tire change, Winch-out recovery, Accident recovery, Wrecker towing (if distinct), Motorcycle towing, RV towing, Equipment towing, Long distance hauling, Commercial fleet towing. Use accurate natural descriptions and actual service limits; avoid fake 24/7, city spam, repeated synonyms, irrelevant categories, prices not approved. Google services help https://support.google.com/business/answer/9455399 and representation https://support.google.com/business/answer/3038177; https://support.google.com/business/answer/9157481 for service areas.

## Content depth standards
One meaningful H1; unique title, description, self-canonical and breadcrumb per indexable page. Service template: what problem is solved, compatibility/limitations, when to call, what dispatch needs, real process, price factors (not invented), relevant locations, genuine proof, 3–5 specific FAQs, contextual related links, dispatch CTA. Suggested 450–850 words when useful; no minimum as ranking rule. Location template: actual service radius/roads, rural GPS pin guidance, verified coverage, unique job proof, links to approved services, local questions. Avoid fake addresses, invented average arrival, unsupported credentials or search-volume claims. Homepage clear first screen for emergency towing and roadside help, then service matrix, coverage, dispatch process, proof, FAQ, and CTA. Safety: emergency danger call 911, do not encourage drivers to use phone while driving.

## Technical and evidence architecture
Independent Next.js/TypeScript App Router, static content data single source (business, services, areas, nav, schema, sitemap). Content registry stable IDs; approval flags; route/GBP mapping; reusable cards and breadcrumbs. Service schema linked to a single truthful LocalBusiness entity, Organization/WebSite/BreadcrumbList; FAQ markup only if accurate and visible, no promised rich result. Actual NAP consistent with verified GBP, homepage and footer. No fake reviews/AggregateRating, no partner crosslinks without permission. Real job evidence (approved photos, town, problem, work, date, outcome) links to service and area, no private customer data. Links: homepage → hubs → services → relevant area pages → real jobs → service; no orphan pages. Canonical HTTPS apex or www consistently selected after migration. Preserve trailing-slash legacy URL behavior or exact redirects, sitemap only 200 approved canonical pages, robots preview blocked plus noindex/auth. Mobile first, optimized WebP/AVIF, lazy load below fold, font subsets, accessible contrast/focus, keyboard nav, responsive images. LCP/INP/CLS measured after deploy. GA4/GSC later, tel and contact event instrumentation without collecting personal information in analytics. Contact form uses secure server-side delivery, rate limits and validation; no fake submission success. Test mobile click-to-call, contact handling, links, redirects, metadata and schema.

## Visual direction and image recovery
Original CSS tokens: red #DB0507, black #000000, white #FFFFFF, grey #C3C3C3; Saira headings and Poppins body. Keep original logo PNG (1,118,945 bytes); optimize for display without changing design. Design concept: custom dark road/industrial header, angled red dispatch accents, readable white sections, distinctive service grid, mobile sticky call action. No generic agency template or Trusted roofing styling. Maintain unique feel from existing site; replace clutter and over-animation. Browser HTML archive contains 22 distinct image binaries after SHA256 dedupe (logo, eight service photographs, icons, portraits, assorted imagery). Three CSS background URLs missing from ZIP: diamondvalley-banner.png, back-view-new-tow-trucks-parked-near-road-city_75939-188.avif, transport-logistics-products-scaled.jpg. Preserve references in asset manifest; don't hotlink after DNS switch. Confirm usage rights and whether photos show real equipment. Remove testimonial portraits and unverified counters. Prefer owner's genuine truck/crew/action photos for hero and proof; generate original abstract road/industrial decorative graphics only as needed, never synthetic images represented as actual fleet or completed jobs. Do not use competitor imagery. If assets are not authorized, replace with licensed photos or original illustrations. Recovered images remain reference-only until approved.

## Delivery and acceptance
1. Owner approves NAP, GBP control, services, fleet, hours, coverage, image rights and reviews.
2. Commit independent architecture/content and build local responsive prototype in DVtowing repo; preserve existing HTML archive privately.
3. Flesh out approved pages and media; lint/typecheck/build and visual QA; no deployment until ready.
4. Separate demo in StackSync account with isolated project/budget and no Git auto-deploy until explicitly approved; preview noindex; do not touch live StackSync or Trusted deployments.
5. Before production: GSC baseline, route/redirect tests, form delivery, domain canonical, DNS backup, MX/TXT retained; customer approval.
6. Post-launch: measure impressions, nonbrand query clusters, organic landing pages, GBP calls/website actions, real leads and jobs; genuine review acquisition; no ranking guarantees.

Sources: supplied archives; PlePer lookup above; public competitor URLs in table; https://www.bbb.org/ca/ab/black-diamond/profile/new-auto-parts/black-diamond-auto-parts-recycling-ltd-0017-89720 and https://recyclecars.ca/?page_id=14 for historic NAP overlap. No private account changes made.
