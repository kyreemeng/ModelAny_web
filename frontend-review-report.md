# ModelAny Web 前端审查报告

> 审查范围：`index.html`（EN）、`zh/index.html`（ZH）、`script.js`、`styles.css`、`locale.js`、SEO 子页面（`compare/`、`best-for/` 等）
> 审查维度：用户体验 / 用户交互 / UI 美化
> 优先级约定：**P0** 阻断体验或功能缺陷 · **P1** 明显影响体验 · **P2** 打磨级优化

---

## 一、用户体验

### 1.1 页面加载性能

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UX-01 | `gtag.js` 在 `<head>` 中虽 `async`，但紧随其后有一段同步内联脚本（`window.dataLayer` 初始化），仍会进入主线程早期解析阶段 | P1 | 将内联 gtag 初始化脚本移至 `</body>` 前，或包裹在 `requestIdleCallback` 中；保留外部 `async` 脚本在 head |
| UX-02 | `index.html` 首屏渲染前需要下载并解析完整的 `styles.css`（约 1900 行）+ `seo-pages.css`，无 critical CSS 内联 | P1 | 抽取首屏（hero + nav + trust bar）所需的最小 CSS 内联到 `<head>`，其余 `preload` + 异步加载；可减少 LCP 200–400ms |
| UX-03 | 三个 `hero-blob` 使用 `filter: blur(80px)` + 大尺寸径向渐变（500×500 / 400×400 / 300×300），在低端 GPU/集成显卡上会触发重绘卡顿，且不可见区也在渲染 | P1 | 改用预生成的 SVG/WEBP 渐变背景图，或 `will-change: transform` + `contain: paint`；移动端（`max-width:768px`）直接禁用 blob 或降为 1 个 |
| UX-04 | `backdrop-filter: blur(20px)` 在 `site-header`、`launcher-card`、`feature-card`、`nav-menu.open` 多处使用，Safari 旧版本与低端 Android 上帧率骤降 | P1 | 对 `feature-card` 这类非关键卡片移除 `backdrop-filter`，改用纯色 `rgba(255,255,255,0.92)`；仅在 `site-header` 和 `launcher-card` 保留 |
| UX-05 | 模型图标用 `.ico`（deepseek/kimi/glm/wenxin）和 `.png`（qwen/doubao），`.ico` 体积大且非矢量，Retina 屏发虚 | P1 | 统一转换为 SVG（首选）或 WebP；`.ico` 在现代浏览器中已无必要 |
| UX-06 | `index.html` 中 8 个模型图标在 hero 区全部立即加载（无 `loading="lazy"`），但实际首屏可见的只有 orbit 区的 8 个 36×36 缩略图 | P2 | orbit 节点图标保留首屏加载；下方 `models-grid` 的 64×64 图标已加 `loading="lazy"`（正确），保持现状 |
| UX-07 | GitHub Stars API 在 `requestIdleCallback` 中调用（合理），但失败时静默回退到 "Star on GitHub"，无任何视觉反馈 | P2 | 可接受，但建议加载中 → 成功/失败有 200ms 的淡入过渡，避免文字突变 |
| UX-08 | `<html>` 没有显式 `lang` 切换前的 SSR 占位，JS 执行前闪现英文内容（中英文切换时 FOUC） | P1 | 见 §1.3 |

