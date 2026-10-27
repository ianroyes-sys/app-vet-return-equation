// Modeled R per vertical, copied from skill/app-vet/references/benchmarks.md ("Vertical scorecard").
// These are priors from published benchmarks, not measurements. Replace a row when a shipped app gives real numbers.
export const VERTICALS = [
  { business: 'Gym / CrossFit / martial arts studio', loops: 'Calendar + Access + Progress', opens: 12, R: 14 },
  { business: 'Creator or artist with a paid community', loops: 'Drop + Access + Progress', opens: 10, R: 12 },
  { business: 'Private school / daycare / preschool', loops: 'Status + Calendar', opens: 15, R: 11 },
  { business: 'Property manager, 100+ doors', loops: 'Status + Calendar', opens: 3, R: 9 },
  { business: 'Med spa / weight-loss clinic', loops: 'Progress + Calendar', opens: 5, R: 7 },
  { business: 'Coffee / bakery / QSR, 2–8 locations', loops: 'Reorder', opens: 6, R: 6 },
  { business: 'Church or ministry, 200+ attendance', loops: 'Calendar + Drop + Access', opens: 4, R: 6 },
  { business: 'Youth sports league or club', loops: 'Calendar + Status', opens: 8, R: 6 },
  { business: 'Auto repair shop', loops: 'Status + Calendar', opens: 1.5, R: 5 },
  { business: 'Salon / barbershop, 4+ chairs', loops: 'Reorder + Calendar', opens: 2, R: 4 },
  { business: 'Pet boarding / grooming / veterinary', loops: 'Status + Reorder', opens: 2, R: 4 },
  { business: 'Self-storage facility', loops: 'Access + Status', opens: 1, R: 3 },
  { business: 'Restaurant, single location', loops: 'missing: scale, not loop', opens: 3, R: 2.2 },
  { business: 'Real estate brokerage', loops: 'missing: Status', opens: 1, R: 2.0 },
  { business: 'Oral surgery / dental specialist', loops: 'missing: Progress', opens: 0.4, R: 1.8 },
  { business: 'Financial advisor', loops: 'missing: Status', opens: 0.6, R: 1.6 },
  { business: 'Roofing / HVAC / plumbing', loops: 'missing: Calendar', opens: 0.3, R: 1.4 },
  { business: 'Insurance broker (quote-only)', loops: 'none', opens: 0.2, R: 0.9 },
  { business: 'Law firm, transactional', loops: 'none', opens: 0.2, R: 0.6 },
  { business: 'General contractor', loops: 'none', opens: 0.1, R: 0.5 },
  { business: 'B2B consultant', loops: 'none', opens: 0.1, R: 0.5 },
  { business: 'Solar installer', loops: 'none', opens: 0.1, R: 0.4 },
  { business: 'Visual artist selling originals', loops: 'none', opens: 0.2, R: 0.4 },
  { business: 'Wedding photographer or venue', loops: 'none', opens: 0.1, R: 0.3 },
  { business: 'Moving company', loops: 'none', opens: 0.1, R: 0.3 },
  { business: 'Funeral home', loops: 'none', opens: 0.05, R: 0.2 },
];

export function findVertical(query) {
  const q = query.toLowerCase();
  return VERTICALS.filter((v) => v.business.toLowerCase().includes(q));
}
