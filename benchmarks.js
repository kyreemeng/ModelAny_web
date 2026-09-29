(function () {
  'use strict';

  const root = document.querySelector('[data-benchmark-root]');
  if (!root) return;

  const isZh = document.documentElement.lang === 'zh-CN';
  const copy = isZh ? {
    unavailable: '暂时无法加载评测数据。请稍后重试，或访问下方原始排行榜。',
    noRecords: '该场景暂未收录可展示的成绩。',
    updated: '抓取时间',
    source: '来源',
    sourceLink: '查看原始排行榜',
    votes: '票',
    leadersTitle: '每项测试的领先者',
    leadersNote: '金色行是该官方测试类别的第一名。这不是全面总排名：不同基准的分数不能相加或直接比较。',
    legend: '排名 · 模型家族 · 精确模型版本 · 成绩',
    families: '个模型家族参与对比',
    detailTitle: '按来源查看完整名次',
    detailNote: '每个条形代表该测试中一个模型家族的最好成绩配置，避免同一厂商的多个代理配置挤占榜单。完整名单请展开原始排行榜。',
    sourcesUnit: '个官方来源',
    recordsUnit: '条记录',
    warningLabel: '抓取提示',
    emptySourceData: '该来源暂无可展示的成绩。',
  } : {
    unavailable: 'Benchmark data is temporarily unavailable. Try again later or use the source links below.',
    noRecords: 'No displayable results are available for this scenario yet.',
    updated: 'Retrieved',
    source: 'Source',
    sourceLink: 'Open original leaderboard',
    votes: 'votes',
    leadersTitle: 'Who leads each test',
    leadersNote: 'The gold row is the top scorer of that official test category. It is not an overall ranking: scores from different benchmarks cannot be combined.',
    legend: 'Rank · Model family · Exact model version · Score',
    families: 'model families compared',
    detailTitle: 'Full standings by source',
    detailNote: 'Each bar is the best-scoring configuration per model family in that test, so one vendor with many agent setups does not crowd out the others. Expand the original leaderboard for every row.',
    sourcesUnit: 'official sources',
    recordsUnit: 'records',
    warningLabel: 'Refresh notes',
    emptySourceData: 'No displayable results for this source yet.',
  };

  const sceneMap = {
    research: { livebench: ['Reasoning', 'Data Analysis'], arena: ['search', 'text'] },
    writing: { livebench: ['Language'], arena: ['text'] },
    coding: { livebench: ['Coding', 'Agentic Coding'], swebench: ['Verified'], arena: ['code'] },
    learning: { livebench: ['Instruction Following', 'Reasoning', 'Mathematics'] },
    creative: { livebench: ['Language'], arena: ['text'] },
    everyday: { arena: ['text'] },
  };

  const CATEGORY_ORDER = {
    arena: ['text', 'code', 'search'],
    livebench: ['Agentic Coding', 'Coding', 'Mathematics', 'Reasoning', 'Data Analysis', 'Instruction Following', 'Language'],
    swebench: ['Verified'],
  };

  const CATEGORY_LABEL = {
    arena: {
      text: { en: 'General chat preference', zh: '通用对话偏好' },
      code: { en: 'Coding preference', zh: '编程偏好' },
      search: { en: 'Search-style preference', zh: '搜索类偏好' },
    },
    livebench: {
      'Agentic Coding': { en: 'Agentic coding', zh: '智能体编程' },
      Coding: { en: 'Coding tasks', zh: '编程任务' },
      Mathematics: { en: 'Mathematics', zh: '数学' },
      Reasoning: { en: 'Reasoning', zh: '推理' },
      'Data Analysis': { en: 'Data analysis', zh: '数据分析' },
      'Instruction Following': { en: 'Instruction following', zh: '指令遵循' },
      Language: { en: 'Language tasks', zh: '语言任务' },
    },
    swebench: {
      Verified: { en: 'Real software-issue fixing', zh: '真实软件问题修复' },
    },
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  const fmtScore = (record) => {
    if (record.unit === '%') return `${record.score.toFixed(1)}%`;
    if (record.unit === 'Elo') return String(Math.round(record.score));
    return record.score.toFixed(1);
  };

  function groupInScene(sourceId, category, scene) {
    if (scene === 'all') return true;
    const allowed = sceneMap[scene]?.[sourceId];
    return Array.isArray(allowed) && allowed.includes(category);
  }

  function bestPerProduct(group) {
    const byProduct = new Map();
    for (const record of group) {
      const family = record.product || record.modelExactName;
      const previous = byProduct.get(family);
      if (!previous || record.score > previous.score || (record.score === previous.score && record.rank < previous.rank)) {
        byProduct.set(family, record);
      }
    }
    return [...byProduct.entries()]
      .map(([family, record]) => ({ family, record }))
      .sort((a, b) => b.record.score - a.record.score || a.record.rank - b.record.rank);
  }

  function buildGroups(snapshot, scene) {
    const groups = new Map();
    for (const record of snapshot.records) {
      const key = `${record.source}:${record.category}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    }
    const out = [];
    for (const sourceId of Object.keys(CATEGORY_ORDER)) {
      for (const category of CATEGORY_ORDER[sourceId] || []) {
        const group = groups.get(`${sourceId}:${category}`);
        if (group?.length && groupInScene(sourceId, category, scene)) {
          out.push({ sourceId, category, group, products: bestPerProduct(group) });
        }
      }
    }
    return out;
  }

  function createElement(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function appendHtml(parent, html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    parent.append(template.content);
  }

  function barList(products) {
    const max = products[0]?.record.score || 1;
    const items = products.slice(0, 8).map(({ family, record }, index) => {
      const rank = index + 1;
      const width = Math.max(4, Math.round((record.score / max) * 100));
      const row = createElement('li', `bm-row${rank === 1 ? ' is-leader' : ''}`);
      appendHtml(row, `<div class="bm-row-head">
            <span class="bm-rank${rank <= 3 ? ` is-${rank}` : ''}">${rank}</span>
            <span class="bm-who"></span>
            <span class="bm-val"></span>
          </div>
          <div class="bm-bar" aria-hidden="true"><i style="width:${width}%"></i></div>`);
      const who = row.querySelector('.bm-who');
      who.append(createElement('strong', null, family));
      if (record.modelExactName && record.modelExactName !== family) {
        who.append(createElement('em', null, record.modelExactName));
      }
      const value = row.querySelector('.bm-val');
      value.append(document.createTextNode(fmtScore(record)));
      if (record.sampleSize) {
        const votes = createElement('span', 'bm-votes', `${Number(record.sampleSize).toLocaleString('en-US')} ${copy.votes}`);
        value.append(votes);
      }
      return row;
    });
    const list = createElement('ol', 'bm-bars');
    items.forEach((item) => list.append(item));
    return list;
  }

  function render(snapshot, scene) {
    root.replaceChildren();

    const strip = createElement('div', 'bm-strip');
    const freshSources = snapshot.sources.filter((item) => item.status === 'fresh').length;
    strip.append(createElement('p', 'benchmark-updated', `${copy.updated}: ${formatDate(snapshot.retrievedAt)} · ${freshSources} ${copy.sourcesUnit} · ${snapshot.records.length} ${copy.recordsUnit}`));
    strip.append(createElement('p', 'bm-strip-note', copy.leadersNote));
    root.append(strip);

    const groups = buildGroups(snapshot, scene);
    if (!groups.length) {
      root.append(createElement('p', 'benchmark-empty', copy.noRecords));
      return;
    }

    const leaders = createElement('section', 'bm-leaders');
    const leadersTitle = createElement('h2', null, copy.leadersTitle);
    leaders.append(leadersTitle);
    leaders.append(createElement('p', 'bm-legend', copy.legend));
    const grid = createElement('div', 'bm-grid');
    groups.forEach(({ sourceId, category, products }) => {
      const source = snapshot.sources.find((item) => item.id === sourceId);
      const card = createElement('article', 'bm-card');
      appendHtml(card, `<header class="bm-card-head"><h3></h3><span class="bm-chip">${source?.metric ? `${source.metric} · ` : ''}${products[0].record.unit}</span></header>
          <ol class="bm-top3"></ol>`);
      card.querySelector('h3').append(
        createElement('span', null, source?.name || sourceId),
        createElement('span', 'bm-card-cat', CATEGORY_LABEL[sourceId]?.[category]?.[isZh ? 'zh' : 'en'] || category),
      );
      const top3 = products.slice(0, 3);
      const max = top3[0]?.record.score || 1;
      const list = card.querySelector('.bm-top3');
      top3.forEach(({ family, record }, index) => {
        const item = createElement('li', `is-${index + 1}`);
        appendHtml(item, `<span class="bm-rank is-${index + 1}">${index + 1}</span>
            <span class="bm-who"></span>
            <span class="bm-val"></span>
            <span class="bm-minibar" aria-hidden="true"><i style="width:${Math.max(6, Math.round((record.score / max) * 100))}%"></i></span>`);
        const who = item.querySelector('.bm-who');
        who.append(createElement('strong', null, family));
        if (record.modelExactName && record.modelExactName !== family) {
          who.append(createElement('em', null, record.modelExactName));
        }
        item.querySelector('.bm-val').textContent = fmtScore(record);
        list.append(item);
      });
      grid.append(card);
    });
    leaders.append(grid);
    root.append(leaders);

    const details = createElement('section', 'bm-details');
    details.append(createElement('h2', null, copy.detailTitle));
    details.append(createElement('p', 'bm-strip-note', copy.detailNote));
    const sourceIds = [...new Set(groups.map(({ sourceId }) => sourceId))];
    sourceIds.forEach((sourceId) => {
      const source = snapshot.sources.find((item) => item.id === sourceId);
      const sourceGroups = groups.filter(({ sourceId: id }) => id === sourceId);
      const families = new Set(sourceGroups.flatMap(({ group }) => group.map((record) => record.product || record.modelExactName))).size;
      const section = createElement('section', 'bm-source');
      section.id = sourceId;
      const header = createElement('header', 'bm-source-head');
      const headLeft = createElement('div');
      headLeft.append(createElement('h2', null, source?.name || sourceId));
      headLeft.append(createElement('p', 'bm-source-meta', `${families} ${copy.families} · ${formatDate(snapshot.retrievedAt)}`));
      header.append(headLeft);
      const sourceLink = document.createElement('a');
      sourceLink.href = source?.sourceUrl || sourceGroups[0].group[0].sourceUrl;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = copy.sourceLink;
      header.append(sourceLink);
      section.append(header);
      section.append(createElement('p', 'bm-disclaimer', source?.disclaimer?.[isZh ? 'zh' : 'en'] || ''));
      sourceGroups.forEach(({ category, products }) => {
        const block = createElement('article', 'bm-block');
        block.append(createElement('h3', null, CATEGORY_LABEL[sourceId]?.[category]?.[isZh ? 'zh' : 'en'] || category));
        block.append(barList(products));
        section.append(block);
      });
      details.append(section);
    });
    root.append(details);

    if (snapshot.refreshWarnings?.length) {
      root.append(createElement('p', 'benchmark-warning', `${copy.warningLabel}: ${snapshot.refreshWarnings.join(' | ')}`));
    }
  }

  async function init() {
    root.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(root.dataset.benchmarkUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error(String(response.status));
      const snapshot = await response.json();
      const select = document.querySelector('[data-benchmark-scene]');
      const initialScene = window.location.hash.slice(1);
      if (select && Object.prototype.hasOwnProperty.call(sceneMap, initialScene)) select.value = initialScene;
      const update = () => {
        const scene = select?.value || 'all';
        if (scene !== 'all') history.replaceState(null, '', `#${scene}`);
        render(snapshot, scene);
      };
      select?.addEventListener('change', update);
      update();
    } catch {
      const status = createElement('p', 'benchmark-warning', copy.unavailable);
      root.append(status);
      root.classList.add('benchmark-error');
    } finally {
      root.removeAttribute('aria-busy');
    }
  }

  init();
}());
