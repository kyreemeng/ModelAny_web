# ModelAny Landing Page

Official landing page for the **ModelAny** Chrome extension — a tool that sends one prompt to multiple AI models at once.

## Quick Start

```bash
# From the project directory
python3 -m http.server 8765

# Then open in browser
# http://localhost:8765
```

Or use any static file server:

```bash
npx serve .
```

## Project Structure

```
ModelAny_web/
├── index.html          # Main page with all 10 sections + full SEO metadata
├── styles.css          # All styles, responsive (375px / 768px / 1440px)
├── script.js           # Interactive hero, GitHub API, scroll reveal
├── assets/
│   ├── favicon.png
│   ├── modelany-icon-master.png
│   └── models/
│       ├── chatgpt.svg     # Real SVG icon from extension repo
│       ├── gemini.svg      # Real SVG icon from extension repo
│       ├── deepseek.ico    # Official icon from extension repo
│       ├── kimi.ico        # Official icon from extension repo
│       ├── glm.ico         # Official icon from extension repo
│       ├── qwen.png        # Official icon from extension repo
│       ├── doubao.png      # Official icon from extension repo
│       └── wenxin.ico      # Official icon from extension repo
└── README.md
```

## Page Sections

1. **Top Navigation** — glassmorphism nav with mobile menu
2. **Hero** — interactive Prompt Launcher with orbiting model nodes
3. **Trust Bar** — GitHub Stars (live API), open source badges
4. **Features** — 6 feature cards (English + Chinese)
5. **How It Works** — 3-step flow + popup UI mockup
6. **Supported Models** — 8 model cards with real icons
7. **Use Cases** — Research, Writing, Coding, Learning, Brainstorming
8. **Privacy** — Local-first privacy commitment
9. **Final CTA** — Gradient call-to-action
10. **Footer** — Brand, links, contact

## Key Features

- **GitHub Stars API**: Fetches real star count from `https://api.github.com/repos/kyreemeng/ModelAny` with loading state and graceful fallback to "Star on GitHub" on failure.
- **Interactive Hero**: Click "Send to N models" to animate prompt flowing to orbiting model nodes. Respects `prefers-reduced-motion`.
- **SEO Complete**: Semantic HTML, single H1, Open Graph, Twitter Card, JSON-LD SoftwareApplication schema, canonical URL.
- **Accessible**: Skip link, focus states, ARIA labels, keyboard navigation, reduced-motion support.
- **Responsive**: Mobile-first design tested at 375px, 768px, 1440px breakpoints.
- **Zero Dependencies**: Pure HTML/CSS/JS — no frameworks, no build step.

## Model Data Structure

The model list is defined in `script.js` and mirrored in `index.html`:

```javascript
const MODELS = [
  { id: 'chatgpt',  name: 'ChatGPT',  color: '#10A37F', url: 'https://chatgpt.com/' },
  { id: 'gemini',   name: 'Gemini',   color: '#4285F4', url: 'https://gemini.google.com/' },
  { id: 'deepseek', name: 'DeepSeek', color: '#4D6BFE', url: 'https://chat.deepseek.com/' },
  { id: 'kimi',     name: 'Kimi',     color: '#111827', url: 'https://www.kimi.com/' },
  { id: 'glm',      name: 'GLM',      color: '#159C8C', url: 'https://chatglm.cn/' },
  { id: 'qwen',     name: 'Qwen',     color: '#6954E8', url: 'https://www.qianwen.com/' },
  { id: 'doubao',   name: 'Doubao',   color: '#3B82F6', url: 'https://www.doubao.com/chat/' },
  { id: 'wenxin',   name: 'Wenxin',   color: '#2F6BFF', url: 'https://wenxin.baidu.com/' }
];
```

This matches `src/shared/models.ts` in the ModelAny extension source.

## SEO TODO

Before deploying to production:

1. **Canonical URL**: Update `<link rel="canonical">` to the final domain.
2. **OG Image**: Create a 1200x630 PNG for social sharing and update `og:image` / `twitter:image` URLs.
3. **Sitemap**: Add `sitemap.xml` once the domain is live.
4. **robots.txt**: Add a `robots.txt` allowing crawling.

## Contact

- GitHub: https://github.com/kyreemeng/ModelAny
- Email: kyreemeng@gmail.com
