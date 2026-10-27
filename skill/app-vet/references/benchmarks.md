# Priors and benchmarks

Modeled from published industry data, **not measured from shipped installs.** Overwrite any row with real numbers as soon as a live app produces them, and note the date.

*Last revised: 2026-08-09 — no rows yet replaced with measured data.*

---

## Retention priors (90-day, still opening)

| Audience type | Retention | Why |
|---|---|---|
| Owned audience with a Calendar or Access loop (congregation, gym roster, school parents) | **45–60%** | The loop already runs offline; the app doesn't have to invent it |
| Owned audience, Reorder or Progress loop | **35–45%** | Habit exists but is easier to satisfy elsewhere |
| Customer list, Status loop only | **15–25%** | Opens are event-driven, so dormancy between events is normal — count events, not days |
| Fan base, Drop loop | **20–35%** | Scales hard with genuine engagement, not follower count |
| Cold consumer install, no relationship | **4%** | Industry median day-30. This is what a business with no loop is actually buying |

## Install-rate priors (% of reachable base that downloads)

| Situation | Install rate |
|---|---|
| Required for access (door code, ticket, membership card) | 70–85% |
| Announced from stage / in-person by the owner, weekly | 40–55% |
| Point-of-sale prompt with an immediate reward | 10–15% |
| Email or text announcement only | 5–10% |
| Discovered organically in the App Store | ~0% — do not model local business apps on search discovery |

## Cost floor

Use **C = $200/mo** even when billing $150. Someone has to run the thing, and modeling the retainer alone overstates every verdict by ~33%.

---

## Vertical scorecard

Modeled R values. Use as the starting model when the user names a vertical but has no specifics.

### Flagship — price above $400/mo

| Business | Loops | Opens/mo | R |
|---|---|---|---|
| Gym / CrossFit / martial arts studio | Calendar + Access + Progress | 12 | 14× |
| Creator or artist with a paid community | Drop + Access + Progress | 10 | 12× |
| Private school / daycare / preschool | Status + Calendar | 15 | 11× |

### Qualified — standard build

| Business | Loops | Opens/mo | R |
|---|---|---|---|
| Property manager, 100+ doors | Status + Calendar | 3 | 9× |
| Med spa / weight-loss clinic | Progress + Calendar | 5 | 7× |
| Coffee / bakery / QSR, 2–8 locations | Reorder | 6 | 6× |
| Church or ministry, 200+ attendance | Calendar + Drop + Access | 4 | 6× |
| Youth sports league or club | Calendar + Status | 8 | 6× |
| Auto repair shop | Status + Calendar | 1.5 | 5× |
| Salon / barbershop, 4+ chairs | Reorder + Calendar | 2 | 4× |
| Pet boarding / grooming / veterinary | Status + Reorder | 2 | 4× |
| Self-storage facility | Access + Status | 1 | 3× |

### Retrofit — sell the loop before the app

| Business | Missing | Opens/mo | R |
|---|---|---|---|
| Restaurant, single location | scale, not loop | 3 | 2.2× |
| Real estate brokerage | Status | 1 | 2.0× |
| Oral surgery / dental specialist | Progress | 0.4 | 1.8× |
| Financial advisor | Status | 0.6 | 1.6× |
| Roofing / HVAC / plumbing | Calendar | 0.3 | 1.4× |

### Brochure — sell a website

| Business | Opens/mo | R |
|---|---|---|
| Insurance broker (quote-only) | 0.2 | 0.9× |
| Law firm, transactional | 0.2 | 0.6× |
| General contractor | 0.1 | 0.5× |
| B2B consultant | 0.1 | 0.5× |
| Solar installer | 0.1 | 0.4× |
| Visual artist selling originals | 0.2 | 0.4× |
| Wedding photographer or venue | 0.1 | 0.3× |
| Moving company | 0.1 | 0.3× |
| Funeral home | 0.05 | 0.2× |

---

## Worked references

**300-member church.** Reachable 300 → 45% install → 50% retained → **A = 68**. F = 4 (service reminder, giving, sermon, events). Recurring-giving lift ≈ $1,200/mo across 272 opens → **V = $4.41**. C = $200. **R = 6.0×**

**Insurance broker, 400 policyholders.** 20% install → 8% retained → **A = 6**. F = 0.2. One referred policy per quarter ≈ **V = $150**. C = $200. **R = 0.9×**

---

## Underlying sources

- Mobile app retention benchmarks by industry, 2026 — UXCam · https://uxcam.com/blog/mobile-app-retention-benchmarks/
- Why 96% of users leave by day 30 — Userpilot · https://userpilot.com/blog/mobile-app-retention/
- Loyalty app spend and visit-frequency lift — Paytronix · https://www.paytronix.com/blog/loyalty-apps-for-restaurants
- Loyalty traffic now a third of restaurant visits — Nation's Restaurant News · https://www.nrn.com/restaurant-loyalty/loyalty-traffic-doubled-in-past-5-years-and-is-more-than-a-third-of-restaurant-visits-study-finds
- Church giving statistics and recurring-giving share — Pushpay · https://pushpay.com/blog/church-giving-statistics-and-trends/
- Push notification impact on retention, 63M users across 1,500 apps — Airship · https://grow.urbanairship.com/rs/313-QPJ-195/images/airship-how-push-notifications-impact-mobile-app-retention-rates.pdf
