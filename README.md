# ModelAny：一次提问，同时获得多个 AI 的回答

[ModelAny](https://modelany.app) 是一款开源的多模型 AI 浏览器扩展。输入一次问题，即可同时发送给 ChatGPT、Gemini、DeepSeek、Kimi、通义千问、豆包、文心和智谱 GLM，快速比较不同模型的回答与思路。

不用在多个 AI 标签页之间反复复制粘贴，让研究、写作、编程、学习和头脑风暴更高效。

<p align="center">
  <a href="https://modelany.app">访问官网</a> ·
  <a href="https://github.com/kyreemeng/ModelAny-Releases/releases/tag/v1.0.1">下载 ModelAny v1.0.1</a> 
</p>

## 为什么使用 ModelAny？

- **一次提问，多模型回答**：输入一次提示词，同时发送到你选择的多个 AI 模型。
- **快速比较不同视角**：横向查看不同模型的答案、语气、结构和解决方案。
- **自动打开 AI 对话**：自动为每个选中的模型打开独立对话标签页并填入提示词。
- **可选自动发送**：可以自动提交问题，也可以先检查内容，再手动发送。
- **标签页自动归组**：同一轮打开的 AI 对话集中管理，保持浏览器工作区整洁。
- **右键快速提问**：选中网页文本后，可以直接通过右键菜单发送给多个 AI。
- **本地优先隐私**：草稿、设置和历史记录保存在浏览器本地，ModelAny 不会将提示词上传到自己的服务器。

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

目前 Chrome Web Store 和 Microsoft Edge Add-ons 版本正在上架审核。临时版本可通过 GitHub Release 安装：

1. 打开 [ModelAny v1.0.1 Release](https://github.com/kyreemeng/ModelAny-Releases/releases/tag/v1.0.1)。
2. 下载 `ModelAny-v1.0.1.zip` 并解压。
3. 在 Chrome 或 Edge 地址栏打开 `chrome://extensions` 或 `edge://extensions`。
4. 开启右上角的“开发者模式”。
5. 点击“加载已解压的扩展程序”，选择解压后的 ModelAny 文件夹。

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

- 提示词只会发送到你主动选择的 AI 服务。
- ModelAny 不会把提示词、历史记录或诊断信息上传到自己的服务器。
- 草稿和设置保存在你的浏览器本地。
- 项目开源，欢迎查看和审查代码。

## 项目链接

- 官网：[modelany.app](https://modelany.app)
- 下载：[GitHub Release v1.0.1](https://github.com/kyreemeng/ModelAny-Releases/releases/tag/v1.0.1)
- 联系邮箱：kyreemeng@gmail.com

## 关于本仓库

本仓库是 ModelAny 官方产品官网，使用纯 HTML、CSS 和 JavaScript 构建，无框架、无构建步骤、零运行时依赖。

```bash
python3 -m http.server 8765
```

然后打开 <http://localhost:8765> 预览官网。
