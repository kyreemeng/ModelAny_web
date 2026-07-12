# Overview: ModelAny Landing Page

## What was built

A complete, production-ready landing page for the **ModelAny** Chrome extension, located at `/Users/kyree/Desktop/code/ModelAny_web/`.

## Key decisions

1. **Zero dependencies**: Pure HTML/CSS/JS — no frameworks, no build step, instant load.
2. **Real product data**: All content based on actual README.md, models.ts, manifest.json, and PRIVACY.md from the ModelAny extension. No fabricated features, user counts, or store links.
3. **Model icons**: All 8 model icons are official assets from the extension repo: ChatGPT and Gemini use the original SVGs; DeepSeek, Kimi, GLM, and Wenxin use the original ICO files; Qwen and Doubao use the original PNG files. `object-fit: contain` preserves each icon's native aspect ratio.
4. **GitHub Stars**: Client-side fetch from `https://api.github.com/repos/kyreemeng/ModelAny`. Shows loading spinner, then real star count. Falls back to "Star on GitHub" on any error — no fake numbers.
5. **Interactive hero**: A simulated Prompt Launcher where clicking "Send to N models" animates dashed lines flowing from the center input to 8 orbiting model nodes, with sequential pulse effects. Fully respects `prefers-reduced-motion`.
6. **SEO**: Single H1, semantic HTML5, Open Graph + Twitter Card, JSON-LD SoftwareApplication schema, canonical URL (with TODO for final domain), descriptive alt text on all content images.

## Files delivered

| File | Purpose |
|------|---------|
| `index.html` | Main page — 10 sections, full SEO metadata, JSON-LD |
| `styles.css` | All styles — purple/blue gradient theme, responsive 375/768/1440px |
| `script.js` | GitHub API, interactive hero, mobile menu, scroll reveal |
| `assets/` | Model icons (official SVG/ICO/PNG) + brand logo + favicon |
| `README.md` | Run instructions and structure documentation |

## How to run

```bash
cd /Users/kyree/Desktop/code/ModelAny_web
python3 -m http.server 8765
# Open http://localhost:8765
```

## Follow-up items

- [ ] Confirm canonical domain and update `href` in `<link rel="canonical">`
- [ ] Create 1200x630 OG image and update `og:image` / `twitter:image` URLs
- [ ] Add `sitemap.xml` and `robots.txt` once deployed
- [ ] Consider adding a Chrome Web Store link once the extension is published
