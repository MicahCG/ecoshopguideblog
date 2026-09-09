# Seasonal and holiday Make destination audit

Verified September 9, 2026, America/Chicago. Responsible task: Designer, supporting Make.com Scenarios, Executive Manager, Inventory and Newsletter. Make owns scenario edits and example runs. Inventory owns assortment sourcing and Amazon verification. Newsletter owns the single consolidated owner email.

## Final repair routing

The original holiday A/B scenes did not show products sold by their destinations. They are superseded by five product-constrained assets across six repaired static example routes.

| Route | Final creative | Destination | Fidelity decision |
|---|---|---|---|
| Original Shopify A, scenario `6217798` | [White & Gold overlay](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/shopify-white-gold-overlay.png?v=1788992614) | [Seasonal & Holiday Decor](https://shopbambana.com/collections/seasonal-holiday-decor) | Green. The scene preserves the collection's clear glass ornaments, cream knit stocking and tall gold tree. |
| Original Shopify B, scenario `6217903` | [White & Gold, no overlay](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/white-gold-shopify.png?v=1788988965) | [Seasonal & Holiday Decor](https://shopbambana.com/collections/seasonal-holiday-decor) | Green. Same product anchors, text-free treatment. |
| Existing Shopify Holiday Decor, scenario `6197244` | [White & Gold, no overlay](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/white-gold-shopify.png?v=1788988965) | [Seasonal & Holiday Decor](https://shopbambana.com/collections/seasonal-holiday-decor) | Green for a bounded static example. Replace its generic output and incorrect Amazon CTA/disclosure, while preserving its schedule. |
| Original Amazon A | [18 gifts overlay](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/amazon-holiday-a-overlay.png?v=1788992613) | [18-item holiday gift list](https://amzn.to/4xrmdde) | Green. The pictured preserved-rose heart box, six amber candle jars and two crystal bears are exact list products. |
| Original Amazon B | [Exact gifts, no overlay](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/amazon-holiday-b-no-overlay.png?v=1788992613) | [18-item holiday gift list](https://amzn.to/4xrmdde) | Green. Same exact product vignette, text-free treatment. |
| Existing Amazon Fall, scenario `6190833` | [Exact fall products](https://cdn.shopify.com/s/files/1/1020/7536/7789/files/amazon-fall-exact-products.png?v=1788992614) | [23-item seasonal list](https://amzn.to/4r2bkNp) | Green for a bounded static example. It shows six exact list product families and no unrelated decor. |

Preserve inactive template `6188781`. A static example validates the static mapping and Pinterest output, not the fidelity of later unconstrained image generation.

## Final metadata for repaired routes

Use identical Shopify A/B metadata so the creative treatment remains the only experiment variable.

### Shopify A, Shopify B and scenario 6197244

- Title: `White and gold Christmas decor for a calm, polished home`
- Description: `Style a lighter Christmas with clear glass ornaments, a cream knit stocking and sculptural gold accents. Shop 15 seasonal and holiday pieces from Bambana.`
- Alt text: `White and gold Christmas mantel with clear glass ornaments, cream knit stockings and sculptural gold trees.`

### Amazon holiday A and B

- Title: `18 thoughtful holiday gifts for her and him`
- Description: `Find preserved roses, amber-jar candles, crystal keepsakes and 15 more thoughtful picks for her and him. As an Amazon Associate I earn from qualifying purchases.`
- A alt text: `Heart-shaped box of red preserved roses with six amber candle jars and two clear crystal bear figurines. Text reads 18 thoughtful holiday gifts.`
- B alt text: `Heart-shaped box of red preserved roses with six amber candle jars and two clear crystal bear figurines.`

### Amazon Fall, scenario 6190833

- Title: `Warm fall decor for Thanksgiving gatherings`
- Description: `Style the season with a dried bouquet, amber vase, wood tray, orange runner, raised-fleece throw and lit maple-leaf garland from this 23-item list. As an Amazon Associate I earn from qualifying purchases.`
- Alt text: `Dried fall bouquet in a ribbed amber vase on a round wood tray, with an orange gauze runner, rust raised-fleece throw and lit maple-leaf garland.`

## Christmas aesthetic route map

The six aesthetic routes use destination-specific images. The Shopify and Amazon versions are intentionally different because they show different products.

| Aesthetic | Shopify route | Amazon route | Current status under 12-product standard |
|---|---|---|---|
| White & Gold | [Landing page](https://shopbambana.com/pages/white-gold-christmas) with `white-gold-shopify.png` | [Tracked Idea List](https://www.amazon.com/shop/bana006/list/OGM5N4NOG6ZG?tag=holiday_white-20) with `white-gold-amazon.png` | Green. Both destinations expose 12 distinct product links. |
| Boho | [Landing page](https://shopbambana.com/pages/boho-christmas) with `boho-shopify.png` | [Tracked Idea List](https://www.amazon.com/shop/bana006/list/1Q35MQSJVMZVP?tag=holiday_boho-20) with `boho-amazon.png` | Green. Both destinations expose 12 distinct product links. |
| Maximalist | [Landing page](https://shopbambana.com/pages/maximalist-christmas) with `maximalist-shopify.png` | [Tracked Idea List](https://www.amazon.com/shop/bana006/list/32W5G3N61TF5T?tag=holiday_max-20) with `maximalist-amazon.png` | Green. Both destinations expose 12 distinct product links. |

Do not retain metadata that says `8 picks`. Do not regenerate the six aesthetic images only because destination counts increase, provided the featured products remain in each assortment. Never imply that every destination product is pictured.

## Public Shopify destination verification

| Destination | Products at latest verified snapshot | Verification |
|---|---:|---|
| [Seasonal & Holiday Decor](https://shopbambana.com/collections/seasonal-holiday-decor) | 15 | Passes the 12-product standard. HTTP 200; all 15 had an available variant. Fresh desktop and 430 x 932 checks passed. Title clears the header, CTA reaches the grid, no horizontal overflow, and a representative product reached an enabled Add to cart control. No cart mutation. |
| [Holiday Gifts for Comfort and Home](https://shopbambana.com/pages/holiday-gifts-for-comfort-and-home) | 12 | Published with four themed groups of three. All 12 product links were unique and every product had an available variant. |
| [White & Gold Christmas](https://shopbambana.com/pages/white-gold-christmas) | 12 | Published with 12 distinct products. All product links were unique and every product had an available variant. |
| [Boho Christmas](https://shopbambana.com/pages/boho-christmas) | 12 | Published with 12 distinct products. All product links were unique and every product had an available variant. |
| [Maximalist Christmas](https://shopbambana.com/pages/maximalist-christmas) | 12 | Published with 12 distinct products. All product links were unique and every product had an available variant. |

Fresh public QA used 1440 x 1000 desktop and 430 x 932 mobile viewports. On every page the heading began below the header, horizontal overflow was zero, and all 12 cards remained present and unique. The new owner standard requires at least 12 distinct, relevant, currently buyable products per promoted Bambana landing assortment and Amazon Idea List. Variant padding and unrelated filler are not acceptable.

Future Make creative should use the proven dynamic scene workflow rather than cloning these bounded static audit masters. Generate varied settings and compositions from three to five recognizable products selected from the verified destination pool, while preserving the source product shape, material and color. Suggested rotations: White & Gold entry console, mantel, dining sideboard and guest bedroom; Boho reading corner, dining nook, natural mantel and gift-wrapping lounge; Maximalist dining table, statement entry, wreath-led mantel and festive bar; Holiday Gifts bedroom, bedside wind-down, spa bathroom and reading corner. A static Pinterest example proves routing and copy only, not the product fidelity of future generated scenes.

## Repair asset provenance

Built-in image generation was used in reference-image editing mode. Final local paths:

- `deliverables/make-seasonal-repairs-2026-09-09/shopify-white-gold-overlay.png`
- `deliverables/make-seasonal-repairs-2026-09-09/amazon-holiday-a-overlay.png`
- `deliverables/make-seasonal-repairs-2026-09-09/amazon-holiday-b-no-overlay.png`
- `deliverables/make-seasonal-repairs-2026-09-09/amazon-fall-exact-products.png`
- Reused verified source: `deliverables/christmas-aesthetics-2026-09-09/white-gold-shopify.png`

Prompt set summary:

- Shopify overlay edit: preserve the exact White & Gold product scene and add only the approved cream serif `SHOP THE LOOK` and `White & gold Christmas decor` overlay on a translucent forest-green lower-left panel.
- Amazon holiday master and overlay: compose only the supplied exact preserved-rose heart box, six amber candle jars and two crystal bears, then add the approved `FOR HER & HIM` and `18 thoughtful holiday gifts` overlay to treatment A.
- Amazon Fall: compose only the supplied dried bouquet, amber vase, round wood tray, orange gauze runner, rust raised-fleece throw and lit maple-leaf garland; remove candles, place settings, pumpkins, Christmas trees and other unsupported merchandise.

All new assets are 1024 x 1536. Their public Shopify CDN versions were fetched without authentication and their decoded RGB pixels matched the local files.

## Limits

- Product availability and prices are time-sensitive.
- These are verified live Bambana Shopify catalog items, but this audit did not independently prove that every item is supplied through Shopify Collective. Do not call every item Collective in owner-facing copy.
- No ad budget, recurring schedule, cart or checkout state was changed during this audit.
- The four Shopify landing pages and three aesthetic Amazon lists now meet the 12-product standard with fresh public proof. Newsletter owns the single consolidated owner email.
