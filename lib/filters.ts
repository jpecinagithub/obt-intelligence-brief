import type { CountryEntry, EvidenceLevel, PressItem, PressKind, Sentiment, Source, TimelineEvent } from '../data/types';

const VERIFIED_ONLY: EvidenceLevel[] = ['verified'];

/** Filtra elementos por nivel de evidencia; verifiedOnly deja solo 'verified' */
export function filterByEvidence<T extends { evidence: EvidenceLevel }>(items: T[], verifiedOnly: boolean): T[] {
  if (!verifiedOnly) return items;
  return items.filter((i) => VERIFIED_ONLY.includes(i.evidence));
}

export function filterTimeline(events: TimelineEvent[], category: 'all' | TimelineEvent['category']): TimelineEvent[] {
  if (category === 'all') return events;
  return events.filter((e) => e.category === category);
}

export function filterPress(
  items: PressItem[],
  kind: 'all' | PressKind,
  sentiment: 'all' | Sentiment,
): PressItem[] {
  return items.filter(
    (i) => (kind === 'all' || i.kind === kind) && (sentiment === 'all' || i.sentiment === sentiment),
  );
}

export function filterCountries(countries: readonly CountryEntry[], status: 'all' | CountryEntry['status']): CountryEntry[] {
  if (status === 'all') return [...countries];
  return countries.filter((c) => c.status === status);
}

export function searchSources(sources: Source[], query: string): Source[] {
  const q = query.trim().toLowerCase();
  if (!q) return sources;
  return sources.filter((s) =>
    [s.title, s.publisher, s.country ?? '', ...s.topics].join(' ').toLowerCase().includes(q),
  );
}

export interface SearchHit { kind: 'country' | 'person' | 'service' | 'source'; label: string; detail: string; anchor: string }

export function globalSearch(
  query: string,
  data: {
    countries: readonly { id: string; name: string }[];
    leaders: readonly { name: string; role: string }[];
    services: readonly { name: string; items: readonly string[] }[];
    sources: Source[];
  },
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const c of data.countries)
    if (c.name.toLowerCase().includes(q)) hits.push({ kind: 'country', label: c.name, detail: c.id, anchor: 'africa' });
  for (const l of data.leaders)
    if (l.name.toLowerCase().includes(q) || l.role.toLowerCase().includes(q))
      hits.push({ kind: 'person', label: l.name, detail: l.role, anchor: 'gobierno' });
  for (const s of data.services)
    for (const item of s.items)
      if (item.toLowerCase().includes(q)) {
        hits.push({ kind: 'service', label: item, detail: s.name, anchor: 'modelo-operativo' });
        break;
      }
  for (const s of data.sources)
    if ((s.title + ' ' + s.publisher).toLowerCase().includes(q))
      hits.push({ kind: 'source', label: s.title, detail: s.publisher, anchor: 'fuentes' });
  return hits.slice(0, 12);
}
