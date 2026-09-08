export interface MonitoringPoint {
  date: string;
  queries?: number;
  positive?: number;
  negative?: number;
  latency?: number;
  avgScore?: number;
  value?: number;
  category?: string;
  count?: number;
}

export interface MonitoringSummary {
  queriesOverTime: MonitoringPoint[];
  feedback: MonitoringPoint[];
  latency: MonitoringPoint[];
  retrievalScores: MonitoringPoint[];
  categories: MonitoringPoint[];
}
