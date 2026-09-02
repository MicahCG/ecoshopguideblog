# Bambana Analytics Operating Brief

## Purpose

This document is the operating context for Bambana analytics and growth reviews. The goal is to connect Pinterest discovery to measurable Shopify behavior and paid orders without confusing traffic volume with qualified demand.

The core funnel is:

Pinterest impression -> outbound click -> Shopify landing session -> product view -> add to cart -> reached checkout -> paid order

Keep analytics work in the dedicated **Bambana Analytics & Growth** thread. Keep storefront, catalog, campaign, and tracking implementation work in the main operational thread.

## Sources of truth

- Shopify is authoritative for storefront sessions, landing pages, product behavior, carts, checkouts, orders, and revenue.
- Pinterest is authoritative for campaign status, spend, impressions, outbound clicks, Pinterest-attributed events, catalog diagnostics, and product-group eligibility.
- A purchase exists only when Shopify shows a completed paid order.
- Do not use the legacy React or Vercel application's analytics as evidence for the Shopify storefront.
- Do not combine clicks to Amazon, Expedia, or another external destination with clicks to `shopbambana.com` when evaluating Shopify conversion.
- Treat attribution as directional. Treat campaign and storefront changes as correlated with performance unless a controlled test supports causation.

## Metric definitions

### Shopify

- **Session:** An online-store visit.
- **Landing-page session:** A session grouped by its first storefront page.
- **Add to cart:** A session in which at least one item was added.
- **Reached checkout:** A session that entered Shopify checkout.
- **Paid order:** A completed paid Shopify order. This is the business conversion.
- **Session-to-cart rate:** Sessions with cart additions divided by sessions.
- **Cart-to-checkout rate:** Sessions that reached checkout divided by sessions with cart additions.
- **Checkout-to-purchase rate:** Paid orders divided by sessions that reached checkout.

### Pinterest

- **Outbound click:** A click that leaves Pinterest for the destination.
- **Outbound CTR:** Outbound clicks divided by impressions.
- **CPOC:** Spend divided by outbound clicks.
- **Pin click:** Any click on the Pin. Do not treat this as a storefront visit.
- **Attributed checkout or purchase:** A Pinterest attribution result that must be reconciled against Shopify before it is trusted.

## Baseline: September 2, 2026

### Shopify, latest 7 days compared with the prior period

| Metric | Latest period | Prior period | Interpretation |
|---|---:|---:|---|
| Online-store visitors | 344 | 447 | Traffic is down about 23%. |
| Sessions | 365 | 500 | Traffic is down 27%. |
| Sessions with cart additions | 9 | 9 | Cart count is flat despite lower traffic. Session-to-cart improved from 1.8% to 2.47%. |
| Sessions that reached checkout | 2 | 8 | Checkout starts are down 75%. |
| Completed checkouts | 0 | 0 | No verified purchase conversion in this period. |

The store is not showing zero intent. Cart efficiency improved while traffic fell. The immediate weakness is progression from cart to checkout and from checkout to a paid order.

### Landing pages, latest 7 days

| Landing page | Sessions | Prior period | Cart additions | Reached checkout | Read |
|---|---:|---:|---:|---:|---|
| `/collections/dorm` | 99 | 65 | 1 | 0 | Current collection traffic winner, up about 52%. |
| `/collections/fall-halloween` | 85 | 279 | 0 | 0 | Still important, but traffic fell about 70% and direct landings did not create carts. |
| Homepage `/` | 40 | 78 | 0 | 0 | Down about 49%. It is not the main discovery path. |
| Large wooden pumpkin candle PDP | 21 | 0 | 0 | 0 | Strong new attention, but no cart signal yet. |
| Faux birch leaf stem PDP | 11 | 0 | 2 | 0 | High-intent product signal. |
| Tall bamboo bookshelf PDP | 8 | 0 | 0 | 0 | New attention, but no downstream action yet. |
| Faux pine-cone branch stem PDP | 7 | 1 | 1 | 0 | Small sample with useful cart intent. |
| Obsessed with Fall candle PDP | 5 | 0 | 2 | 1 | Strongest observed product-level funnel signal. |
| Dorm desktop organizer PDP | 3 | 1 | 1 | 0 | Small but promising signal. |
| Wood wall shelves PDP | 2 | 0 | 1 | 0 | Very small sample, but high intent. |
| `/collections/wedding` | 2 | not material | 0 | 0 | Too little Shopify traffic to judge. |

Do not scale a product from two or three sessions alone. Use these rows to choose what to feature and test next, then wait for a larger sample.

### Shopify growth, latest 30 days

- Paid traffic: 703 sessions
- Direct traffic: 253 sessions
- Organic traffic: 108 sessions
- Unknown traffic: 7 sessions
- Pinterest: 719 sessions and $0 attributed revenue
- Google Search: 87 sessions and $0 attributed revenue
- Bing: 10 sessions and $0 attributed revenue
- Total store sales shown: $44.91
- Sales attributed to marketing: $0

The $44.91 sale should be inspected at the order level before crediting or excluding any channel. Shopify currently does not attribute it to marketing.

### Pinterest campaign snapshot, latest 7 days shown on September 2

