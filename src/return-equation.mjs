// The Return Equation, exactly as skill/app-vet/SKILL.md defines it:
//
//   R = (A · F · V) / C
//
//   A  active audience   = reachable base × install rate × 90-day retention
//   F  frequency         = genuine reasons to open, per person, per month
//   V  value per open    = gross margin captured per open, in dollars
//   C  cost              = monthly retainer + client's own time, floored at $200
//
// Verdict bands: R ≥ 10 Flagship · 3–10 Qualified · 1–3 Retrofit · < 1 Brochure.
// A business that runs no loop offline is a Brochure whatever the arithmetic says.

export const COST_FLOOR = 200;

export const LOOPS = ['calendar', 'reorder', 'progress', 'access', 'drop', 'status'];

export const BANDS = [
  { verdict: 'Flagship', min: 10, price: '$400–800/mo', action: 'Build.' },
  { verdict: 'Qualified', min: 3, price: '$150–350/mo', action: 'Build. Standard retainer.' },
  { verdict: 'Retrofit', min: 1, price: null, action: 'Do not sell the app they asked for. Sell the missing loop first, then re-score.' },
  { verdict: 'Brochure', min: -Infinity, price: null, action: 'Decline the app. Sell a website. Say why out loud.' },
];

const round1 = (x) => Math.round(x * 10) / 10;

function num(name, v, { min = 0, max = Infinity } = {}) {
  const n = typeof v === 'string' ? Number(v.replace(/[$,%\s]/g, '')) : v;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < min || n > max) {
    throw new RangeError(`${name} must be a number between ${min} and ${max}, got ${JSON.stringify(v)}`);
  }
  return n;
}

// Rates may be given as fractions (0.45) or percentages (45 or "45%").
export function rate(name, v) {
  const pct = typeof v === 'string' && v.trim().endsWith('%');
  let n = num(name, v, { min: 0, max: 100 });
  if (pct || n > 1) n /= 100;
  return n;
}

// A = reachable × install × retention, rounded to a whole person (as in the worked references).
export function activeAudience({ reachable, install, retention }) {
  return Math.round(num('reachable', reachable) * rate('install', install) * rate('retention', retention));
}

// C is the retainer plus the client's time, never below the $200 floor.
export function cost(c = COST_FLOOR) {
  const raw = num('cost', c);
  return { value: Math.max(raw, COST_FLOOR), floored: raw < COST_FLOOR };
}

export function band(r) {
  return BANDS.find((b) => r >= b.min);
}

/**
 * Score one prospect.
 * @param {object} p
 * @param {number} [p.A]          active audience, if already known
 * @param {number} [p.reachable]  reachable base (used with install + retention when A is not given)
 * @param {number|string} [p.install]    install rate, 0–1 or %
 * @param {number|string} [p.retention]  90-day retention, 0–1 or %
 * @param {number} p.F            opens per person per month
 * @param {number} p.V            dollars of margin per open
 * @param {number} [p.C]          monthly cost; floored at $200
 * @param {string[]} [p.loops]    loops the business already runs offline; [] forces Brochure
 */
export function score(p) {
  const A = p.A != null ? Math.round(num('A', p.A)) : activeAudience(p);
  const F = num('F', p.F);
  const V = num('V', p.V);
  const c = cost(p.C ?? COST_FLOOR);
  const loops = p.loops == null ? null : p.loops.map((l) => String(l).trim().toLowerCase()).filter(Boolean);
  if (loops) {
    const bad = loops.filter((l) => !LOOPS.includes(l));
    if (bad.length) throw new RangeError(`unknown loop(s): ${bad.join(', ')} (use ${LOOPS.join(', ')})`);
  }
  const raw = (A * F * V) / c.value;
  const R = round1(raw);
  const noLoops = Array.isArray(loops) && loops.length === 0;
  const b = noLoops ? BANDS[3] : band(R);
  const i = BANDS.indexOf(b);
  // Every term is a plain multiplier, so the move to the next band is the same factor on any one of A, F or V.
  const up = i > 0 && !noLoops ? { verdict: BANDS[i - 1].verdict, at: BANDS[i - 1].min, factor: raw > 0 ? Math.round((BANDS[i - 1].min / raw) * 100) / 100 : null } : null;
  return { A, F, V, C: c.value, costFloored: c.floored, loops, R, verdict: b.verdict, price: b.price, action: b.action, noLoops, nextBand: up };
}

export function formatScorecard(name, s) {
  const pad = (k) => k.padEnd(10);
  const lines = [
    `PROSPECT — ${name}`,
    '',
    `${pad('LOOPS')} ${s.loops == null ? '(not given)' : s.loops.length ? s.loops.join(' + ') : 'none'}`,
    `${pad('A')} ${s.A}`,
    `${pad('F')} ${s.F}/mo`,
    `${pad('V')} $${s.V}`,
    `${pad('C')} $${s.C}/mo${s.costFloored ? '    (raised to the $200 floor)' : ''}`,
    '',
    `R = (A · F · V) / C = (${s.A} · ${s.F} · ${s.V}) / ${s.C} = ${s.R.toFixed(1)}×`,
    '',
    `${pad('VERDICT')} ${s.verdict}${s.noLoops ? '    (no offline loop: an app would be a brochure)' : ''}`,
    `${pad('PRICE')} ${s.price ?? (s.verdict === 'Retrofit' ? 'sell the loop first' : 'website, not an app')}`,
    `${pad('ACTION')} ${s.action}`,
  ];
  if (s.nextBand && s.nextBand.factor) lines.push(`${pad('NEXT BAND')} ${s.nextBand.verdict} at ${s.nextBand.at}×: needs ×${s.nextBand.factor} on A, F or V`);
  return lines.join('\n');
}

// Batch mode: sorted by R descending, grouped under band headers.
export function batch(rows) {
  const scored = rows.map((r) => ({ name: r.name, ...score(r) })).sort((a, b) => b.R - a.R);
  const out = [];
  for (const b of BANDS) {
    const group = scored.filter((s) => s.verdict === b.verdict);
    if (group.length) out.push({ verdict: b.verdict, rows: group });
  }
  return out;
}

// Minimal CSV parser for the batch file: header row, comma-separated, double quotes allowed.
export function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const cells = [];
    let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q && ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = !q;
      else if (ch === ',' && !q) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push(cells.map((c) => c.trim()));
  }
  const [head, ...body] = rows;
  return body.map((cells) => Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ''])));
}

// Turn a CSV record into score() input. Blank cells are omitted; loops are "+"-separated, "none" means zero loops.
export function fromRecord(rec) {
  const p = { name: rec.name };
  for (const k of ['A', 'reachable', 'install', 'retention', 'F', 'V', 'C']) if (rec[k] !== undefined && rec[k] !== '') p[k] = rec[k];
  if (rec.loops !== undefined && rec.loops !== '') p.loops = rec.loops.toLowerCase() === 'none' ? [] : rec.loops.split('+');
  return p;
}