### 1.2 导航结构

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UX-09 | **桌面端 `nav-menu` 项目过多**：Features / How it works / Models / Use cases / Compare / Privacy / FAQ / 中文 / Download（文本）/ Download v1.0.1（CTA）= 10 项，在 1024–1200px 之间会挤压甚至换行 | P0 | 将次要项（Privacy / FAQ / Use cases）收进 "More" 下拉；保留核心 5 项 + 语言切换 + CTA |
| UX-10 | **`nav-menu` 中有两个 Download 链接**（`index.html:290` 普通文本 "Download" + `index.html:291` 按钮 "Download v1.0.1"），文本相同易混淆且冗余 | P0 | 删除 `index.html:290` 的纯文本 "Download" 链接，仅保留 CTA 按钮 |
| UX-11 | **SEO 子页面（`compare/`、`best-for/` 等）header 缺少 `menu-toggle`**，移动端汉堡菜单无法展开，用户在子页面无法导航到其他区块 | P0 | 子页面 header 复用首页 `nav-actions` 结构（含 `menu-toggle` + `nav-cta`），或抽成共享组件片段 |
| UX-12 | 首页 `nav-menu` 移动端展开后，链接点击直接关闭菜单但**无焦点陷阱（focus trap）**，Tab 键会跳到背景内容 | P1 | 在 `closeMobileMenu` 之外增加 focus trap：菜单打开时拦截 Tab 在首尾元素间循环；可用 `document.activeElement` 监听 |
| UX-13 | 子页面 `nav-menu` 只有 Compare / 中文 / Download 三项，与首页 10 项差异巨大，用户跨页面会迷失 | P1 | 子页面保留与首页一致的主导航（至少 Features / How it works / Models / FAQ），当前区块高亮即可 |
| UX-14 | `scroll-padding-top: 72px`，但 `site-header` 高度 64px + 边框，锚点跳转后内容可能贴顶 | P2 | 调整为 `scroll-padding-top: 80px`，留出呼吸空间 |
| UX-15 | 移动端菜单展开时 `body.menu-open { overflow: hidden }`，但菜单本身高度可能超过视口，长菜单无法滚动 | P2 | `.nav-menu.open { max-height: calc(100vh - 64px); overflow-y: auto }` |

### 1.3 中英文切换流畅度

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UX-16 | **切换机制是整页跳转**（`/` ↔ `/zh/`），无任何过渡动画，体验割裂；`locale.js` 仅写 cookie，无转场 | P1 | 方案 A（轻量）：跳转前 `document.body.classList.add('locale-transitioning')`，CSS 加 200ms 淡出；方案 B（重）：用 `fetch` + `morphdom` 做局部替换，保持滚动位置 |
| UX-17 | **`zh/index.html` 的 JSON-LD 结构化数据未完全本地化**：`WebPage.name` / `HowTo.name` / `FAQPage` 的 `Question.name` 仍是英文，但 `acceptedAnswer.text` 是中文 — Google 抓取时中英混杂，影响中文 SEO | P0 | 将 `zh/index.html` 的 JSON-LD 中所有 `name` 字段本地化为中文（如 "什么是 ModelAny？" / "如何使用 ModelAny"） |
| UX-18 | `zh/index.html` 的 `WebPage.@id` 仍指向 `https://www.modelany.app/#webpage`（与英文版冲突），且 `url` 仍指向 `/` 而非 `/zh/` | P0 | `@id` 改为 `https://www.modelany.app/zh/#webpage`，`url` 改为 `https://www.modelany.app/zh/` |
| UX-19 | `script.js:111` 通过 `document.documentElement.lang === 'zh-CN'` 判断语言，但 `index.html` 的 `<html lang="en">` 与 `zh/index.html` 的 `<html lang="zh-CN">` 已正确设置 — 逻辑可行，但冗余判断 `body.classList.contains('locale-zh')` 可移除 | P2 | 保留 `lang` 判断，删除 `classList` 冗余检查 |
| UX-20 | 语言切换为 `<a>` 链接，键盘可达，但**没有 `aria-current` 标识当前语言**，辅助技术无法感知"当前在英文站" | P2 | 当前语言的链接加 `aria-current="true"` 并用样式区分 |