| Campaign | Objective | Outbound clicks | CTR | CPOC | Spend | Interpretation |
|---|---|---:|---:|---:|---:|---|
| Amazon: Fall & Halloween | Sales | 931 | 3.79% | $0.03 | $26.78 | Strongest click efficiency, but sends traffic to Amazon rather than Shopify. |
| Amazon: Dorm Consideration | Consideration | 276 | 1.29% | $0.10 | Efficient Amazon traffic, not evidence of Shopify conversion. |
| Amazon: Wedding Conversions | Sales | 259 | 4.60% | $0.11 | Strong CTR, but must be judged using Amazon results. |
| Expedia: Green Wellness Consideration | Consideration | 185 | 1.40% | $0.10 | External travel funnel, separate from Bambana retail. |
| Bambana: Dorm Conversions | Sales | 90 | 2.11% | $0.08 | Plausible contributor to Dorm's Shopify traffic growth. Verify downstream sessions and carts. |
| Bambana: Fall & Halloween Consideration | Consideration | 82 | 1.63% | $0.09 | Lower delivery than the Amazon Fall campaign and a plausible contributor to Fall's traffic decline. |
| Bambana Fall catalog campaign | Consideration | 0 | 0% | $0.00 | Too new to evaluate. Uses the 168-item Fall & Halloween Shopify product group. |

The visible Pinterest rows mix several destinations. Do not compare all Pinterest outbound clicks to Shopify sessions. Only campaigns landing on `shopbambana.com` belong in the Shopify funnel analysis.

## Important campaign and site changes

Maintain exact dates for every material change. Current known events:

- Lucent custom Pinterest events were removed after false conversion inflation.
- The Shopify and Pinterest native integration remains the intended Pinterest measurement path.
- The storefront rebranded from EcoShopGuide to Bambana and moved to `shopbambana.com`.
- `ecoshopguide.com` remains relevant as a redirect during migration.
- `shopbambana.com` is claimed in Pinterest and has the Pinterest domain verification tag in the public `<head>`.
- Pinterest catalog and product groups were repaired during the migration.
- Verified product groups on September 2:
  - Fall & Halloween: 168 in stock, 4 out of stock
  - Dorm: 152 in stock, 14 out of stock
  - Fall Finds Under $25: 56 in stock, 1 out of stock
- The Fall & Halloween catalog Consideration campaign was published on September 2 with campaign ID `626759734065`.
- The publish review showed a $5 daily budget. A later Ads Manager screenshot showed $3 daily. The analyst must verify the current live budget and record the reason for any discrepancy before interpreting spend or delivery.

## Current interpretation

1. **Dorm has the strongest collection momentum.** Its landing sessions rose while overall traffic fell. This supports continuing Dorm creative and improving the collection-to-product path.
2. **Fall demand is not absent, but the traffic mix changed.** The Fall collection lost about 70% of landing sessions while Amazon Fall ads remained extremely efficient. Traffic may have shifted toward Amazon or away from the Shopify Fall landing page.
3. **Product-level intent is concentrated.** The Obsessed with Fall candle and faux botanical stems produced the clearest cart or checkout behavior. They should receive stronger placement in Fall creative and collection merchandising, subject to stock, margin, and supplier checks.
4. **The primary Shopify problem is lower-funnel completion.** Nine cart sessions became two checkout sessions and no paid orders. Shipping clarity, checkout friction, price, trust, delivery expectations, and mobile experience should be investigated before increasing Shopify-directed spend.
5. **The catalog campaign is too new to judge.** Wait for enough delivery and at least several days of stable catalog health before comparing it with manual Bambana campaigns.
6. **Traffic alone is not the KPI.** The Amazon Fall campaign proves the creative can earn clicks. The open question is whether Bambana can turn similar intent into carts and paid orders on its own storefront.

## Weekly reporting cadence

Every weekly review should compare the latest 7 days with the prior 7 days and include a rolling 28-day view when the sample is small.

Report in this order:

1. Paid Shopify orders and revenue
2. Shopify funnel totals and step conversion rates
3. Collection and landing-page performance
4. Product-level views, carts, checkouts, and purchases
5. Pinterest campaign spend, outbound clicks, CTR, and CPOC
6. Catalog eligibility and feed health
7. Dated campaign, storefront, catalog, or tracking changes
8. Observed facts
9. Hypotheses with confidence levels
10. No more than three prioritized actions

## Decision rules

- Scale only when tracking is stable and downstream Shopify behavior supports the traffic signal.
- Prefer a campaign that creates product views and carts over one that only creates inexpensive outbound clicks.
- Do not optimize Pinterest toward checkout or purchase until those events are verified and frequent enough to guide delivery.
- Do not call a Pinterest purchase real until a paid Shopify order exists.
- Do not pause, launch, or materially change budgets without explicit authorization.
- Do not restore Lucent custom events, duplicate Pinterest tags, or parallel purchase emitters.
- Keep Amazon, Expedia, and Bambana storefront funnels separate.
- State sample size and uncertainty. Do not manufacture certainty from sparse data.

## Alerts

Flag these immediately:

- Pinterest purchases exceed paid Shopify orders.
- Spend rises while Shopify product views or cart additions fall.
- Cart-to-checkout or checkout-to-purchase rates materially deteriorate.
- Catalog ingestion fails or products become ineligible.
- The claimed domain becomes unverified.
- Ads resolve to an old domain, 404, redirect loop, or EcoShopGuide-branded page.
- An advertised product is unavailable or has a price mismatch.
- UTMs disappear or change unexpectedly.
- Campaign budgets differ from the approved change log.

## Weekly analyst template

### Executive read

Three to five sentences on what changed and what matters.

### Funnel

| Stage | Latest 7 days | Prior 7 days | Change | Interpretation |
|---|---:|---:|---:|---|
| Shopify sessions | | | | |
| Product views | | | | |
| Added to cart | | | | |
| Reached checkout | | | | |
| Paid orders | | | | |

### Winners and leaks

- Collections:
- Landing pages:
- Products:
- Campaigns:
- Catalog or tracking issues:

### Change log correlation

List dated changes and the performance movement that followed. Label each as observation, hypothesis, or controlled evidence.

### Recommended actions

| Priority | Action | Expected effect | Confidence | Evidence needed |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

