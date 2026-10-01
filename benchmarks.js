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
    leadersNote: '金色面板是该官方测试类别的第一名，亚军与季军旁标注了与第一名的差距。这不是全面总排名：不同基准的分数不能相加或直接比较。',
    legend: '排名 · 模型家族 · 精确模型版本 · 成绩',
    gapToTop: '与第一名的差距',
    matrixTitle: '全部测试的领奖台地图',
    matrixNote: '每一行是一个模型家族，按第一名数量排序。单元格显示该家族在对应测试中的名次，仅标注前三名，且每列保留各自基准的独立分数。',
    matrixFamilyCol: '模型家族',
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
    leadersNote: 'The gold panel marks the top scorer of that official test category, with the gap to the runner-ups shown beside each score. It is not an overall ranking: scores from different benchmarks cannot be combined.',
    legend: 'Rank · Model family · Exact model version · Score',
    gapToTop: 'gap to first place',
    matrixTitle: 'The podium map across all tests',
    matrixNote: 'Each row is a model family, sorted by most first places. A cell shows where that family lands in the test column — only top-3 finishes are marked, and every column keeps its own benchmark’s score.',
    matrixFamilyCol: 'Model family',
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

  const MATRIX_SHORT = {
    arena: {
      text: { en: 'Chat', zh: '对话' },
      code: { en: 'Code pref', zh: '代码偏好' },
      search: { en: 'Search', zh: '搜索' },
    },
    livebench: {
      'Agentic Coding': { en: 'Agentic', zh: '智能体' },
      Coding: { en: 'Coding', zh: '编程' },
      Mathematics: { en: 'Math', zh: '数学' },
      Reasoning: { en: 'Reasoning', zh: '推理' },
      'Data Analysis': { en: 'Data', zh: '数据' },
      'Instruction Following': { en: 'Instruct', zh: '指令' },
      Language: { en: 'Language', zh: '语言' },
    },
    swebench: {
      Verified: { en: 'SWE-bench', zh: 'SWE' },
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

  const fmtDelta = (leaderScore, record) => {
    const gap = leaderScore - record.score;
    if (!(gap > 0)) return '';
    const value = record.unit === 'Elo' ? String(Math.round(gap)) : gap.toFixed(1);
    return `−${value}`;
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

  function buildWho(container, family, record) {
    const who = createElement('span', 'bm-who');
    who.append(createElement('strong', null, family));
    if (record.modelExactName && record.modelExactName !== family) {
      who.append(createElement('em', null, record.modelExactName));
    }
    container.append(who);
  }

  function leaderCard({ sourceId, category, products }, source, labels) {
    const lang = isZh ? 'zh' : 'en';
    const label = CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category;
    const [first, ...rest] = products;
    const leaderScore = first.record.score;

    const card = createElement('article', 'bm-card');
    appendHtml(card, `<header class="bm-card-head">
          <p class="bm-card-src"></p>
          <h3></h3>
          <span class="bm-chip"></span>
        </header>`);
    card.querySelector('.bm-card-src').textContent = source?.name || sourceId;
    card.querySelector('h3').textContent = label;
    card.querySelector('.bm-chip').textContent = first.record.unit;

    appendHtml(card, `<div class="bm-champ">
          <span class="bm-medal is-1" aria-label="rank 1">1</span>
        </div>
        <ol class="bm-runners"></ol>`);
    const champ = card.querySelector('.bm-champ');
    buildWho(champ, first.family, first.record);
    champ.append(createElement('span', 'bm-champ-score', fmtScore(first.record)));

    const runners = card.querySelector('.bm-runners');
    rest.slice(0, 2).forEach(({ family, record }, index) => {
      const rank = index + 2;
      const row = createElement('li', 'bm-runner');
      row.append(createElement('span', `bm-medal is-${rank}`, String(rank)));
      row.lastElementChild.setAttribute('aria-label', `rank ${rank}`);
      buildWho(row, family, record);
      const delta = fmtDelta(leaderScore, record);
      const deltaChip = createElement('span', 'bm-delta', delta || '');
      deltaChip.title = copy.gapToTop;
      if (!delta) deltaChip.setAttribute('aria-hidden', 'true');
      row.append(deltaChip);
      row.append(createElement('span', 'bm-val', fmtScore(record)));
      runners.append(row);
    });
    return card;
  }

  function matrixSection(groups, snapshot, labels) {
    const lang = isZh ? 'zh' : 'en';
    const findSource = (sourceId) => snapshot.sources.find((item) => item.id === sourceId);
    const tests = groups.map(({ sourceId, category, products }) => {
      const source = findSource(sourceId);
      const fullLabel = `${source?.name || sourceId} · ${CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category}`;
      return {
        short: MATRIX_SHORT[sourceId]?.[category]?.[lang] || category,
        full: fullLabel,
        top3: new Map(products.slice(0, 3).map(({ family }, index) => [family, index + 1])),
      };
    });

    const tally = new Map();
    for (const test of tests) {
      for (const [family, rank] of test.top3) {
        if (!tally.has(family)) tally.set(family, [0, 0, 0]);
        tally.get(family)[rank - 1] += 1;
      }
    }
    const rows = [...tally.entries()].sort((a, b) =>
      b[1][0] - a[1][0] || b[1][1] - a[1][1] || b[1][2] - a[1][2] || a[0].localeCompare(b[0]));

    const section = createElement('section', 'bm-matrix-sec');
    section.setAttribute('aria-labelledby', 'bm-matrix-title');
    section.append(createElement('h2', null, copy.matrixTitle));
    section.append(createElement('p', 'bm-strip-note', copy.matrixNote));

    const wrap = createElement('div', 'bm-matrix-wrap');
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', copy.matrixTitle);
    wrap.tabIndex = 0;

    const table = createElement('table', 'bm-matrix');
    const thead = createElement('thead');
    const headRow = createElement('tr');
    headRow.append(createElement('th', null, copy.matrixFamilyCol));
    tests.forEach(({ short, full }) => {
      const th = createElement('th', null, short);
      th.scope = 'col';
      th.title = full;
      headRow.append(th);
    });
    thead.append(headRow);
    table.append(thead);

    const tbody = createElement('tbody');
    rows.forEach(([family, counts]) => {
      const tr = createElement('tr');
      const th = createElement('th', 'bm-mx-family');
      th.scope = 'row';
      th.append(createElement('strong', null, family));
      const tallyBits = [['g', counts[0]], ['s', counts[1]], ['b', counts[2]]]
        .filter(([, count]) => count > 0)
        .map(([cls, count]) => `<i class="${cls}"></i>${count}`)
        .join(' ');
      appendHtml(th, `<span class="bm-tally">${tallyBits}</span>`);
      tr.append(th);
      tests.forEach(({ top3 }) => {
        const rank = top3.get(family);
        const td = createElement('td', rank ? `bm-mx-cell is-${rank}` : 'bm-mx-empty');
        td.setAttribute('aria-label', rank ? `rank ${rank}` : 'not on podium');
        appendHtml(td, `<span>${rank || '·'}</span>`);
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);
    wrap.append(table);
    section.append(wrap);
    return section;
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
      const head = row.querySelector('.bm-row-head');
      head.querySelector('.bm-rank').setAttribute('aria-label', `rank ${rank}`);
      buildWho(head, family, record);
      const value = head.querySelector('.bm-val');
      value.append(document.createTextNode(fmtScore(record)));
      const delta = fmtDelta(max, record);
      if (delta) value.append(createElement('span', 'bm-delta', delta));
      if (record.sampleSize) {
        value.append(createElement('span', 'bm-votes', `${Number(record.sampleSize).toLocaleString('en-US')} ${copy.votes}`));
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

    const labels = { gapToTop: copy.gapToTop };
    const findSource = (sourceId) => snapshot.sources.find((item) => item.id === sourceId);

    const leaders = createElement('section', 'bm-leaders');
    leaders.setAttribute('aria-labelledby', 'bm-leaders-title');
    const leadersTitle = createElement('h2', null, copy.leadersTitle);
    leadersTitle.id = 'bm-leaders-title';
    leaders.append(leadersTitle);
    leaders.append(createElement('p', 'bm-legend', copy.legend));
    const grid = createElement('div', 'bm-grid');
    groups.forEach((group) => grid.append(leaderCard(group, findSource(group.sourceId), labels)));
    leaders.append(grid);
    root.append(leaders);

    root.append(matrixSection(groups, snapshot, copy));

    const details = createElement('section', 'bm-details');
    details.setAttribute('aria-labelledby', 'bm-details-title');
    const detailsTitle = createElement('h2', null, copy.detailTitle);
    detailsTitle.id = 'bm-details-title';
    details.append(detailsTitle);
    details.append(createElement('p', 'bm-strip-note', copy.detailNote));
    const sourceIds = [...new Set(groups.map(({ sourceId }) => sourceId))];
    sourceIds.forEach((sourceId) => {
      const source = findSource(sourceId);
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
      const body = createElement('div', 'bm-source-body');
      sourceGroups.forEach(({ category, products }) => {
        const block = createElement('article', 'bm-block');
        block.append(createElement('h3', null, CATEGORY_LABEL[sourceId]?.[category]?.[isZh ? 'zh' : 'en'] || category));
        block.append(barList(products));
        body.append(block);
      });
      section.append(body);
      details.append(section);
    });
    root.append(details);

    if (snapshot.refreshWarnings?.length) {
      root.append(createElement('p', 'benchmark-warning', `${copy.warningLabel}: ${snapshot.refreshWarnings.join(' | ')}`));
    }
  }

  function setActiveTab(scene) {
    document.querySelectorAll('[data-benchmark-scene] [data-scene]').forEach((tab) => {
      const active = tab.dataset.scene === scene;
      tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      tab.classList.toggle('is-active', active);
    });
  }

  async function init() {
    root.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(root.dataset.benchmarkUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error(String(response.status));
      const snapshot = await response.json();
      const tabs = document.querySelectorAll('[data-benchmark-scene] [data-scene]');
      const initialScene = window.location.hash.slice(1);
      const update = (scene) => {
        try {
          if (scene !== 'all') history.replaceState(null, '', `#${scene}`);
          else history.replaceState(null, '', window.location.pathname);
        } catch { /* file:// or sandboxed documents reject history edits */ }
        setActiveTab(scene);
        render(snapshot, scene);
      };
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => update(tab.dataset.scene));
      });
      update(Object.prototype.hasOwnProperty.call(sceneMap, initialScene) ? initialScene : 'all');
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
