(function () {
  'use strict';

  const root = document.querySelector('[data-benchmark-root]');
  if (!root) return;

  const isZh = document.documentElement.lang === 'zh-CN';
  const copy = isZh ? {
    loading: '正在加载最新评测快照…',
    unavailable: '暂时无法加载评测数据。请稍后重试，或访问下方原始排行榜。',
    noRecords: '该场景暂未收录可展示的成绩。',
    updated: '抓取时间',
    source: '来源',
    metric: '指标',
    model: '模型版本',
    score: '成绩',
    rank: '排名',
    votes: '样本 / 投票',
    change: '更新说明',
    all: '全部场景',
    sourceLink: '查看原始排行榜',
    sceneNotes: {
      research: '研究',
      writing: '写作',
      coding: '编程',
      learning: '学习',
      creative: '创意',
      everyday: '生活',
    },
  } : {
    loading: 'Loading the latest benchmark snapshot…',
    unavailable: 'Benchmark data is temporarily unavailable. Try again later or use the source links below.',
    noRecords: 'No displayable results are available for this scenario yet.',
    updated: 'Retrieved',
    source: 'Source',
    metric: 'Metric',
    model: 'Exact model',
    score: 'Score',
    rank: 'Rank',
    votes: 'Samples / votes',
    change: 'Refresh note',
    all: 'All scenarios',
    sourceLink: 'Open original leaderboard',
    sceneNotes: {
      research: 'Research',
      writing: 'Writing',
      coding: 'Coding',
      learning: 'Learning',
      creative: 'Creative',
      everyday: 'Everyday life',
    },
  };

  const sceneMap = {
    research: { livebench: ['Reasoning', 'Data Analysis'], arena: ['search', 'text'] },
    writing: { livebench: ['Language'], arena: ['creative-writing', 'text'] },
    coding: { livebench: ['Coding', 'Agentic Coding'], swebench: ['Verified'] },
    learning: { livebench: ['Instruction Following', 'Reasoning', 'Mathematics'] },
    creative: { livebench: ['Language'], arena: ['creative-writing'] },
    everyday: { arena: ['occupational', 'text'] },
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  function recordsForScene(records, scene) {
    if (scene === 'all') return records;
    const sources = sceneMap[scene] || {};
    return records.filter((record) => sources[record.source]?.includes(record.category));
  }

  function createElement(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render(snapshot, scene) {
    const records = recordsForScene(snapshot.records, scene)
      .sort((a, b) => a.source.localeCompare(b.source) || a.category.localeCompare(b.category) || a.rank - b.rank)
      .slice(0, 40);
    root.replaceChildren();

    const context = createElement('div', 'benchmark-context');
    context.append(createElement('p', 'benchmark-updated', `${copy.updated}: ${formatDate(snapshot.retrievedAt)}`));
    root.append(context);

    if (!records.length) {
      root.append(createElement('p', 'benchmark-empty', copy.noRecords));
      return;
    }

    const groups = new Map();
    records.forEach((record) => {
      const key = `${record.source}:${record.category}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    });

    groups.forEach((group, key) => {
      const [sourceId, category] = key.split(':');
      const source = snapshot.sources.find((item) => item.id === sourceId);
      const section = createElement('section', 'benchmark-source');
      const header = createElement('div', 'benchmark-source-header');
      const title = createElement('h2', null, `${source?.name || sourceId} · ${category}`);
      header.append(title);
      const sourceLink = document.createElement('a');
      sourceLink.href = source?.sourceUrl || group[0].sourceUrl;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = copy.sourceLink;
      header.append(sourceLink);
      section.append(header);
      section.append(createElement('p', 'benchmark-disclaimer', source?.disclaimer?.[isZh ? 'zh' : 'en'] || ''));

      const tableWrap = createElement('div', 'benchmark-table-wrap');
      const table = createElement('table', 'benchmark-table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      [copy.rank, copy.model, copy.score, copy.metric, copy.votes].forEach((label) => headerRow.append(createElement('th', null, label)));
      thead.append(headerRow);
      table.append(thead);
      const tbody = document.createElement('tbody');
      group.slice(0, 10).forEach((record) => {
        const row = document.createElement('tr');
        [record.rank, record.modelExactName, `${record.score}${record.unit === '%' ? '%' : ''}`, `${record.metric} (${record.unit})`, record.sampleSize || '-']
          .forEach((value) => row.append(createElement('td', null, String(value))));
        tbody.append(row);
      });
      table.append(tbody);
      tableWrap.append(table);
      section.append(tableWrap);
      root.append(section);
    });

    if (snapshot.refreshWarnings?.length) {
      const warning = createElement('p', 'benchmark-warning', `${copy.change}: ${snapshot.refreshWarnings.join(' | ')}`);
      root.append(warning);
    }
  }

  async function init() {
    root.textContent = copy.loading;
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
      root.textContent = copy.unavailable;
      root.classList.add('benchmark-error');
    }
  }

  init();
}());