### 1.4 响应式适配

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UX-21 | **断点非标准**：使用 `968px` 和 `768px` 和 `480px`，未对齐常见设备（768/1024/1280）。968px 落在 iPad 横屏（1024）和竖屏（768）之间，易出现"既不是桌面也不是移动"的中间态 | P1 | 统一为 `1024px`（桌面→平板）和 `768px`（平板→手机）和 `480px`（小手机） |
| UX-22 | `orbit-node-1` 到 `orbit-node-8` 用百分比定位 + `transform: translate(-50%, ...)`，移动端 `hero-visual` 缩到 420px 时节点会与 `launcher-card` 重叠遮挡 | P1 | 移动端（`max-width:768px`）将 `orbit-container` 设为 `opacity: 0.3` 并 `pointer-events: none`（已部分做了，但 480px 才生效，768px 时仍重叠）；或重新设计移动端 hero 布局，orbit 改为水平滚动条 |
| UX-23 | `hero-visual { min-height: 560px }` 在 375px 小屏仍保留 420px（480px 断点），占用过多垂直空间，首屏只见 launcher | P2 | 480px 以下 `min-height: 360px`，并隐藏 orbit |
| UX-24 | `nav-menu` 在 768px 以下变成固定抽屉，但 `transform: translateY(-120%)` 从顶部滑入，与 `top: 64px` 起点重叠，动画初期会看到菜单从 header 后面"挤"出来 | P2 | 改为 `transform: translateY(-100%)` 配合 `top: 64px`，或用 `clip-path` 动画 |
| UX-25 | 没有处理超小屏（<375px，如 iPhone SE 1 代），`hero-content h1` 在 32px 仍可能溢出 | P2 | 增加 `@media (max-width: 360px)` 断点，`h1` 降至 28px |

---

## 二、用户交互

### 2.1 表单反馈

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| IX-01 | **`launcher-input` 是 `contenteditable` div**，placeholder 用 `data-placeholder` + CSS `:empty::before` 实现，但 `script.js:150` 中 `Array.from(launcherInput.textContent).slice(0, 5000)` 截断后重写 `textContent`，会导致光标跳到开头，输入体验断裂 | P0 | 改用 `<textarea>` + 真实 `placeholder` 属性；或截断时保存/恢复 `selectionStart`；或仅在 blur 时截断 |
| IX-02 | `launcher-counter` 定位在输入框内部右下角（`bottom: 8px; right: 12px`），长文本时会**遮挡用户输入的内容** | P1 | 计数器移到输入框下方（`position: static; text-align: right`），与 `.launcher-status` 同行或独立一行 |
| IX-03 | `launcher-status` 用 `color: var(--ink-muted)`，错误提示（"请先输入提示词"）与正常状态颜色相同，**用户无法区分错误与提示** | P1 | 增加 `aria-live="assertive"` 用于错误；错误态加 `.is-error` 类，颜色用 `#E5484D`（红色系）；成功态用绿色 |
| IX-04 | 字符接近 5000 上限时**无渐进式视觉警告**（如 4500+ 变橙、4900+ 变红） | P2 | `updateLauncherCounter` 中根据 `length/5000` 比例切换 counter 颜色 |
| IX-05 | `launcher-auto-submit` checkbox 是原生样式，与整体圆角紫调设计不协调 | P2 | 自定义 switch 样式（参考 `.mockup-switch`），与 popup mockup 风格统一 |
| IX-06 | `launcher-input` 缺少 `aria-describedby` 关联 `launcher-counter`，辅助技术无法感知字符限制 | P1 | 加 `aria-describedby="launcher-counter"` 并给 counter 加 `id` |

