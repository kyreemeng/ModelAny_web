/**
 * Per-pair editorial notes that deepen the priority Chinese comparison pages
 * (glm-vs-chatgpt, kimi-vs-chatgpt, doubao-vs-chatgpt, glm-vs-deepseek) beyond
 * the shared template.
 *
 * Evidence rules:
 * - `snapshot` items only restate what the dated public benchmark snapshot in
 *   benchmarks/data/latest.json shows for that exact pair, with exact model
 *   versions and scores. No derived rankings beyond "higher/lower on this test".
 * - `practical` items only state provider/availability facts verifiable on the
 *   official sites linked in the sources section (vendor, official URL, general
 *   access context). No prices or quotas—those link to official pages instead.
 * - `testPack` items are tasks the reader runs themselves; the page never
 *   claims ModelAny ran them.
 */

export const zhCompareNotes = {
  'glm-vs-chatgpt': {
    headline: 'GLM vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-27 抓取的公开快照里，GLM 5 (high) 修好 72.8% 的真实 GitHub 问题，与 ChatGPT 的 GPT 5.2 (high)（72.8%）持平；而上一代 GLM-4.6 为 68.2%，落后于 GPT 5.2。也就是说：这批测试里，GLM 新版本已经追平 ChatGPT 的代表配置，版本选择对结论影响很大。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: 'GLM 的官网 chatglm.cn 面向中国大陆用户可直接访问、手机号即可登录；ChatGPT 官网（chatgpt.com）则需要非中国大陆地区的访问条件与相应账号。日常「打开就能用」这一点，两边差异明显。',
      },
      {
        label: '中文主场',
        text: 'GLM 由智谱 AI 开发，对话界面与默认行为围绕中文用户设计；ChatGPT 的中文能力在持续进步，但产品内层（提示模板、部分工具调用、区域内容）仍以英文场景为先。中文任务建议放在你的实测里重点核对。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 GLM 官网与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与支付方式。',
      },
    ],
    testPack: [
      '中文长文改写：贴一段 800 字以上的文章，要求保持语气并压缩到 300 字，检查谁更少出现翻译腔',
      '真实代码修复：从一个你还没修的报错开始，把报错与相关代码原文贴给两边，限定「先给最可能原因，再给最小修复」',
      '多轮一致性：围绕同一方案连续追问 5 轮（改需求、加约束），观察谁更早忘记前面的前提',
    ],
    bottomLine: '在可核验的公开测试里，这一对在代码修复上已经接近打平；拉开日常体验差距的是访问门槛、中文语感与价格结构——这三件事只有你自己的同题实测能回答。',
  },

  'kimi-vs-chatgpt': {
    headline: 'Kimi vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-27 抓取的公开快照里，Kimi K2.5 (high) 修好 70.8% 的真实 GitHub 问题（Lingxi v1.5 × Kimi K2 组合为 71.2%），ChatGPT 的 GPT 5.2 (high) 为 72.8%。差距约 1.5–2 个百分点，比很多人预期的小；在具体任务上两边互有胜负是完全可能的。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: 'Kimi 官网 kimi.com 面向中国大陆用户可直接访问、手机号即可登录；ChatGPT 需要非中国大陆地区的访问条件与相应账号。把「每天要不要为打开它多花一步」算进选择成本。',
      },
      {
        label: '产品定位',
        text: 'Kimi 以长材料阅读作为主打卖点（超长文档/链接总结），产品界面围绕这类任务做了快捷入口；ChatGPT 的强项覆盖更宽（图像、语音、插件生态）。你的主任务落在哪一侧，决定哪边的「顺手感」更值钱。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 Kimi 官网与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与支付方式。',
      },
    ],
    testPack: [
      '超长材料摘要：选一份 50 页以上的 PDF 或很长的网页，让两边都输出「10 条要点 + 原文位置」，核对有没有编造',
      '中译英商务邮件：同一封中文邮件，要求正式商务语气，检查谁的措辞更像母语者写的',
      '逐步推理题：一道你已知答案的多步推理题，观察中间步骤是否会自圆其说地跑偏',
    ],
    bottomLine: '公开测试里代码修复差距只有一两分，但两者的产品重心不同：长材料阅读 vs 全能生态。用你自己最重的那类任务各跑一次，比看任何榜单都有用。',
  },

  'doubao-vs-chatgpt': {
    headline: 'Doubao vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-27 抓取的公开快照里，豆包的智能体组合（TRAE + Doubao-Seed-Code）修好 78.8% 的真实 GitHub 问题，排在该榜第 3，高于快照中 ChatGPT 系配置的最好记录（74.6%）。注意：这是「智能体框架 + 模型」的组合成绩，不代表模型单独能力的排名，但足以说明国产组合在这类测试里已进入第一梯队。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '豆包官网 doubao.com 面向中国大陆用户可直接访问、手机号即可登录，另有移动 App 生态；ChatGPT 需要非中国大陆地区的访问条件与相应账号。',
      },
      {
        label: '产品定位',
        text: '豆包由字节跳动开发，与抖音生态、移动端场景结合紧密，中文日常问答与内容创作为主场景；ChatGPT 在英文任务、专业工具链上覆盖更广。两边的主场几乎不重叠，选型先看你每天的任务清单。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在豆包官网与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与支付方式。',
      },
    ],
    testPack: [
      '中文内容创作：给一个短视频脚本或公众号选题，要求「口语化、有钩子」，对比谁的初稿可用度更高',
      '真实代码修复：把同一个未修复的报错分别交给两边，限定回答格式，核对谁给出的修复能直接跑通',
      '事实核查：挑 5 条你确定答案的中文热点事实，看两边谁更容易一本正经地编造',
    ],
    bottomLine: '这是四对里反差最大的一组：在公开的智能体编程测试里，豆包组合的成绩排进了全榜前三；而 ChatGPT 的优势在英文与专业生态。分开场景评价，比找一个「全面赢家」更接近真实。',
  },

  'glm-vs-deepseek': {
    headline: 'GLM vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-27 抓取的公开快照里，GLM 5 (high) 修好 72.8% 的真实 GitHub 问题（列第 25），DeepSeek V3.2 (high) 为 70%（列第 46），DeepSeek V3.2 Reasoner 为 60%。这批测试里 GLM 新版本领先约 3 个百分点；DeepSeek 的推理向版本在该项反而偏低，说明「选对版本」比「选对品牌」影响更大。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '两边官网（chatglm.cn 与 chat.deepseek.com）都面向中国大陆用户可直接访问、手机号即可登录，这一点与需要海外访问条件的 ChatGPT 不同，也是中文用户在同题实测里最容易保持公平的一对。',
      },
      {
        label: '产品定位',
        text: 'DeepSeek 以开放权重与研究向发布见长，推理与数学是它反复被讨论的场景；GLM（智谱清言）则把通用对话、代码与办公场景做进产品入口。两个官网的默认体验差异明显，值得各用一周再下结论。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 chatglm.cn 与 DeepSeek 官网（见下方官方来源）核对当前套餐、免费额度与 API 价格。',
      },
    ],
    testPack: [
      '数学与推理：同一道多步数学题或逻辑题，要求展示中间步骤，核对哪边的步骤经得起复算',
      '中文写作：同一篇产品说明，分别让两边写，再让第三个模型盲评两稿，避免自己偏心',
      '代码重构：同一段难读的函数，要求「只改可读性不改行为」，跑测试确认谁真的没改坏',
    ],
    bottomLine: '两个都能大陆直连的国产模型，同题实测的成本最低。公开测试显示 GLM 5 在代码修复上暂时领先，但版本迭代很快——把这一页存的快照日期和你实测的日期对齐，再下结论。',
  },

  'qwen-vs-chatgpt': {
    headline: '通义千问 vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-29 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。代表 Qwen 的提交（Nebius AI Qwen 2.5 72B Generator + LLama 3.1 70B Critic）修好 40.6% 的真实 GitHub 问题，ChatGPT 系最好配置（JoyCode + Claude 4 Sonnet + GPT-4.1）为 74.6%。注意：两边都是「智能体框架 + 模型」的组合成绩，且 Qwen 侧提交并非其最新一代模型——单凭这一项，不足以对两个产品下整体结论。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '通义千问官网（tongyi.aliyun.com / chat.qwen.ai）面向中国大陆用户可直接访问、手机号即可登录；ChatGPT 官网需要非中国大陆地区的访问条件与相应账号。日常「打开就能用」这一点差异明显。',
      },
      {
        label: '产品定位',
        text: '通义千问由阿里巴巴开发，与阿里云办公生态结合紧密，Qwen 系列还开放了模型权重，便于自部署；ChatGPT 的英文任务覆盖与插件、工具链更成熟。两边主场几乎不重叠，选型先看你每天的任务清单。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在通义千问官网与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与支付方式。',
      },
    ],
    testPack: [
      '中文长文摘要：贴一篇 3000 字以上的文章，要求先给要点清单再给 200 字摘要，核对谁更少漏掉关键信息',
      '真实代码任务：用你手头没修完的报错，同时发给两边并限定回答格式，核对谁的修复能直接跑通',
      '多轮追问一致性：围绕同一需求连续追问 5 轮，观察谁更早忘记前轮给出的前提',
    ],
    bottomLine: '这一对的共同公开证据只有一项真实代码修复测试，且分差来自特定的智能体组合，不能直接推断「通义千问整体更弱」。它真正的强项（中文与办公生态）本就不在这类英文榜单里——用你自己的任务同题实测，比看单一榜单更接近真实。',
  },

  'qwen-vs-deepseek': {
    headline: '通义千问 vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-29 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。代表 Qwen 的提交（Nebius AI Qwen 2.5 72B Generator + LLama 3.1 70B Critic）修好 40.6% 的真实 GitHub 问题，DeepSeek V3.2 (high) 为 70%（列第 46）。同样注意：Qwen 侧是「智能体框架 + 模型」的组合成绩，且不一定是其最新模型版本，证据覆盖面很窄。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '两边官网（tongyi.aliyun.com / chat.qwen.ai 与 chat.deepseek.com）都面向中国大陆用户可直接访问、手机号即可登录，是同题实测成本最低的一类组合。',
      },
      {
        label: '产品定位',
        text: '通义千问背靠阿里云生态，办公、文档与中文创作场景是产品入口的主场；DeepSeek 以开放权重与研究向发布见长，推理与数学是被反复讨论的强项。两边官网的默认体验差异明显，值得各用一周再下结论。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在通义千问官网与 DeepSeek 官网（见下方官方来源）核对当前套餐、免费额度与 API 价格。',
      },
    ],
    testPack: [
      '数学与推理：同一道多步数学题或逻辑题，要求展示中间步骤，核对哪边的步骤经得起复算',
      '中文办公写作：同一份周报或产品说明分别让两边写，再让第三个模型盲评两稿',
      '代码重构：同一段难读的函数，要求「只改可读性不改行为」，跑测试确认谁真的没改坏',
    ],
    bottomLine: '两个都能大陆直连的国产模型，同题实测成本最低。公开证据只覆盖代码修复一项、且 Qwen 侧来自特定智能体组合——把这一页的快照日期和你实测的日期对齐，再按任务下结论。',
  },

  'doubao-vs-deepseek': {
    headline: '豆包 vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-09-29 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。豆包的智能体组合（TRAE + Doubao-Seed-Code）修好 78.8% 的真实 GitHub 问题，排在该榜第 3；DeepSeek V3.2 (high) 为 70%（列第 46）。说明：豆包一侧是「智能体框架 + 模型」的组合成绩，不代表模型单独能力排名，但足以说明国产组合在这类测试里已进入第一梯队。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '豆包官网 doubao.com 与 DeepSeek 官网 chat.deepseek.com 都面向中国大陆用户可直接访问、手机号即可登录；豆包另有移动 App 生态，DeepSeek 以网页与 API 为主。',
      },
      {
        label: '产品定位',
        text: '豆包由字节跳动开发，与抖音生态、移动端日常场景结合紧密，主战场是中文问答与内容创作；DeepSeek 开放权重、以推理与数学见长，更受研究与技术用户关注。两边主场几乎不重叠。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在豆包官网与 DeepSeek 官网（见下方官方来源）核对当前套餐、免费额度与 API 价格。',
      },
    ],
    testPack: [
      '中文内容创作：给一个短视频脚本或公众号选题，要求「口语化、有钩子」，对比谁的初稿可用度更高',
      '真实代码修复：把同一个未修复的报错分别交给两边，限定回答格式，核对谁的修复能直接跑通',
      '事实核查：挑 5 条你确定答案的中文热点事实，看两边谁更容易一本正经地编造',
    ],
    bottomLine: '在公开的智能体编程测试里，豆包组合排进了全榜前三，DeepSeek V3.2 稳定但不是这项的最强版本；而 DeepSeek 的推理、数学与开放权重优势不在这一项测试里。分开场景评价，比找一个「全面赢家」更接近真实。',
  },

  'kimi-vs-deepseek': {
    headline: 'Kimi vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '人类偏好口吻（LMArena，2026-09-25 榜单）',
        text: '代码类：Kimi kimi-k3-max 1660 Elo（列第 9），DeepSeek deepseek-v4.1-flash-max 1621（列第 16）；文本类：Kimi 1488（第 16）也略高于 DeepSeek 1477（第 29）。Arena 反映的是盲测偏好口吻，两边的差距都在几个百分点内。',
      },
      {
        label: '能力分项（LiveBench）',
        text: 'Agentic Coding：DeepSeek deepseek-v4.1-flash-max 77.3 排全榜第 1，Kimi kimi-k3 为 62.2（第 11）；数学：DeepSeek 95.1（第 14）明显高于 Kimi 84.4（第 51）。反过来，推理 Kimi 90.7（第 7）高于 DeepSeek 86.7（第 29），语言 Kimi 85.5 也高于 DeepSeek 82.1。两家的强项几乎错开。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Kimi 侧提交（Lingxi v1.5 x Kimi K2）修好 71.2% 的真实 GitHub 问题，DeepSeek V3.2 (high) 为 70%——在这一项上几乎持平。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: 'Kimi 官网 kimi.com（月之暗面）与 DeepSeek 官网 chat.deepseek.com 都面向中国大陆用户可直接访问、手机号即可登录，同题实测成本很低。',
      },
      {
        label: '产品定位',
        text: 'Kimi 以长上下文阅读和中文社区口碑见长，适合整本文档、长报告场景；DeepSeek 开放权重、推理与数学口碑扎实，API 生态也更偏技术用户。按你最常见的输入长度和任务类型选。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 Kimi 官网与 DeepSeek 官网（见下方官方来源）核对当前套餐、免费额度与 API 价格。',
      },
    ],
    testPack: [
      '超长文档阅读：把一本 PDF 报告或 10 万字资料分别投给两边，问同一组细节问题，核对谁记得住前后文',
      '数学多步推理：同一道多步题要求展示中间步骤，核对哪边的步骤经得起复算',
      '真实代码修复：同一个未修复的报错分别交给两边，限定「先给最可能原因，再给最小修复」，跑测试验证',
    ],
    bottomLine: '这是八对里公开证据最丰富的一组：Arena 口碑与推理、语言项 Kimi 略优，Agentic Coding 与数学 DeepSeek 明显领先，SWE-bench 真实代码修复几乎持平——按任务选，而不是按品牌选。',
  },

  'chatgpt-vs-deepseek': {
    headline: 'ChatGPT vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '综合分项（LiveBench）',
        text: '在 2026-09-29 抓取的公开快照里，ChatGPT 的代表配置（gpt-6-astra-max 等）在语言 89.4（第 3）、推理 92.7（第 1）、数学 96.8（第 3）、数据分析 83.0（第 1）领先；DeepSeek 的 deepseek-v4.1-flash-max 在 Agentic Coding 一项拿到 77.3、排全榜第 1，反超 ChatGPT 的 57.3（第 21）。编程这一项两家差距最大，且方向与综合印象相反。',
      },
      {
        label: '人类偏好口吻（LMArena）',
        text: '代码类：ChatGPT gpt-6-astra-max 1792 Elo（第 2）明显高于 DeepSeek deepseek-v4.1-flash-max 1621（第 16）；文本类两者仅差 6 分（1483 对 1477）——日常问答的盲测偏好几乎打平，代码场景差距才拉开。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'ChatGPT 系最好配置（JoyCode + Claude 4 Sonnet + GPT-4.1）修好 74.6%，DeepSeek V3.2 (high) 为 70%。注意 ChatGPT 侧是「智能体框架 + 模型」的组合成绩。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: 'DeepSeek 官网 chat.deepseek.com 面向中国大陆用户可直接访问、手机号即可登录，开源权重可自部署；ChatGPT 需要非中国大陆地区的访问条件与相应账号。',
      },
      {
        label: '产品定位',
        text: 'ChatGPT 的英文任务、工具链与多模态覆盖更全；DeepSeek 以开放权重、推理与数学口碑见长，API 价格通常更低。若你的任务是中文为主、预算敏感，DeepSeek 的主场优势在榜单之外。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 DeepSeek 官网与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与 API 价格。',
      },
    ],
    testPack: [
      '智能体式编程：给一个需要多步修改的真实小项目任务，观察谁更少中途丢失上下文（DeepSeek 在该分项排第 1）',
      '多步推理：同一道多步题要求展示中间步骤，核对哪边的步骤经得起复算（ChatGPT 推理分项排第 1）',
      '长对话续写：把同一段 20 轮对话分别接给两边，核对谁更早忘记前面的约束',
    ],
    bottomLine: '公开快照里 ChatGPT 在语言、推理、数学、数据分析全面领先，但 DeepSeek 拿下了 Agentic Coding 单项第 1，且文本偏好几乎打平、大陆可直连——综合强不强看榜单，适不适合看你的任务与访问条件。',
  },

  'chatgpt-vs-claude': {
    headline: 'ChatGPT vs Claude：差异集中在哪',
    snapshot: [
      {
        label: '写作与代码口碑（LMArena）',
        text: '在 2026-09-25 发布、2026-09-29 抓取的榜单里，文本类 Claude claude-opus-5.5-high 1509 Elo 排第 1，ChatGPT gpt-5.6-sol-xhigh 1483 排第 19；代码类 Claude claude-opus-5.5-max 1827（第 1）对 ChatGPT gpt-6-astra-max 1792（第 2）——差距很小但方向一致。搜索类例外：ChatGPT 1257（第 1）对 Claude 1253（第 2）。',
      },
      {
        label: '能力分项（LiveBench）',
        text: '编程 Claude claude-sonnet-5-5-max-effort 91.4 排第 1（ChatGPT 83.9，第 7）；Agentic Coding Claude 71.7（第 2）对 ChatGPT 57.3（第 21）。反过来，数据分析 ChatGPT 83.0 排第 1（Claude 80.5，第 4），推理 ChatGPT 92.7（第 1）对 Claude 92.2（第 2）几乎持平。写作相关（语言分项）Claude 90.7（第 1）对 89.4（第 3）。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Claude 侧提交（Sonar Foundation Agent + Claude 4.5 Opus）修好 79.2%，排全榜第 1；ChatGPT 系最好配置（JoyCode + Claude 4 Sonnet + GPT-4.1）为 74.6%。两侧都是「智能体框架 + 模型」的组合成绩。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: '两边都需要非中国大陆地区的访问条件与相应账号（claude.ai 与 chatgpt.com）。对中国大陆用户，这一对的同题实测门槛相同，选择主要看任务与订阅预算。',
      },
      {
        label: '产品定位',
        text: 'Claude 在长文档阅读、代码重构与英文写作上口碑扎实（多项分项第 1）；ChatGPT 的生态更广：搜索接入、图像生成、语音与插件矩阵。把「每天最重的那个任务」放进同题实测再决定。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 Anthropic 与 OpenAI 定价页（见下方官方来源）核对当前套餐、免费额度与支付方式。',
      },
    ],
    testPack: [
      '长文档任务：投喂同一份 50 页 PDF，要各自引用页码回答细节，核对谁记得住前后文',
      '代码重构：同一段难读的代码要求「只改可读性不改行为」，跑测试确认谁真的没改坏（Claude 编程分项第 1）',
      '联网核查：让两边对同一时效性问题给出带来源的答案，核对引用质量（ChatGPT 搜索类第 1）',
    ],
    bottomLine: '这一对几乎每项都是前两名内斗：写作与代码 Claude 略优（多个分项第 1），搜索与数据分析 ChatGPT 略优，推理打平——差距小到值得用你自己的真实任务连续测一周，而不是看单一榜单。',
  },

  'chatgpt-vs-gemini': {
    headline: 'ChatGPT vs Gemini：差异集中在哪',
    snapshot: [
      {
        label: '指令遵循与真实代码修复',
        text: '在 2026-09-29 抓取的公开快照里，有两项是 Gemini 领先的：LiveBench 指令遵循 gemini-3.8-flash-high 81.4 排全榜第 1（ChatGPT 75.6，第 8）；SWE-bench Verified 上 Gemini 侧提交（live-SWE-agent + Gemini 3 Pro Preview）修好 77.4%（第 4），高于 ChatGPT 系最好配置的 74.6%。',
      },
      {
        label: '推理、数据与搜索类',
        text: '其余分项 ChatGPT 全面领先：推理 92.7（第 1）对 Gemini 89.3（第 16）；数据分析 83.0（第 1）对 78.5（第 21）；Arena 搜索类 1257（第 1）对 1210（第 9）；代码偏好 1792（第 2）对 1593（第 23）。文本偏好例外：Gemini 1492（第 10）略高于 ChatGPT 1483（第 19）。',
      },
    ],
    practical: [
      {
        label: '访问与登录',
        text: 'Gemini 官网 gemini.google.com 需要Google 账号，中国大陆访问需相应网络条件；ChatGPT 同样需要非大陆地区的访问条件。两者的实测门槛相当。',
      },
      {
        label: '产品定位',
        text: 'Gemini 与 Google 全家桶（搜索接地、Workspace、Android 端）整合最深，长上下文窗口大；ChatGPT 的插件与多模态生态更成熟。已有 Google 工作流的团队值得把 Gemini 放进同题实测。',
      },
      {
        label: '价格与套餐',
        text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 Google One / Gemini 与 OpenAI 定价页（见下方官方来源）核对当前套餐与免费额度。',
      },
    ],
    testPack: [
      '指令遵循：给一段含 5 条以上硬性格式要求的复杂提示词，核对谁一条不漏（Gemini 该分项第 1）',
      '数据分析：给同一份带脏数据的表格，要求清洗思路 + 结论，核对谁的处理更可靠（ChatGPT 该分项第 1）',
      '真实代码修复：把同一个未修复的报错分别交给两边，限定回答格式，核对谁的修复能直接跑通',
    ],
    bottomLine: '这不是一边倒的对局：Gemini 拿下了指令遵循第 1 和 SWE-bench 更高的组合成绩，ChatGPT 则在推理、数据分析与代码偏好上领先。结合你已有的生态（Google 全家桶或 OpenAI 工具链）同题实测，比看总分更有意义。',
  },
};
