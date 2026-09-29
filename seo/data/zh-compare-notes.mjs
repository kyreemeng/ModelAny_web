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
};