### 2.2 按钮交互状态

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| IX-07 | **`launcher-send` 的加载态样式已写好**（`.launcher-send.sending`），但 `script.js` 中从未添加 `.sending` 类，用户点击后只见按钮变灰，无"正在处理"反馈 | P0 | 在 `launcherSend.addEventListener('click')` 中：点击立即 `launcherSend.classList.add('sending')`，`finally` 中 `classList.remove('sending')` |
| IX-08 | `.chip` 按钮无 `:active` 状态，点击反馈弱，触屏设备几乎无按下感 | P1 | `.chip:active { transform: scale(0.96) }` |
| IX-09 | `.btn-primary:disabled` / `.launcher-send:disabled` 状态缺少 `:focus-visible` 处理，键盘 Tab 到禁用按钮仍显示焦点环，但禁用按钮不应获焦 | P2 | 给禁用按钮加 `disabled` 属性（原生不获焦），CSS 中 `:disabled { pointer-events: none }` |
| IX-10 | "Copy prompt" 按钮点击成功后仅文字提示"已复制"，**无视觉确认**（如按钮短暂变绿或显示 ✓） | P1 | 复制成功后 2 秒内按钮文字变为 "✓ Copied" 并加 `.is-success` 类（绿色边框），2 秒后恢复 |
| IX-11 | `model-card` 是 `<a>` 链接，但 hover 仅 `translateY(-6px)`，键盘 `:focus-visible` 时无对应视觉反馈（CSS 只写了 `:hover`） | P1 | `.model-card:focus-visible { transform: translateY(-6px); box-shadow: var(--shadow-lg) }` 与 hover 一致 |
| IX-12 | `menu-toggle` 的汉堡→关闭动画依赖 `aria-expanded` 属性选择器，但属性更新与 CSS 动画不同步（JS 先 toggle class 再 setAttribute），可能闪烁 | P2 | 统一用 `aria-expanded` 驱动，移除 `classList.toggle('open')` 依赖 |

### 2.3 加载/过渡动效

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| IX-13 | **整页语言切换无任何过渡**，用户点击"中文"后白屏 → 直接跳到中文页，体验割裂 | P1 | 见 UX-16 |
| IX-14 | `scroll reveal` 用 `IntersectionObserver` + `unobserve`，**只在首次进入视口时触发一次**，滚回上方再下滚不会再次动画（可接受），但若元素初始在视口内（如首屏下方第一个 section）会立即触发，无 stagger 效果 | P2 | 首屏内的 reveal 元素加 `transition-delay` 或在 `DOMContentLoaded` 后延迟 100ms 再 observe |
| IX-15 | **Hero 区无进场动画**，首屏所有元素同时出现，缺少层次感 | P1 | 给 `eyebrow` / `h1` / `description` / `cta` / `hero-visual` 加 `animation: fade-up 0.6s var(--ease-out) both`，配 `animation-delay: 0ms / 80ms / 160ms / 240ms / 320ms` |
| IX-16 | **FAQ `details/summary` 展开/收起无动画**，浏览器默认瞬间展开，体验生硬 | P1 | 用 JS 控制 `max-height` 过渡，或用 `details` + `::details-content`（实验性）+ `interpolate-size: allow-keywords`（Chrome 129+） |
| IX-17 | `highlightStep` 仅监听 `mouseenter` / `focus`，**触摸设备无 hover，步骤联动 mockup 高亮完全失效** | P1 | 增加 `click` / `touchstart` 监听，触摸时切换 active 步骤；或改为 `IntersectionObserver` 滚动到对应步骤时自动高亮 |
| IX-18 | `orbit-lines` 的 `dash-flow` 动画在 `prefers-reduced-motion` 下已禁用（正确），但 `orbit-node.pulse` 动画未在 reduced motion 下禁用 | P2 | `@media (prefers-reduced-motion: reduce) { .orbit-node.pulse { animation: none } }` |
| IX-19 | `header` 滚动时 `box-shadow` + `background` 变化用 `transition: all var(--dur)`，但 `all` 会触发非必要属性过渡（如 `backdrop-filter`），可能卡顿 | P2 | 改为 `transition: box-shadow var(--dur) var(--ease), background var(--dur) var(--ease)` |

