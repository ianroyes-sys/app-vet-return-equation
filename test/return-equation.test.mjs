import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { score, activeAudience, rate, band, cost, batch, parseCsv, fromRecord, formatScorecard } from '../src/return-equation.mjs';
import { VERTICALS } from '../src/verticals.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('worked reference: 300-member church scores 6.0x, Qualified', () => {
  // benchmarks.md: 300 → 45% install → 50% retained → A = 68; F = 4; V = $4.41; C = $200; R = 6.0×
  const s = score({ reachable: 300, install: 0.45, retention: 0.5, F: 4, V: 4.41, C: 200, loops: ['calendar', 'drop', 'access'] });
  assert.equal(s.A, 68);
  assert.equal(s.R, 6.0);
  assert.equal(s.verdict, 'Qualified');
  assert.equal(s.price, '$150–350/mo');
});

test('worked reference: quote-only insurance broker scores 0.9x, Brochure', () => {
  // 400 → 20% install → 8% retained → A = 6; F = 0.2; V = $150; R = 0.9×
  const s = score({ reachable: 400, install: '20%', retention: '8%', F: 0.2, V: 150 });
  assert.equal(s.A, 6);
  assert.equal(s.R, 0.9);
  assert.equal(s.verdict, 'Brochure');
});

test('band boundaries match SKILL.md: >=10, 3-10, 1-3, <1', () => {
  assert.equal(band(10).verdict, 'Flagship');
  assert.equal(band(9.9).verdict, 'Qualified');
  assert.equal(band(3).verdict, 'Qualified');
  assert.equal(band(2.9).verdict, 'Retrofit');
  assert.equal(band(1).verdict, 'Retrofit');
  assert.equal(band(0.9).verdict, 'Brochure');
  assert.equal(band(0).verdict, 'Brochure');
});

test('cost defaults to and is floored at $200', () => {
  assert.deepEqual(cost(), { value: 200, floored: false });
  assert.deepEqual(cost(150), { value: 200, floored: true });
  assert.deepEqual(cost(350), { value: 350, floored: false });
  // Billing $150 is still modeled at $200, so R does not inflate by a third.
  assert.equal(score({ A: 100, F: 2, V: 3, C: 150 }).R, 3.0);
});

test('zero offline loops is a Brochure whatever the arithmetic says', () => {
  const s = score({ A: 1000, F: 10, V: 5, loops: [] });
  assert.equal(s.R, 250);
  assert.equal(s.verdict, 'Brochure');
  assert.equal(s.nextBand, null);
});

test('rates accept fractions, percents and "%" strings', () => {
  assert.equal(rate('x', 0.45), 0.45);
  assert.equal(rate('x', 45), 0.45);
  assert.equal(rate('x', '45%'), 0.45);
  assert.equal(rate('x', '1%'), 0.01);
  assert.equal(activeAudience({ reachable: 220, install: '80%', retention: 55 }), 97);
});

test('bad input is refused, not guessed', () => {
  assert.throws(() => score({ A: 10, F: -1, V: 1 }), /F must be/);
  assert.throws(() => score({ A: 10, F: 1, V: 'lots' }), /V must be/);
  assert.throws(() => score({ reachable: 10, install: 120, retention: 0.5, F: 1, V: 1 }), /install must be/);
  assert.throws(() => score({ A: 10, F: 1, V: 1, loops: ['vibes'] }), /unknown loop/);
});

test('next band: the factor any one term needs', () => {
  const s = score({ A: 100, F: 2, V: 2.5 }); // R = 2.5, Retrofit
  assert.equal(s.verdict, 'Retrofit');
  assert.deepEqual(s.nextBand, { verdict: 'Qualified', at: 3, factor: 1.2 });
  assert.equal(score({ A: 500, F: 10, V: 1 }).nextBand, null); // already Flagship (R = 25)
});

test('batch: sorted by R and grouped by verdict', () => {
  const rows = parseCsv(`name,loops,A,F,V,C\nA,calendar,500,10,1,\nB,none,500,10,1,\nC,reorder,100,2,2.5,\nD,status,100,4,2,`).map(fromRecord);
  const groups = batch(rows);
  assert.deepEqual(groups.map((g) => g.verdict), ['Flagship', 'Qualified', 'Retrofit', 'Brochure']);
  assert.deepEqual(groups.map((g) => g.rows.map((r) => r.name)), [['A'], ['D'], ['C'], ['B']]);
});

test('CSV parser handles quotes and comment lines', () => {
  const rows = parseCsv('# note\nname,F\n"Smith, Jones & Co",2\n');
  assert.deepEqual(rows, [{ name: 'Smith, Jones & Co', F: '2' }]);
});

test('scorecard shows the arithmetic', () => {
  const card = formatScorecard('Test', score({ A: 68, F: 4, V: 4.41, loops: ['calendar'] }));
  assert.match(card, /R = \(A · F · V\) \/ C = \(68 · 4 · 4\.41\) \/ 200 = 6.0×/);
  assert.match(card, /VERDICT\s+Qualified/);
});

test('vertical table: each modeled R sits in the band benchmarks.md lists it under', () => {
  const expect = (name) => VERTICALS.find((v) => v.business.startsWith(name));
  assert.equal(band(expect('Gym').R).verdict, 'Flagship');
  assert.equal(band(expect('Self-storage').R).verdict, 'Qualified');
  assert.equal(band(expect('Restaurant, single').R).verdict, 'Retrofit');
  assert.equal(band(expect('Funeral home').R).verdict, 'Brochure');
  assert.equal(VERTICALS.length, 26);
});

test('CLI: score and batch run end to end', () => {
  const cli = path.join(ROOT, 'bin/app-vet.mjs');
  const one = execFileSync(process.execPath, [cli, 'score', '--name', 'Church', '--reachable', '300', '--install', '45%', '--retention', '50%', '--F', '4', '--V', '4.41'], { encoding: 'utf8' });
  assert.match(one, /= 6.0×/);
  const many = JSON.parse(execFileSync(process.execPath, [cli, 'batch', path.join(ROOT, 'examples/prospects.sample.csv'), '--json'], { encoding: 'utf8' }));
  const all = many.flatMap((g) => g.rows);
  assert.equal(all.length, 6);
  const rs = all.map((r) => r.R);
  assert.deepEqual(rs, [...rs].sort((a, b) => b - a));
});
