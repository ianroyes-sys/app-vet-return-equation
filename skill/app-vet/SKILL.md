---
name: app-vet
description: Vet whether a business, creator, or artist actually needs a mobile app before quoting them, using the Return Equation (R = A·F·V ÷ C). Use when the user names a prospect or vertical and asks "would an app work for X", "should I build an app for this client", "is this a good app client", "vet this business", "score this lead", "does a church/gym/restaurant/insurance broker need an app", or is deciding what to charge for an app retainer. Also use when triaging an inbound app inquiry or picking which verticals to sell into.
---

# App Vet — the Return Equation

Decide whether a prospect should be sold an app, sold a website, or sold a loop retrofit first. Output a scorecard, a verdict, a price, and (when it fails) the specific fix that would make it pass.

## The premise

An app doesn't create a habit. It attaches to one. Median day-30 retention across all app categories is ~4%; owned-audience apps (a congregation, a gym roster, a regular customer) run 35–60% because the loop already exists offline. A business with no offline loop cannot be rescued by good design — it will ship a brochure behind a download button.

The single disqualifying question: **what makes this customer open the app next Tuesday?** No answer = no app.

## The equation

```
R = (A · F · V) / C
```

| Term | Meaning | How to get it |
|---|---|---|
| **A** | Active audience | reachable base × install rate × 90-day retention |
| **F** | Frequency | genuine reasons to open, per person, per month |
| **V** | Value per open | gross margin captured per open (incremental spend, saved labor, closed lead) |
| **C** | Cost | monthly retainer + client's own time. Default **$200** even when billing $150 |

Verdict bands:

| R | Verdict | Action |
|---|---|---|
| ≥ 10 | **Flagship** | Build. Price $400–800/mo. |
| 3 – 10 | **Qualified** | Build. Standard retainer $150–350/mo. |
| 1 – 3 | **Retrofit** | Do not sell the app they asked for. Sell the missing loop first, then re-score. |
| < 1 | **Brochure** | Decline the app. Sell a website. Say why out loud. |

## Procedure

1. **Identify the loops.** Read `references/loops.md`. Name every loop the business already runs *offline*. Zero loops → jump to step 5 with a Brochure verdict; the arithmetic is a formality but still run it, because the number is what closes the conversation.

2. **Estimate the four terms.** Use `references/benchmarks.md` for install-rate and retention priors when the user doesn't have real numbers. Never invent a number silently — state every assumption inline in the scorecard and mark which ones are priors vs. client-supplied.
   - If the user gave a vertical but no specifics, use the vertical's row in `references/benchmarks.md` as the starting model and say so.
   - If the user gave real figures (member count, average ticket, current call volume), those override every prior.

3. **Compute R.** Show the arithmetic. Round to one decimal.

4. **Sanity-check against three traps** before reporting:
   - *Emergency ≠ frequency.* Roofing, plumbing, towing, HVAC feel urgent and are among the lowest-F businesses that exist. Urgency without rhythm is a phone number.
   - *Scale gates the Reorder loop.* One restaurant or one coffee shop rarely clears 3×; two to eight locations does. Check location count before failing a good loop for bad economics.
   - *Followers ≠ audience.* For creators and artists, A is people who would pay or install, not follower count. Below ~2,000 genuinely engaged fans, the Drop loop does not carry an app.

5. **Report the scorecard** in the format below.

6. **If R lands in 1–3, produce the retrofit.** Name the specific feature that manufactures the missing loop, which loop it creates, and the re-scored R. Retrofit patterns are in `references/loops.md`. A retrofit is a *new service the client isn't currently offering* — that's what justifies the higher retainer, so say what the client now sells that they didn't before.

7. **If R < 1, say so plainly and recommend the website.** Do not soften it into a maybe. Losing the wrong client on purpose is the point of this skill.

## Output format

```
PROSPECT — <business>, <vertical>

LOOPS      <named loops, or "none">
A          <n>        <derivation> [prior|client]
F          <n>/mo     <what triggers each open> [prior|client]
V          $<n>       <where the margin comes from> [prior|client]
C          $<n>/mo    <retainer + time>

R = (A · F · V) / C = <n>×

VERDICT    <Flagship | Qualified | Retrofit | Brochure>
PRICE      $<n>/mo
```

Follow the block with 2–4 sentences of reasoning, then either the build recommendation (which loops the app should be organized around, in priority order), the retrofit, or the decline.

## Batch mode

When given a list of verticals or prospects, score each one and return a single table sorted by R descending, with group headers at the band boundaries. Skip the per-prospect prose; add one line per Retrofit-band row naming the missing loop.

## Rules

- Give a number, not a range, then state what would move it most.
- Flag when a verdict is fragile — when one assumption carries it, name that assumption.
- Never score above 3× on loops the business doesn't currently run. Aspirational loops belong in the retrofit section, not the numerator.
- Priors are modeled from published benchmarks, not measured. Whenever the user has real data from a shipped app, tell them to overwrite the prior in `references/benchmarks.md`.