### 2.4 错误提示处理

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| IX-20 | GitHub API 失败时**完全静默**，`showFallback()` 直接显示 "Star on GitHub"，用户无法区分"加载中"和"加载失败" | P2 | 失败时显示 "Star on GitHub" 但加 `title="Star count unavailable"` 提示 |
| IX-21 | 剪贴板 API 失败仅显示文字"复制失败。请手动选中提示词后复制"，**无重试按钮**，用户需手动操作 | P1 | 错误提示中嵌入"重试"按钮，点击重新调用 `navigator.clipboard.writeText` |
| IX-22 | 扩展未检测到时 `launcher-fallback` 区显示两个按钮（Copy / Open sites），但**样式与正常状态区分度低**，用户可能忽略这是降级方案 | P1 | fallback 区加浅色警告背景 `background: rgba(229,72,77,0.06)` + 左侧 3px 红色边框，明确标识"扩展未检测到" |
| IX-23 | `launcher-status` 有 `aria-live="polite"` 但无 `role="status"`，部分屏幕阅读器不识别为状态更新区 | P2 | 加 `role="status"` |
| IX-24 | `requestExtensionLaunch` 的 1500ms 超时后直接 reject，用户等待期间无任何进度提示（只有"正在检测…"静态文字） | P2 | 超时前 800ms 显示"仍在等待扩展响应…"，超时后再显示完整 fallback |

---

## 三、UI 美化

### 3.1 视觉层次

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UI-01 | **section 背景交替节奏混乱**：hero(渐变) → trust(白) → features(渐变软) → how-it-works(白) → models(渐变软) → use-cases(白) → popular-compare(无显式背景，继承 body 白) → privacy(渐变软) → faq(无显式) → final-cta(渐变 CTA)。`popular-compare` 和 `faq` 缺少显式背景，与相邻 section 视觉粘连 | P1 | `popular-compare` 设为 `background: var(--surface-soft)`；`faq` 设为 `background: var(--surface)`，与 privacy（渐变软）形成明确交替 |
| UI-02 | `section { padding: 96px 0 }` 全局统一，但 `final-cta` 也是 96px，与上文 `faq` 之间无差异化呼吸，CTA 区缺少"终章"感 | P2 | `final-cta` 增加上方 `margin-top: 48px` 或加大 padding 到 `120px 0`，强化收尾感 |
| UI-03 | `section-header` `max-width: 680px` + `margin-bottom: 64px`，但 `popular-compare` 的 `section-description` 用了内联 `style="max-width:40rem"`（640px），与全局 680px 不一致 | P2 | 移除内联样式，统一用 `section-header` 结构 |
| UI-04 | **`section-header h2` 与 `section-subtitle` 间距**：`h2 { margin-bottom: 12px }` + `subtitle { margin-bottom: 4px }`，但 `section-header { margin-bottom: 64px }`，标题区到内容的间距是副标题的 16 倍，比例失衡 | P2 | `section-header { margin-bottom: 48px }`，缩小到内容区的过渡 |

### 3.2 配色一致性

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UI-05 | **`.chip` active/inactive 对比度低**：active = `brand-lavender(#EDE9FE)` + `brand-primary-dark` 文字；inactive = `surface-soft(#F5F4FF)` + `ink-muted`。两个背景色几乎相同（都是极浅紫），用户难以一眼区分选中态 | P1 | active 改为 `background: var(--brand-primary); color: white`（强对比），或 active 加 `box-shadow: 0 0 0 2px var(--brand-accent)` 强化边界 |
| UI-06 | `.mockup-model-chip.selected` 与 `.chip.active` 样式几乎相同但定义重复，未抽公共类 | P2 | 抽 `.chip-like` 公共类，`.chip` / `.mockup-model-chip` 复用 |
| UI-07 | `tab-color` 中 Kimi 用 `#111827`（接近 `--ink` #1A1A2E），在白底 tab-chip 上不够醒目，与其他品牌色对比失衡 | P2 | Kimi 改用其官方蓝 `#3B5BFF` 或保留黑色但加粗 |
| UI-08 | **错误/成功状态色未纳入 design token**：建议错误用红色、成功用绿色，但当前 `:root` 中无 `--color-error` / `--color-success` | P1 | 在 `:root` 中增加 `--color-error: #E5484D; --color-success: #30A46C; --color-warning: #F5A623`，统一全局使用 |
| UI-09 | `launcher-send.sending` 的 `::after` 内容硬编码英文 "Launching…"，**中文页面会显示英文加载文字** | P1 | 用 `data-loading-zh` / `data-loading-en` 属性 + `[lang]` 选择器；或 JS 中动态设置 `launcher-send-label` 文本 |

