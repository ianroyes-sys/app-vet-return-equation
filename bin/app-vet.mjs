#!/usr/bin/env node
// app-vet: score whether a business needs a mobile app with the Return Equation, R = A·F·V ÷ C.
import { readFileSync } from 'node:fs';
import { score, formatScorecard, batch, parseCsv, fromRecord, LOOPS, COST_FLOOR } from '../src/return-equation.mjs';
import { VERTICALS, findVertical } from '../src/verticals.mjs';

const HELP = `app-vet: the Return Equation, R = (A · F · V) / C

Score one prospect:
  app-vet score --name "Ironwood Strength" --loops calendar+access+progress \\
                --reachable 220 --install 80% --retention 55% --F 12 --V 2.5 [--C 250]
  app-vet score --A 68 --F 4 --V 4.41                 (A known already)

Batch (sorted by R, grouped by verdict):
  app-vet batch examples/prospects.sample.csv [--json]

Modeled priors per vertical:
  app-vet vertical [search]                           e.g. app-vet vertical gym

Terms
  A  active audience = reachable × install rate × 90-day retention
  F  genuine reasons to open, per person, per month
  V  gross margin captured per open, in dollars
  C  retainer + client's own time per month (default and floor: $${COST_FLOOR})
  --loops  loops the business already runs offline: ${LOOPS.join(', ')} ("+"-separated, or "none")

Bands: ≥ 10 Flagship · 3–10 Qualified · 1–3 Retrofit · < 1 Brochure
The full method (loops, traps, retrofits) is in skill/app-vet/SKILL.md.`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[k] = v;
    } else out._.push(a);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  if (!cmd || args.help || cmd === 'help') return console.log(HELP);

  if (cmd === 'score') {
    const p = {};
    for (const k of ['A', 'reachable', 'install', 'retention', 'F', 'V', 'C']) if (args[k] !== undefined) p[k] = args[k];
    if (args.loops !== undefined) p.loops = String(args.loops).toLowerCase() === 'none' ? [] : String(args.loops).split('+');
    if (p.F === undefined || p.V === undefined || (p.A === undefined && p.reachable === undefined)) {
      throw new Error('score needs --F, --V and either --A or --reachable with --install and --retention');
    }
    const s = score(p);
    return console.log(args.json ? JSON.stringify(s, null, 2) : formatScorecard(args.name || 'prospect', s));
  }

  if (cmd === 'batch') {
    const file = args._[1];
    if (!file) throw new Error('batch needs a CSV file');
    const groups = batch(parseCsv(readFileSync(file, 'utf8')).map(fromRecord));
    if (args.json) return console.log(JSON.stringify(groups, null, 2));
    for (const g of groups) {
      console.log(`\n## ${g.verdict}`);
      for (const s of g.rows) {
        const why = g.verdict === 'Retrofit' ? '   (retrofit first: skill/app-vet/references/loops.md)' : s.noLoops ? '   (no offline loop)' : '';
        console.log(`${s.R.toFixed(1).padStart(6)}×  ${s.name}  [A ${s.A} · F ${s.F} · V $${s.V} · C $${s.C}]${why}`);
      }
    }
    return;
  }

  if (cmd === 'vertical') {
    const rows = args._[1] ? findVertical(args._.slice(1).join(' ')) : VERTICALS;
    if (!rows.length) return console.log('No matching vertical. Run `app-vet vertical` for the full list.');
    for (const v of rows) console.log(`${String(v.R).padStart(5)}×  ${v.business}  (${v.loops}; ${v.opens} opens/mo)`);
    return console.log('\nModeled priors, not measurements. Real figures from the client override them.');
  }

  throw new Error(`unknown command: ${cmd}\n\n${HELP}`);
}

try {
  main();
} catch (e) {
  console.error(`app-vet: ${e.message}`);
  process.exit(1);
}
