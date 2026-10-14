import { describe, expect, it } from 'vitest';
import { filterByEvidence, filterCountries, filterPress, filterTimeline, globalSearch, searchSources } from '../lib/filters';
import { es, countriesEs } from '../data/es';
import { sources } from '../data/sources';

describe('filterByEvidence', () => {
  it('verifiedOnly keeps only verified items', () => {
    const items = es.press.items;
    const filtered = filterByEvidence(items, true);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((i) => i.evidence === 'verified')).toBe(true);
    expect(filtered.length).toBeLessThan(items.length);
  });
  it('returns everything when disabled', () => {
    expect(filterByEvidence(es.press.items, false)).toHaveLength(es.press.items.length);
  });
});

describe('filterTimeline', () => {
  it('filters by category', () => {
    const exp = filterTimeline(es.history.events, 'expansion');
    expect(exp.length).toBeGreaterThan(0);
    expect(exp.every((e) => e.category === 'expansion')).toBe(true);
  });
  it('returns all for "all"', () => {
    expect(filterTimeline(es.history.events, 'all')).toHaveLength(es.history.events.length);
  });
});

describe('filterPress', () => {
  it('combines kind and sentiment', () => {
    const risks = filterPress(es.press.items, 'all', 'risk');
    expect(risks.length).toBeGreaterThan(0);
    expect(risks.every((i) => i.sentiment === 'risk')).toBe(true);
    const legal = filterPress(es.press.items, 'legal', 'all');
    expect(legal.every((i) => i.kind === 'legal')).toBe(true);
  });
});

describe('filterCountries', () => {
  it('counts statuses: 3 owned, 4 announced', () => {
    expect(filterCountries(countriesEs, 'owned')).toHaveLength(3);
    expect(filterCountries(countriesEs, 'announced')).toHaveLength(4);
    expect(filterCountries(countriesEs, 'partner')).toHaveLength(27);
  });
});

describe('searchSources', () => {
  it('finds by topic and is case-insensitive', () => {
    const res = searchSources(sources, 'IVA');
    expect(res.length).toBeGreaterThan(0);
    expect(searchSources(sources, '')).toHaveLength(sources.length);
    expect(searchSources(sources, 'zzz-no-match')).toHaveLength(0);
  });
});

describe('globalSearch', () => {
  const data = {
    countries: countriesEs.map((c) => ({ id: c.id, name: c.name })),
    leaders: es.leadership.leaders.map((l) => ({ name: l.name, role: l.role })),
    services: es.operating.serviceGroups.map((g) => ({ name: g.name, items: g.items })),
    sources,
  };
  it('finds countries, people and sources', () => {
    expect(globalSearch('sierra', data).some((h) => h.kind === 'country')).toBe(true);
    expect(globalSearch('overgaard', data).some((h) => h.kind === 'person')).toBe(true);
    expect(globalSearch('hapag', data).some((h) => h.kind === 'source')).toBe(true);
  });
  it('ignores queries shorter than 2 chars', () => {
    expect(globalSearch('a', data)).toHaveLength(0);
  });
});