### 3.3 字体排版

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UI-10 | **`font-family: 'Inter'` 声明但未 `@import` 或 `<link>` 加载**，实际依赖系统字体回退（`-apple-system, BlinkMacSystemFont, Segoe UI`），macOS 显示 SF、Windows 显示 Segoe，跨平台视觉不一致 | P1 | 方案 A：用 `<link rel="preconnect" href="https://fonts.googleapis.com">` + 加载 Inter；方案 B：移除 'Inter' 声明，明确用系统字体栈 `'system-ui, -apple-system, sans-serif'` |
| UI-11 | **中英文混排 line-height 未分别处理**：`body { line-height: 1.6 }` 对英文足够，但中文需要 1.7–1.8 才不拥挤；`hero-content h1 { line-height: 1.1 }` 对中文标题过紧 | P1 | `:lang(zh) { line-height: 1.75 }`；`:lang(zh) .hero-content h1 { line-height: 1.25 }` |
| UI-12 | `letter-spacing: -0.03em` / `-0.02em` 在英文字符上美观，但**中文字符本身无字距调整需求，负 letter-spacing 会让中文字符挤压** | P1 | `:lang(zh) h1, :lang(zh) h2 { letter-spacing: 0 }` 或 `letter-spacing: -0.01em`（轻微） |
| UI-13 | `--brand-lavender` 用于 active chip 背景，与 `--surface-soft`（inactive）色差仅 `#EDE9FE` vs `#F5F4FF`，肉眼几乎无差 | P2 | 见 UI-05 |
| UI-14 | `.section-subtitle` 18px + `.section-subtitle-zh` 15px，但 HTML 中 subtitle 类未与 zh 类配合使用，CSS 中定义的 `*-zh` 类大量未使用（`eyebrow-zh` / `hero-subtitle-zh` / `hero-description-zh` / `step-zh` / `feature-zh` / `usecase-zh` / `privacy-zh` / `privacy-subtitle-zh` / `cta-subtitle-zh` / `legal-zh`） | P1 | **删除 CSS 中所有未使用的 `*-zh` 类**（约 200 行死代码），或重新设计中英双语并排显示方案 |

### 3.4 间距规范

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UI-15 | **radius 使用不统一**：`feature-card` xl(28px)、`model-card` xl、`usecase-card` xl、`privacy-card` xl、`launcher-card` xl — 但 `mockup-window` lg(20px)、`mockup-input` md(16px)、`launcher-input` md(16px)。同为"卡片"层级，圆角不一致 | P2 | 统一卡片类组件用 `--radius-xl`（28px）；输入框类用 `--radius-md`（16px）；小元素用 `--radius-sm` |
| UI-16 | **缺少 spacing token**：各处硬编码 `margin-bottom: 32px` / `padding: 48px 40px` / `gap: 24px` 等，无 `--space-*` 变量 | P1 | 在 `:root` 增加 `--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px`，全局替换硬编码值 |
| UI-17 | **hover 强度不一致**：`feature-card:hover` 用 `shadow-lg`，`model-card:hover` 用 `shadow-lg`，但 `usecase-card:hover` 仅 `shadow-md`，同为内容卡片但反馈力度不同 | P2 | 统一内容卡片 hover 用 `shadow-md`，重点卡片（model）才升级 `shadow-lg` |
| UI-18 | `btn` 默认 `padding: 12px 24px`，`btn-large` `16px 36px`，但 `launcher-fallback .btn` 又覆盖为 `8px 14px`，同页面上按钮大小不一致 | P2 | fallback 按钮用单独类 `.btn-sm`，不覆盖 `.btn` 基础值 |
| UI-19 | `section { padding: 96px 0 }` 在移动端 `768px` 降到 `64px 0`，但 `final-cta` 在 `480px` 降到 `64px 0`，其他 section 在 `480px` 未定义，继承 768px 的 64px — 节奏可接受但 `hero` 在 768px 是 `100px 0 60px`，与下文 64px 跳变明显 | P2 | hero 在 768px 降到 `80px 0 60px`，平滑过渡 |

