// Tipos del dataset "OBT Intelligence Brief". Todo el contenido vive en es.ts / en.ts.

export type EvidenceLevel = 'verified' | 'reported' | 'secondary' | 'inferred' | 'undisclosed';
export type CountryStatus = 'owned' | 'partner' | 'announced';
export type Sentiment = 'positive' | 'neutral' | 'risk';
export type PressKind = 'independent' | 'trade' | 'corporate' | 'alliance' | 'regulation' | 'legal' | 'brand';

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  date?: string;
  country?: string;
  topics: string[];
  confidence: 'high' | 'medium' | 'low';
  kind: 'corporate' | 'registry' | 'press' | 'official' | 'sector';
}

export interface CountryEntry {
  /** ISO 3166-1 numérico, 3 dígitos, coincide con el id del GeoJSON */
  id: string;
  name: string;
  status: CountryStatus;
  year?: number;
  city?: string;
  detail?: string;
  sourceIds: readonly string[];
  evidence: EvidenceLevel;
}

export interface FinancialYear {
  year: number;
  grossProfit: number;
  ebit: number;
  pretax: number;
  netIncome: number;
  equity: number;
  assets: number;
  debtExProvisions: number;
  provisions: number;
  totalLiabilities: number;
  cash: number;
  employees: number;
  employeeConflict?: boolean;
  solvency: number; // %
  capitalIncrease?: number;
}

export interface TimelineEvent {
  year: number;
  title: string;
  detail?: string;
  category: 'expansion' | 'leadership' | 'alliance' | 'brand';
  evidence: EvidenceLevel;
}

export interface Leader {
  name: string;
  role: string;
  evidenceNote: string;
  caution?: string;
}

export interface PressItem {
  date: string;
  title: string;
  summary: string;
  sentiment: Sentiment;
  kind: PressKind;
  sourceIds: readonly string[];
  evidence: EvidenceLevel;
}

export interface Fact { value: string; label: string; source: string; evidence: EvidenceLevel }
export interface Card { title: string; body: string; evidence: EvidenceLevel; source: string }
export interface QA { q: string }
export interface RiskRow { risk: string; impact: string; mitigation: string }
export interface Milestone { year: string; label: string; value: string; source: string; quality: string; evidence: EvidenceLevel; note?: string }

export interface Dictionary {
  meta: { title: string; tagline: string; cutoff: string; entity: string; entityWarning: string };
  nav: { sections: { id: string; label: string }[]; searchPlaceholder: string; verifiedOnly: string; presentation: string; theme: string; language: string; methodology: string };
  ui: {
    evidence: Record<EvidenceLevel, string>;
    countryStatus: Record<CountryStatus, string>;
    sentiment: Record<Sentiment, string>;
    pressKind: Record<PressKind, string>;
    sources: string; source: string; year: string; viewMethodology: string; close: string;
    knownTitle: string; unknownTitle: string; trustTitle: string;
    kdkk: string; eurNote: string; currencyDKK: string; currencyEUR: string;
    printReport: string; noResults: string; dataGap: string; seeEvidence: string;
    all: string; yoy: string; tableView: string; chartView: string;
  };
  hero: { kicker: string; title: string; subtitle: string; facts: Fact[] };
  summary: {
    title: string; cards: Card[]; known: string[]; unknown: string[];
    trust: { level: string; label: string; desc: string }[];
    thesisTitle: string; thesis: string; risksTitle: string; risks: string[];
  };
  history: {
    title: string; intro: string;
    filters: Record<'all' | TimelineEvent['category'], string>;
    events: TimelineEvent[];
  };
  operating: {
    title: string; intro: string; chainTitle: string;
    chain: string[];
    servicesTitle: string;
    serviceGroups: { name: string; items: string[] }[];
    sectorsTitle: string; sectors: string[];
    diffTitle: string; differentiators: string[];
    depTitle: string; dependencies: string[];
  };
  africa: {
    title: string; intro: string;
    legendNote: string; gapTitle: string; gapBody: string;
    panelLabels: { status: string; year: string; city: string; detail: string; sources: string; evidence: string };
    countLabel: string;
  };
  leadership: {
    title: string; intro: string; leaders: Leader[];
    orgTitle: string; orgLevels: string[];
    boardNoteTitle: string; boardNote: string;
    successionTitle: string; succession: string[];
  };
  workforce: {
    title: string; intro: string; milestones: Milestone[];
    orgTitle: string; orgBody: string;
    kpiTitle: string; kpis: string[];
    localTitle: string; localBody: string;
  };
  finance: {
    title: string; banner: string;
    labels: Record<string, string>;
    years: FinancialYear[];
    insightsTitle: string; insights: string[];
    methodologyTitle: string; methodologyBody: string[];
    reconciliationTitle: string; reconciliationBody: string[];
    waterfallTitle: string; waterfallNote: string;
    ndLabel: string; conflictNote: string;
  };
  press: {
    title: string; intro: string;
    kindFilter: Record<'all' | PressKind, string>;
    sentimentFilter: Record<'all' | Sentiment, string>;
    items: PressItem[];
  };
  sierraLeone: {
    title: string; intro: string;
    profileTitle: string; profile: { k: string; v: string }[];
    tabs: { id: string; label: string }[];
    capabilities: string[];
    corridorsTitle: string; corridors: string[];
    casesTitle: string; cases: string[];
    marketTitle: string; marketCards: Fact[]; marketNote: string;
    regulationTitle: string; regulation: string[];
    risksTitle: string; risks: RiskRow[];
    swotTitle: string; swot: { s: string[]; w: string[]; o: string[]; t: string[] };
    swotLabels: { s: string; w: string; o: string; t: string };
    questionsTitle: string; questions: string[];
  };
  sourcesPage: {
    title: string; intro: string;
    triangulationTitle: string; triangulation: string[];
    searchPlaceholder: string;
    tableHeaders: { title: string; publisher: string; date: string; kind: string; country: string; confidence: string };
  };
  methodology: {
    title: string; scopeTitle: string; scope: string[];
    limitsTitle: string; limits: string[];
    rulesTitle: string; rules: string[];
    missingTitle: string; missing: string[];
  };
  footer: { author: string; disclaimer: string; cutoff: string };
}
