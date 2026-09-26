# ModelAny SEO — GSC-driven optimization record

**Date:** 2026-09-26  
**Property:** modelany.app (Web, last 3 months)  
**Work mode:** implementation  
**Evidence modes:** GSC exports (Coverage + Performance), code inventory, live header probes

---

## 1. Executive summary — top 3 priorities

1. **Stop geo-IP hard redirect on `/`** — CN/HK/TW/MO visitors with English browsers were 307’d to `/zh/`, hurting English SERP CTR and user signals. Fixed: language preference only (Accept-Language `zh*`), bots still exempt.
2. **CTR rewrite on near-page-1 URLs** — Especially homepage (`ask any model` @ pos ~4.7, 0 CTR) and `best-for/hr` (@ pos ~1.9, 0 CTR). Titles/descriptions rewritten for click intent.
3. **Stop irrelevant benchmarks on task guides** — HR/writing pages were showing SWE-bench / coding Arena tables. Focus filtering now keeps scene-relevant evidence only.

---

## 2. Outcome / scope

| Field | Value |
|---|---|
| Outcome | Higher qualified Google Web clicks via indexing hygiene, CTR, and content relevance |
| Conversion | Extension install (Chrome / Edge) |
| Market / language | EN primary + zh-CN compare cluster |
| Surface / engine | Google Web Search |
| Authorized action | Code/content in this repo (no GSC submits / IndexNow without further approval) |

---

## 3. Coverage ledger (GSC 2026-09-26)

| Bucket | Count / note | Evidence |
|---|---|---|
| Indexed | ~83 | Coverage Chart latest |
| Not indexed | ~31 | Coverage Chart |
| Excluded by noindex | 17 (Validation Failed) | Critical issues sheet — exact URLs **not in export**; need Coverage drilldown |
| Page with redirect | 5 | Expected for removed compare URLs |
| Discovered - not indexed | 8 | Quality/crawl-budget hypothesis |
| Crawled - not indexed | 1 | Quality hypothesis |
| Performance window | 2026-07-11 → 2026-09-24 | ~41 clicks / ~1,115 impressions / ~3.7% CTR |

Source freshness: GSC export dated **2026-09-26**. Platform rules treated as observed site state + durable crawl→index principles.

---

## 4. Findings → actions

| # | Category | Issue | Status | Evidence | Impact | Confidence | Fix | Effort |
|---|---|---|---|---|---|---|---|---|
| F1 | Access / i18n | Geo-IP 307 `/` → `/zh/` for CN region even with `en` Accept-Language | **implemented** | Live curl from CN edge; `middleware.js` | High (EN CTR + bounce) | High | Language-only soft preference; bots exempt | S |
| F2 | Snippet CTR | Homepage misses query phrasing `ask any model` | **implemented** | Queries sheet: 23 imps, pos 4.74, 0 clicks | High | Med-High | Title/desc/FAQ/schema updated | S |
| F3 | Snippet CTR | `best-for/*` meta robotic (“task-specific selection criteria…”) | **implemented** | Pages: hr 23 imps pos 1.9 CTR 0; java 123 imps CTR 1.6% | High | High | CTR copy + titles via generator | S |
| F4 | Usefulness | Non-coding guides showed coding/SWE-bench tables | **implemented** | Live HR page before change | High | High | Focus allowlist in `sharedBenchmarkGroups` | M |
| F5 | Index hygiene | Internal `*.md` audit files publicly 200 | **implemented** | Live `/overview.md` etc. | Med | High | robots.txt Disallow + `X-Robots-Tag` | S |
| F6 | Internal links | Homepage popular grid under-linked GSC winners | **implemented** | Pages sheet vs homepage links | Med | Med | Linked java / academic-writing / code-review / hr | S |
| F7 | Coverage | 17 noindex exclusions still “Failed” | **missing evidence** | Aggregate only | Unknown | Low | Export Coverage drilldown URLs next | — |

---

## 5. Action buckets

### Quick wins (shipped in code)
- Middleware geo-redirect removal
- Homepage + high-opportunity meta CTR
- Focus-filtered benchmarks
- Block markdown from indexing
- Homepage internal links to GSC opportunity pages
- Regenerated 103 SEO pages + sitemap `lastmod` 2026-09-26

### Strategic (next)
- Deepen top 10 GSC pages with original task examples (HR JD sample, Java ticket sample) — still thin vs competitors
- Double down on zh compare cluster (already converting: glm/kimi/qwen vs chatgpt)
- Build EN pages for Chinese-model interest where demand exists
- Acquire non-brand backlinks / listings (Chrome Web Store, GitHub, AI directories) — off-site

### Experiments (optional)
- A/B homepage title variants for `ask any model` vs `ask multiple AI` (observe 28 days)
- Soft language banner instead of any Accept-Language redirect

### Destructive — do not do without drilldown
- Bulk noindex/prune of best-for pages
- Mass redirect of indexed URLs

---

## 6. Implementation record

| Stage | Status |
|---|---|
| Implemented | Yes (local repo) |
| Deployed and observable | **Pending deploy** |
| Processed by Google | Not yet |
| Outcome observed | Not yet |

**Rollback:** revert `middleware.js`, `robots.txt`, `vercel.json` header block, `seo/generate.mjs` + `seo/data/*`, regenerate, redeploy homepage.

**Tests:** `node --test tests/*.test.mjs` — pass after regenerate.

---

## 7. Monitoring plan

| Window | Check | Decision rule |
|---|---|---|
| Day 0–3 after deploy | URL Inspection on `/`, `/best-for/hr/`, `/best-for/java/`, `/compare-ai-models/` | Confirm rendered title/robots; request indexing if needed |
| Day 7–14 | GSC Performance: homepage + hr + java CTR; Countries CN vs US | If CN EN CTR up and US impressions stable → keep middleware |
| Day 28 | Coverage: noindex count; Discovered-not-indexed | If noindex still 17 → export drilldown and fix URL-level issues |
| Day 28–56 | Clicks / impressions vs prior 28d (same search type) | Attribute only with segmented page/query evidence |

**Rerun inputs:** re-export Coverage + Performance on 2026-10-24; compare to this file.

---

## 8. Limitations

- No Search Console API live access; anonymized queries omitted from export.
- No guaranteed ranking/traffic lift.
- Coverage “17 noindex” URL list unknown without drilldown export.
- Apex `modelany.app` vs `www` both appear in Pages — confirm apex→www 301 at DNS/Vercel (Googlebot probe needed post-deploy from non-CN edge).
