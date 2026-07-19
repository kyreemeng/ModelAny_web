import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { isValidSnapshot, SCENES, SOURCE_SCENE_MAP } from '../benchmarks/sources.mjs';

const root = new URL('../', import.meta.url);
const projectFile = (path) => readFile(new URL(path, root), 'utf8');

test('benchmark snapshot has a valid source-specific schema', async () => {
  const snapshot = JSON.parse(await projectFile('benchmarks/data/latest.json'));

  assert.equal(isValidSnapshot(snapshot), true);
  assert.ok(snapshot.records.length > 0);
  assert.ok(snapshot.sources.some((source) => source.status === 'fresh'));
  assert.ok(snapshot.records.every((record) => record.sourceUrl.startsWith('https://')));
  assert.ok(snapshot.records.every((record) => Number.isFinite(record.score) && record.rank > 0));
});

test('scenario mappings keep benchmark metrics separate', () => {
  assert.deepEqual(Object.keys(SCENES), ['research', 'writing', 'coding', 'learning', 'creative', 'everyday']);
  assert.deepEqual(SOURCE_SCENE_MAP.swebench.coding, ['Verified']);
  assert.deepEqual(SOURCE_SCENE_MAP.arena.everyday, ['text']);
});

test('English and Chinese benchmark pages are paired and explain limits', async () => {
  const [english, chinese, script] = await Promise.all([
    projectFile('benchmarks/index.html'),
    projectFile('zh/benchmarks/index.html'),
    projectFile('benchmarks.js'),
  ]);

  assert.match(english, /hreflang="zh-CN" href="https:\/\/modelany\.app\/zh\/benchmarks\//);
  assert.match(chinese, /hreflang="en" href="https:\/\/modelany\.app\/benchmarks\//);
  assert.match(english, /Scores from different benchmarks cannot be added together/);
  assert.match(chinese, /不同基准的分数不能相加或直接比较/);
  assert.match(english, /data-benchmark-url="\.\/data\/latest\.json"/);
  assert.match(english, /<!-- benchmark-static:start -->[\s\S]+Exact model[\s\S]+<!-- benchmark-static:end -->/);
  assert.match(chinese, /<!-- benchmark-static:start -->[\s\S]+精确模型版本[\s\S]+<!-- benchmark-static:end -->/);
  assert.match(script, /snapshot\.refreshWarnings/);
  assert.doesNotMatch(script, /root\.textContent = copy\.loading/);
  assert.doesNotMatch(script, /overallScore|combinedScore|totalScore/);
});

test('scheduled refresh preserves source provenance and runs daily', async () => {
  const [workflow, refresh] = await Promise.all([
    projectFile('.github/workflows/refresh-benchmarks.yml'),
    projectFile('benchmarks/refresh.mjs'),
  ]);

  assert.match(workflow, /cron:/);
  assert.match(workflow, /node benchmarks\/refresh\.mjs/);
  assert.match(refresh, /Keeping \$\{LATEST_PATH\}/);
  assert.match(refresh, /sourceUrl/);
  assert.match(refresh, /isValidSnapshot/);
  assert.match(refresh, /renderBenchmarkPages/);
});