### 3.5 组件风格统一

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| UI-20 | **chip 组件有两种形态**：`launcher-chips` 中是 `<button>`（可点击），`mockup-models` 中是 `<span>`（静态展示），样式略有差异（`padding: 5px 12px` vs `4px 10px`），视觉不统一 | P2 | 抽 `.chip-base` 公共类，两种形态复用；mockup 中的 chip 加 `aria-disabled="true"` |
| UI-21 | **`orbit-node` 与 `mockup-tab-chip` 都是"模型标识"组件**，但前者是 56×56 圆角方块 + 阴影白底，后者是 pill 形 + 浅色背景，风格割裂 | P2 | 统一模型标识的视觉语言：要么都用圆角方块 + 图标，要么都用 pill + 文字 + 色点 |
| UI-22 | `mockup-switch` 是 ON 态（紫色 + 圆点靠右），但 `launcher-auto-submit` 默认 OFF 用原生 checkbox，**两种 switch 视觉风格完全不同**，同一页面两种开关组件 | P1 | `launcher-auto-submit` 也改为自定义 switch 样式，与 mockup 统一 |
| UI-23 | `btn-secondary` 在不同位置 padding 不一致（默认 `12px 24px`，`launcher-fallback` 中 `8px 14px`，`popular-more` 中未覆盖），同页面上 secondary 按钮大小不一 | P2 | 见 UI-18 |
| UI-24 | **`feature-card` 和 `usecase-card` 结构几乎相同**（icon + h3 + p），但 hover 强度、圆角、padding 略有差异，本应是同一组件 | P2 | 抽 `.info-card` 公共类，feature 和 usecase 复用，仅 icon 背景色不同 |
| UI-25 | `launcher-dot` / `mockup-dot` / `step-number` 都是"圆形标识"，但 `launcher-dot` 10px、`mockup-dot` 10px、`step-number` 56px，大小跨度大且无中间档位 | P2 | 可接受，但 `step-number` 56px 与 `feature-icon` 48px 不一致，同为"步骤/特性图标"应统一 |

---

## 四、其他发现（代码质量 & 可访问性）

