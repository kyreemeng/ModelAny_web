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
        text: '在 2026-10-09 抓取的公开快照里，GLM 5 (high) 修好 72.8% 的真实 GitHub 问题（第 25）。被标成 ChatGPT 的最高分 74.6% 来自 JoyCode + Claude 4 Sonnet + GPT-4.1，是混用 Claude 的智能体组合，不是独立 ChatGPT。版本选择对结论影响很大。',
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
    decision: [
      {
        label: '选 GLM，如果',
        text: '你在意打开就能用、手机号即可登录，主力任务是中文写作与中文代码注释，且希望把成本控制在可预测的范围内。公开测试显示它的新版本在代码修复上已与 ChatGPT 代表配置持平。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你的工作流依赖英文语料、第三方工具接入与成熟的插件生态，或者需要与非中文团队共享同一套提示词与产出格式。',
      },
      {
        label: '不要只看这一个指标',
        text: '公开数据只覆盖共同出现的测试类别（本对主要是代码修复）。中文长文、语气控制与多轮一致性没有公开同题成绩，必须用上面的三条任务自己跑一遍。',
      },
    ],
    bottomLine: '在可核验的公开测试里，这一对在代码修复上已经接近打平；拉开日常体验差距的是访问门槛、中文语感与价格结构——这三件事只有你自己的同题实测能回答。',
  },

  'kimi-vs-chatgpt': {
    headline: 'Kimi vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，Kimi 侧提交（Lingxi v1.5 x Kimi K2）修好 71.2% 的真实 GitHub 问题（第 35）。被标成 ChatGPT 的最高分 74.6% 来自 JoyCode + Claude 4 Sonnet + GPT-4.1 混用组合。差距不大，具体任务上两边互有胜负完全可能。',
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
    decision: [
      {
        label: '选 Kimi，如果',
        text: '你的高频任务是消化长材料——几十页的 PDF、长网页、会议记录——并且需要在国内直接访问、手机号即登录。它的产品入口就是为这类任务设计的。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你需要的是一套覆盖更宽的工作台：图像、语音、工具调用与第三方生态。公开测试里代码修复的差距只有一两分，不足以成为决定性理由。',
      },
      {
        label: '不要只看这一个指标',
        text: '公开数据只覆盖代码修复一类，本对的真正差异在长文本处理与语感上，这部分没有公开同题成绩。请用上面的三条任务各跑一次。',
      },
    ],
    bottomLine: '公开测试里代码修复差距只有一两分，但两者的产品重心不同：长材料阅读 vs 全能生态。用你自己最重的那类任务各跑一次，比看任何榜单都有用。',
  },

  'doubao-vs-chatgpt': {
    headline: 'Doubao vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，豆包的智能体组合（TRAE + Doubao-Seed-Code）修好 78.8% 的真实 GitHub 问题，排在该榜第 3。被标成 ChatGPT 的最高分 74.6% 来自 JoyCode + Claude 4 Sonnet + GPT-4.1，不是独立 ChatGPT 配置。豆包这一项是「智能体框架 + 模型」的组合成绩，不代表模型单独能力的排名。',
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
    decision: [
      {
        label: '选豆包，如果',
        text: '你的主战场是中文日常问答、短视频脚本与移动端场景，且要求大陆直连、手机号即登录。公开的智能体编程组合成绩已进入第一梯队。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你的任务依赖英文语料、专业工具链与成熟的插件生态，或需要与非中文团队共用一套提示词与产出格式。',
      },
      {
        label: '不要只看这一个指标',
        text: '78.8% 那一项是「智能体框架 + 模型」的组合成绩，不等于豆包模型单独最强。本对没有中文创作与事实核查的公开同题成绩，请自行实测。',
      },
    ],
    bottomLine: '这是四对里反差最大的一组：在公开的智能体编程测试里，豆包组合的成绩排进了全榜前三；而 ChatGPT 的优势在英文与专业生态。分开场景评价，比找一个「全面赢家」更接近真实。',
  },

  'glm-vs-deepseek': {
    headline: 'GLM vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，GLM 5 (high) 修好 72.8% 的真实 GitHub 问题（第 25），DeepSeek V3.2 (high) 为 70%（第 46）。这批测试里 GLM 领先约 3 个百分点；说明「选对版本」比「选对品牌」影响更大。',
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
    decision: [
      {
        label: '选 GLM，如果',
        text: '你更看重通用对话、代码与办公场景的成品体验，希望打开官网就能覆盖日常任务；公开快照里它的新版本在代码修复上领先约 3 个百分点。',
      },
      {
        label: '选 DeepSeek，如果',
        text: '你关注开放权重、可自部署与推理/数学任务。注意版本差异很大：同一家不同版本的分数可以相差十个百分点以上。',
      },
      {
        label: '不要只看这一个指标',
        text: '两个都能大陆直连，是实测成本最低的一对——正因为成本低，更值得自己跑一遍，而不是只依赖一页快照。快照日期务必与你实测的日期对齐。',
      },
    ],
    bottomLine: '两个都能大陆直连的国产模型，同题实测的成本最低。公开测试显示 GLM 5 在代码修复上暂时领先，但版本迭代很快——把这一页存的快照日期和你实测的日期对齐，再下结论。',
  },

  'qwen-vs-chatgpt': {
    headline: '通义千问 vs ChatGPT：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。代表 Qwen 的提交修好 40.6%。被标成 ChatGPT 的最高分 74.6% 来自 JoyCode + Claude 4 Sonnet + GPT-4.1 混用组合。两边都是智能体组合成绩，且 Qwen 侧并非最新一代模型——单凭这一项不足以下整体结论。',
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
    decision: [
      {
        label: '选通义千问，如果',
        text: '你的任务是中文文档、办公协作与需要在阿里云生态内落地，或你有自部署 Qwen 权重计划。大陆直连与手机号登录也降低了日常使用成本。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你需要的是英文任务覆盖、成熟插件生态与更广的第三方工具接入。',
      },
      {
        label: '不要只看这一个指标',
        text: '本对的共同公开证据只有一项，且 Qwen 侧来自特定智能体组合、并非其最新模型。这一页不能用来判断「谁整体更强」。',
      },
    ],
    bottomLine: '这一对的共同公开证据只有一项真实代码修复测试，且分差来自特定的智能体组合，不能直接推断「通义千问整体更弱」。它真正的强项（中文与办公生态）本就不在这类英文榜单里——用你自己的任务同题实测，比看单一榜单更接近真实。',
  },

  'qwen-vs-deepseek': {
    headline: '通义千问 vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。代表 Qwen 的提交修好 40.6%，DeepSeek V3.2 (high) 为 70%（第 46）。Qwen 侧是智能体组合成绩且不一定是最新模型，证据覆盖面很窄。',
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
    decision: [
      {
        label: '选通义千问，如果',
        text: '你的重心是中文办公、文档处理与阿里云生态内的落地，或有基于 Qwen 权重自部署的打算。',
      },
      {
        label: '选 DeepSeek，如果',
        text: '你更看重推理与数学任务、开放权重与 API 接入，且能接受它在个别基准项上并非最优配置。',
      },
      {
        label: '不要只看这一个指标',
        text: '本对的公开证据只覆盖代码修复一项，且 Qwen 侧是智能体组合成绩。两个站点都能大陆直连，用三条实测任务自己跑一遍成本很低。',
      },
    ],
    bottomLine: '两个都能大陆直连的国产模型，同题实测成本最低。公开证据只覆盖代码修复一项、且 Qwen 侧来自特定智能体组合——把这一页的快照日期和你实测的日期对齐，再按任务下结论。',
  },

  'doubao-vs-deepseek': {
    headline: '豆包 vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '在 2026-10-09 抓取的公开快照里，这一对只有一项共同测试：SWE-bench Verified。豆包智能体组合（TRAE + Doubao-Seed-Code）修好 78.8%，排第 3；DeepSeek V3.2 (high) 为 70%（第 46）。豆包一侧是组合成绩，不代表模型单独能力排名。',
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
    decision: [
      {
        label: '选豆包，如果',
        text: '你的主战场是中文内容创作、移动端场景与抖音生态，且需要大陆直连、手机号即登录。',
      },
      {
        label: '选 DeepSeek，如果',
        text: '你关注推理、数学与开放权重，或有自部署与 API 集成的需求。',
      },
      {
        label: '不要只看这一个指标',
        text: '豆包 78.8% 那一项是智能体组合成绩；DeepSeek 的推理与开放权重优势不在这一项测试里。用上面的任务分别实测更接近真实。',
      },
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
    decision: [
      {
        label: '选 Kimi，如果',
        text: '你要处理超长材料（整本报告、长网页），并且看重中文语感和界面顺手程度；公开快照里它在推理与语言项上略优。',
      },
      {
        label: '选 DeepSeek，如果',
        text: '你的任务是数学推理、智能体编程，或有自部署与 API 集成的需求；公开快照里它在这两项领先明显。',
      },
      {
        label: '不要只看这一个指标',
        text: '这是本站公开证据最丰富的一对，但两类任务各有胜负。先把你的高频任务对应到上表，再决定要不要接受「统一用一个模型」。',
      },
    ],
    bottomLine: '这是八对里公开证据最丰富的一组：Arena 口碑与推理、语言项 Kimi 略优，Agentic Coding 与数学 DeepSeek 明显领先，SWE-bench 真实代码修复几乎持平——按任务选，而不是按品牌选。',
  },

  'chatgpt-vs-deepseek': {
    headline: 'ChatGPT vs DeepSeek：差异集中在哪',
    snapshot: [
      {
        label: '综合分项（LiveBench）',
        text: '在 2026-10-09 抓取的公开快照里，ChatGPT 代表配置在语言 90.13（第 2）、推理 92.65（第 1）、数学 96.83（第 3）、数据分析 82.97（第 1）领先；DeepSeek 的 deepseek-v4.1-flash-max 在 Agentic Coding 拿到 77.27、排全榜第 1，反超 ChatGPT 的 57.32（第 21）。编程这一项两家差距最大。',
      },
      {
        label: '人类偏好口吻（LMArena）',
        text: '代码类：ChatGPT gpt-6-astra-max 1792 Elo（第 2）明显高于 DeepSeek deepseek-v4.1-flash-max 1621（第 16）；文本类两者仅差 6 分（1483 对 1477）——日常问答的盲测偏好几乎打平，代码场景差距才拉开。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: '被标成 ChatGPT 的最高分（JoyCode + Claude 4 Sonnet + GPT-4.1）修好 74.6%，但这是混用 Claude 的智能体组合，不是独立 ChatGPT 配置；ChatGPT 单独提交的最好成绩是 GPT 5.2 (high) 的 72.8%。DeepSeek V3.2 (high) 为 70%。',
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
    decision: [
      {
        label: '选 ChatGPT，如果',
        text: '你的工作覆盖语言、推理、数学与数据分析等多种任务，需要一处解决大部分场景；公开快照里它在这些类别均处于前列。',
      },
      {
        label: '选 DeepSeek，如果',
        text: '你更看重开放权重、可自部署、API 成本与中文技术任务，且能接受部分类别落后于头部配置。',
      },
      {
        label: '不要只看这一个指标',
        text: '公开快照覆盖面较广，但仍是特定测试与特定版本的结果。价格、区域可用性与长对话稳定性不在这些分数里。',
      },
    ],
    bottomLine: '公开快照里 ChatGPT 在语言、推理、数学、数据分析全面领先，但 DeepSeek 拿下了 Agentic Coding 单项第 1，且文本偏好几乎打平、大陆可直连——综合强不强看榜单，适不适合看你的任务与访问条件。',
  },

  'chatgpt-vs-claude': {
    headline: 'ChatGPT vs Claude：差异集中在哪',
    snapshot: [
      {
        label: '写作与代码口碑（LMArena）',
        text: '在 2026-10-09 抓取的 Arena 榜单里，文本类 Claude claude-opus-4-6-high 1505 Elo 排第 2，ChatGPT gpt-5.6-sol-xhigh 1484 排第 20；代码类 Claude claude-opus-5.5-max 1814（第 1）对 ChatGPT gpt-6-astra-max 1788（第 2）。搜索类例外：ChatGPT 1257（第 1）对 Claude 1253（第 2）。',
      },
      {
        label: '能力分项（LiveBench）',
        text: '编程 Claude claude-sonnet-5-5-max-effort 91.4 排第 1（ChatGPT 83.9，第 7）；Agentic Coding Claude 71.7（第 2）对 ChatGPT 57.3（第 21）。反过来，数据分析 ChatGPT 83.0 排第 1（Claude 80.5，第 4），推理 ChatGPT 92.7（第 1）对 Claude 92.2（第 2）几乎持平。写作相关（语言分项）Claude 90.7（第 1）对 89.4（第 3）。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Claude 侧提交（Sonar Foundation Agent + Claude 4.5 Opus）修好 79.2%，排全榜第 1。被标成 ChatGPT 的最高分（JoyCode + Claude 4 Sonnet + GPT-4.1）为 74.6%，但这是混用 Claude 的智能体组合；ChatGPT 单独提交的最好成绩是 GPT 5.2 (high) 的 72.8%。',
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
    decision: [
      {
        label: '选 Claude，如果',
        text: '你的高频任务是写作、长文精修与代码审阅。公开快照里它在这些分项多次排在第 1，输出风格也更保守。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你需要更宽的通用覆盖、图像与语音入口、以及更大的第三方工具生态。',
      },
      {
        label: '不要只看这一个指标',
        text: '两者几乎每项都处于前两名，差距小到不足以替代实测。用同一篇稿子、同一条 PR 各跑一次，比读分数更快得到结论。',
      },
    ],
    bottomLine: '这一对几乎每项都是前两名内斗：写作与代码 Claude 略优（多个分项第 1），搜索与数据分析 ChatGPT 略优，推理打平——差距小到值得用你自己的真实任务连续测一周，而不是看单一榜单。',
  },

  'chatgpt-vs-gemini': {
    headline: 'ChatGPT vs Gemini：差异集中在哪',
    snapshot: [
      {
        label: '指令遵循与真实代码修复',
        text: '在 2026-09-29 抓取的公开快照里，有两项是 Gemini 领先的：LiveBench 指令遵循 gemini-3.8-flash-high 81.4 排全榜第 1（ChatGPT 75.6，第 8）；SWE-bench Verified 上 Gemini 侧提交（live-SWE-agent + Gemini 3 Pro Preview）修好 77.4%（第 4）。被标成 ChatGPT 的最高分 74.6% 来自 JoyCode + Claude 4 Sonnet + GPT-4.1，不是独立 ChatGPT 配置。',
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
    decision: [
      {
        label: '选 Gemini，如果',
        text: '你在意指令遵循与搜索类场景，并依赖 Google 生态（Workspace、Search、Android）的衔接。',
      },
      {
        label: '选 ChatGPT，如果',
        text: '你需要覆盖更广的通用任务与成熟的插件、语音、图像工具链。',
      },
      {
        label: '不要只看这一个指标',
        text: '这不是一边倒的对局：Gemini 拿下了部分第一，ChatGPT 在多数类别保持前列。两者差距的任务依赖性强，必须按你的场景实测。',
      },
    ],
    bottomLine: '这不是一边倒的对局：Gemini 拿下了指令遵循第 1 和 SWE-bench 更高的组合成绩，ChatGPT 则在推理、数据分析与代码偏好上领先。结合你已有的生态（Google 全家桶或 OpenAI 工具链）同题实测，比看总分更有意义。',
  },
  'claude-vs-gemini': {
    headline: 'Claude vs Gemini：差异集中在哪',
    snapshot: [
      {
        label: '公开快照整体格局（2026-09-29 抓取）',
        text: '这一对在 Arena 的通用对话、搜索与编程偏好，以及 LiveBench 的语言、数学、推理、数据分析、编程等类别上都有共同成绩。多数分项里 Claude 的代表配置排在更前（语言、数学、推理、编程均为第 1–2 名），Gemini 在指令遵循一项拿到第 1（81.4 对 75.8）。注意两边用的都不是同一档位的配置：Claude 侧多为 opus-5.5 max effort，Gemini 侧多为 flash 档，档次不同不能当成同代对比。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Claude 侧 79.2%（Sonar Foundation Agent + Claude 4.5 Opus，列第 1），Gemini 侧 77.4%（live-SWE-agent + Gemini 3 Pro Preview，列第 4）。两者都是「智能体框架 + 模型」的组合成绩，差距 1.8 个百分点，属于同一梯队。',
      },
    ],
    practical: [
      { label: '访问与登录', text: 'Claude 官网 claude.ai 与 Gemini 官网 gemini.google.com 都需要相应账号；Gemini 与 Google 账号体系打通，在 Workspace 与 Android 上入口更多。' },
      { label: '产品定位', text: 'Claude 的产品重心在长文写作、代码审阅与保守可靠的输出风格；Gemini 的重心在搜索、Google 生态衔接与多模态入口。你的日常入口在哪一侧，长期体验差别会放大。' },
      { label: '价格与套餐', text: '两边定价结构不同且经常调整，本页不引用具体数字。请在 Anthropic 与 Google 的官方定价页（见下方官方来源）核对当前套餐。' },
    ],
    testPack: [
      '长文精修：同一篇 2000 字稿件要求「只改逻辑不通处，保留原语气」，对比谁改动更克制',
      '指令遵循：给一条含 5 个约束的格式要求，看谁一次全中、谁漏掉其中两条',
      '多模态任务：同一个带图表的网页或截图，要求提取数据并给出结论，核对谁读图更准',
    ],
    decision: [
      { label: '选 Claude，如果', text: '你的高频任务是长文写作、代码审阅与需要保守判断的输出；公开快照里它在语言、数学、推理、编程多项领先。' },
      { label: '选 Gemini，如果', text: '你依赖 Google 生态（Workspace、Search、Android）、需要更强的指令遵循与搜索类场景。' },
      { label: '不要只看这一个指标', text: '两边的代表配置不在同一档位（max effort 对 flash），分数差不能直接读成产品差。请用上面的任务在你自己账号的对应档位上跑一遍。' },
    ],
    bottomLine: '公开分数上 Claude 覆盖面更广，但 Gemini 拿下了指令遵循第 1；真正的选型依据是你的入口生态与高频任务类型，两者组合使用也是常见做法。',
  },

  'deepseek-vs-claude': {
    headline: 'DeepSeek vs Claude：差异集中在哪',
    snapshot: [
      {
        label: '公开快照整体格局（2026-09-29 抓取）',
        text: '两边共同出现在 Arena 通用对话与编程偏好、以及 LiveBench 的语言、数学、推理、数据分析、指令遵循、编程、智能体编程等类别。Claude 在语言、数学、推理、编程、数据分析上领先；DeepSeek 在智能体编程一项拿到第 1（77.3 对 71.7）。这不是一边倒的对局，而是各有主场。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Claude 侧 79.2%（Sonar Foundation Agent + Claude 4.5 Opus，列第 1），DeepSeek 侧 70.0%（DeepSeek V3.2 (high)，列第 46）。这一项差距接近 10 个百分点，但 DeepSeek 侧使用的并非其最新代表配置，版本差异会显著影响结论。',
      },
    ],
    practical: [
      { label: '访问与登录', text: 'DeepSeek 官网 chat.deepseek.com 面向中国大陆用户可直接访问、手机号即可登录；Claude 官网需要相应地区的访问条件与账号。日常打开成本差别明显。' },
      { label: '产品定位', text: 'DeepSeek 以开放权重、API 生态与推理数学见长，偏向技术用户与自部署场景；Claude 的产品重心在长文写作、代码审阅与稳妥的输出风格。' },
      { label: '价格与套餐', text: '两边定价结构差异较大且经常调整，本页不引用具体数字。请在 DeepSeek 官网与 Anthropic 定价页（见下方官方来源）核对当前套餐与 API 价格。' },
    ],
    testPack: [
      '数学多步推理：同一道多步题要求展示中间步骤，核对哪边的步骤经得起复算',
      '代码审阅：同一条 PR diff，要求「只列出会导致线上问题的点」，对比谁的误报更少',
      '中文长文：同一份 3000 字中文材料要求压缩成 300 字摘要，检查谁更少丢关键信息',
    ],
    decision: [
      { label: '选 Claude，如果', text: '你需要长文写作、代码审阅与更稳的输出风格，且访问条件不是障碍；公开快照里它在多数类别领先。' },
      { label: '选 DeepSeek，如果', text: '你在意大陆直连、开放权重、API 成本与智能体编程场景；公开快照里它在这一项排第 1。' },
      { label: '不要只看这一个指标', text: 'SWE-bench 那一项的 10 个百分点来自特定版本与智能体组合，不能直接当作产品整体差距。请按任务实测。' },
    ],
    bottomLine: '两个工具的主场几乎不重叠：一个偏写作与审阅，一个偏推理、开放权重与大陆直连。把它们当成互补而非互斥，通常是更划算的选择。',
  },

  'deepseek-vs-gemini': {
    headline: 'DeepSeek vs Gemini：差异集中在哪',
    snapshot: [
      {
        label: '公开快照整体格局（2026-09-29 抓取）',
        text: '两边共同出现在 Arena 通用对话与编程偏好、以及 LiveBench 全部类别。Gemini 在语言（87.8 对 82.1）、推理（89.3 对 86.7）与指令遵循（81.4 对 71.0）上领先；DeepSeek 在智能体编程（77.3 对 58.3）、编程（80.0 对 78.9）、数据分析（79.5 对 78.5）与数学（95.1 对 93.5）上领先。除指令遵循外分差都不算大，属于同一梯队的不同侧重。',
      },
      {
        label: '真实代码修复（SWE-bench Verified）',
        text: 'Gemini 侧 77.4%（live-SWE-agent + Gemini 3 Pro Preview，列第 4），DeepSeek 侧 70.0%（DeepSeek V3.2 (high)，列第 46）。两者都是「智能体框架 + 模型」的组合成绩，不能读成模型单独能力。',
      },
    ],
    practical: [
      { label: '访问与登录', text: 'DeepSeek 官网 chat.deepseek.com 面向中国大陆用户可直接访问、手机号即可登录；Gemini 官网需要相应地区的访问条件与 Google 账号。' },
      { label: '产品定位', text: 'DeepSeek 以开放权重、API 与推理数学见长；Gemini 与 Google 生态（Search、Workspace、Android）深度绑定。一个偏技术集成，一个偏日常入口。' },
      { label: '价格与套餐', text: '两边定价结构差异较大且经常调整，本页不引用具体数字。请在 DeepSeek 官网与 Google 定价页（见下方官方来源）核对当前套餐与 API 价格。' },
    ],
    testPack: [
      '中文长文摘要：同一份 3000 字材料，要求先给要点清单再给 200 字摘要，核对谁漏得更少',
      '智能体编程：同一个多文件修改任务，要求先给计划再给改动，核对谁的方案能直接落地',
      '事实核查：挑 5 条你确定答案的事实，看谁更容易一本正经地编造',
    ],
    decision: [
      { label: '选 DeepSeek，如果', text: '你在意大陆直连、开放权重与 API 集成，或需要更强的编程与智能体任务表现。' },
      { label: '选 Gemini，如果', text: '你依赖 Google 生态入口、需要更强的语言、推理与指令遵循表现，或看重搜索类场景。' },
      { label: '不要只看这一个指标', text: '两边的分数差普遍在一到三个百分点内，且部分项目使用不同配置。真正的分水岭是访问条件与生态入口，不是榜单名次。' },
    ],
    bottomLine: '这是两份分值接近的答卷：Gemini 在语言与推理略优，DeepSeek 在编程与智能体任务略优。选型的第一道门槛是你能不能顺畅打开它，第二道才是任务匹配度。',
  },
};
