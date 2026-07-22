<p align="center">
  <img src="assets/readme-icon.png" alt="ModelAny 图标" width="128">
</p>

# ModelAny：一次提问，发送给多个 AI 大模型

[ModelAny](https://www.modelany.app) 是一款免费开源的 Chrome 扩展。只需输入一次问题，即可同时获取 ChatGPT、Gemini、DeepSeek、Kimi、通义千问、豆包、文心和智谱 GLM 等多个 AI 大模型的回答并进行比较。

不用在多个 AI 标签页之间反复复制粘贴，让研究、写作、编程、学习和头脑风暴更高效。

<p align="center">
  <a href="https://www.modelany.app">访问官网</a> ·
  <a href="https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb">Chrome 商店安装</a>
</p>

## 为什么使用 ModelAny？

- **一次提问，多模型回答**：输入一次问题，同时发送到你选择的多个 AI 大模型。
- **快速比较不同视角**：横向查看不同模型的答案、语气、结构和解决方案。
- **自动打开 AI 对话**：自动为每个选中的模型打开独立对话标签页并填入问题。
- **可选自动发送**：可以自动提交问题，也可以先检查内容，再手动发送。
- **标签页自动归组**：同一轮打开的 AI 对话集中管理，保持浏览器工作区整洁。
- **右键快速提问**：选中网页文本后，可以直接通过右键菜单发送给多个 AI。
- **本地优先隐私**：草稿、设置和历史记录保存在浏览器本地，ModelAny 不会将问题上传到自己的服务器。

## 支持的 AI 模型

| 模型 | 官网 |
| --- | --- |
| ChatGPT | [chatgpt.com](https://chatgpt.com/) |
| Gemini | [gemini.google.com](https://gemini.google.com/) |
| DeepSeek | [chat.deepseek.com](https://chat.deepseek.com/) |
| Kimi | [kimi.com](https://www.kimi.com/) |
| 智谱 GLM | [chatglm.cn](https://chatglm.cn/) |
| 通义千问 Qwen | [qianwen.com](https://www.qianwen.com/) |
| 豆包 Doubao | [doubao.com](https://www.doubao.com/chat/) |
| 文心 Wenxin | [wenxin.baidu.com](https://wenxin.baidu.com/) |

## 安装 ModelAny

Chrome 网上应用店已上架。Microsoft Edge Add-ons 仍在审核中。

1. 打开 [ModelAny Chrome Web Store](https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb)。
2. 点击“添加至 Chrome”完成安装。
3. 非 Chrome 浏览器请改用 Google Chrome 安装；Edge 商店上架前暂不提供其他安装入口。

## 使用方法

1. 点击浏览器工具栏中的 ModelAny 图标。
2. 输入要提问的内容。
3. 选择一个或多个 AI 模型。
4. 根据需要开启自动发送。
5. 点击发送，在多个 AI 标签页中比较回答。

你也可以在网页中选中文字，使用右键菜单快速发起多模型提问。

## 使用场景

- **研究与资料整理**：从多个模型获得不同的分析角度和信息组织方式。
- **写作与内容创作**：比较不同语气、结构和表达风格。
- **编程与调试**：交叉验证代码方案、边界情况和错误解释。
- **学习与知识理解**：同时获取多种讲解方式，找到更容易理解的答案。
- **头脑风暴**：让多个 AI 同时产生创意，再组合出更好的想法。

## 隐私承诺

ModelAny 采用本地优先设计：

- 你的问题只会发送到你主动选择的 AI 服务。
- ModelAny 不会把问题、历史记录或诊断信息上传到自己的服务器。
- 草稿和设置保存在你的浏览器本地。
- 项目开源，欢迎查看和审查代码。

## 项目链接

- 官网：[modelany.app](https://www.modelany.app)
- 下载：[Chrome Web Store](https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb)
- GitHub：[kyreemeng/ModelAny](https://github.com/kyreemeng/ModelAny)
- 联系邮箱：kyreemeng@gmail.com

## 关于本仓库

本仓库是 ModelAny 官方产品官网，使用纯 HTML、CSS 和 JavaScript 构建，无框架、无构建步骤、零运行时依赖。

```bash
python3 -m http.server 8765
```

然后打开 <http://localhost:8765> 预览官网。

### 程序化 SEO 页面

P0/P1 对比长尾页由 `seo/generate.mjs` 生成，覆盖 `/compare/`、`/best-for/`、`/alternatives/`、`/free/`、`/pricing/`、`/zh/compare/`。页面只有在具备官方来源、完成第一方多模型测试并通过人工审校后才允许索引；未达标页面统一输出 `noindex,follow` 且不会进入 sitemap。

```bash
npm run generate:seo
```

生成结果会写入对应目录、更新根目录 `sitemap.xml`，并生成 Vercel 的永久重定向规则。

评测快照刷新后会同步把最新结果渲染进中英文评测页，确保关闭 JavaScript 或搜索引擎尚未执行脚本时仍能读取核心数据。仅基于现有快照重渲染可运行：

```bash
npm run render:benchmarks
```

真实测试的采集格式见 [`seo/TESTING_TEMPLATE.md`](seo/TESTING_TEMPLATE.md)。完整原始输出归档后，在 `seo/data/test-results.json` 增加对应 URL 的日期、地区、模型/套餐、方法、人工结论和公开证据链接，再重新运行生成器。