| # | 问题 | 优先级 | 优化方案 |
|---|------|--------|----------|
| OT-01 | **`script.js` 中 `showFallback` 函数被声明两次**（`script.js:218` launcher 部分 + `script.js:296` GitHub 部分），后者覆盖前者，launcher 的 `showFallback` 实际调用的是 GitHub 版本，逻辑错误 | P0 | 重命名：launcher 版改为 `showLauncherFallback`，GitHub 版改为 `showGithubFallback` |
| OT-02 | `script.js:136` 判断 `launcherChips.children.length === 0` 才动态生成 chips，但 HTML 中已有 8 个静态 chip，此分支永远不执行，**死代码** | P2 | 移除动态生成逻辑（HTML 已静态化），或移除 HTML 中的静态 chips 改为 JS 生成（二选一） |
| OT-03 | `handleHeaderScroll` 中 `lastScrollY` 赋值但从未读取，**未使用变量** | P2 | 移除 `lastScrollY`，或实现滚动方向检测（向下隐藏 header / 向上显示） |
| OT-04 | **`orbit-node` 设置 `aria-hidden="true"` 但 `pointer-events: auto` 且有 hover 效果**，矛盾：对辅助技术隐藏但允许鼠标交互 | P1 | 若 orbit 纯装饰，移除 hover 效果 + `pointer-events: none`；若可交互，移除 `aria-hidden` 并加 `aria-label` |
| OT-05 | `nav-menu` 中两个 "Download" 链接文本相同（见 UX-10），屏幕阅读器会读两遍 "Download" | P0 | 见 UX-10 |
| OT-06 | `FAQ` 第一个 `details` 默认 `open`，但其余 closed，用户无法一眼知道有多少 FAQ — 可接受，但建议全部 closed 或加 FAQ 计数 | P2 | 全部 `closed`，或第一个保持 open 作为示例 |
| OT-07 | `launcher-input` 是 `contenteditable`，但 **`role="textbox"` + `aria-multiline="true"` 已正确设置** — 可访问性 OK，但 `aria-label` 文案"要分发的提示词"在英文页应为英文 | P1 | 检查 `index.html:348` 的 `aria-label`，确保与页面语言一致 |
| OT-08 | `privacy.html` 和 `zh/privacy.html` 应共享 `legal` 样式，但 `styles.css` 中 `.legal` 类定义存在，需确认子页面是否正确引用 | P2 | 检查所有法律类页面 `class="legal"` 是否应用 |
| OT-09 | `requestExtensionLaunch` 的 Promise 在组件卸载（页面跳转）时不会清理 `message` 监听器，可能内存泄漏 | P2 | 用 `AbortController` 或在 `pagehide` 事件中 `removeEventListener` |
| OT-10 | **`index.html` 重复 SVG 图标定义**：GitHub logo SVG 在 nav、hero-cta、final-cta、footer 中各硬编码一份（约 4 次重复，每次 600+ 字符） | P2 | 用 `<symbol>` + `<use>` 抽取为 SVG sprite，减少 HTML 体积约 2KB |

---

## 五、优先级总览

### P0 — 必须修复（阻断体验或功能）

1. **UX-10**：删除 `nav-menu` 中重复的 Download 链接
2. **UX-09**：桌面端导航项过多，需收进 "More" 下拉
3. **UX-11**：SEO 子页面移动端无汉堡菜单，无法导航
4. **UX-17**：中文版 JSON-LD 未完全本地化（name 字段中英混杂）
5. **UX-18**：中文版 JSON-LD `@id` / `url` 指向英文版
6. **IX-01**：`contenteditable` 截断导致光标跳动，输入体验断裂
7. **IX-07**：`launcher-send.sending` 加载态样式已写但未应用
8. **OT-01**：`showFallback` 函数重复声明导致逻辑错误

### P1 — 应修复（明显影响体验）

- 性能：critical CSS 内联、blob 降级、`.ico` 转 SVG
- 导航：focus trap、子页面导航一致性
- 切换：语言切换转场动画
- 表单：counter 遮挡、错误色区分、aria 关联
- 交互：chip :active、复制成功反馈、model-card 键盘焦点
- 动效：hero 进场、FAQ 展开动画、触摸设备步骤联动
- UI：section 背景节奏、chip 对比度、错误/成功 token、Inter 字体加载、中文排版、spacing token、switch 组件统一
- 可访问性：orbit-node 矛盾、aria-label 本地化

### P2 — 可优化（打磨级）

- 超小屏适配、滚动 reveal stagger、各种 hover 统一、SVG sprite、死代码清理等

---

## 六、推荐实施顺序

1. **第一波（P0，1–2 天）**：修复阻断问题 → 让功能正确
2. **第二波（P1 性能 + 导航，2–3 天）**：critical CSS、blob 降级、子页面导航统一
3. **第三波（P1 交互 + UI，3–5 天）**：表单反馈、动效、组件统一、中文排版
4. **第四波（P2 打磨，持续）**：死代码清理、小屏适配、SVG sprite

---

**审查人**：Frontend Developer Agent
**审查日期**：2026-07-14
**审查范围**：index.html / zh/index.html / script.js / styles.css / locale.js / SEO 子页面抽样
