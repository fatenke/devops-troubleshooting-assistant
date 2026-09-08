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

export interface MonitoringMetrics {
  overview: {
    total_queries: number;
    average_latency: number;
    positive_feedback: number;
    negative_feedback: number;
  };
  queries_over_time: { date: string; queries: number }[];
  feedback: { positive: number; negative: number };
  latency_over_time: { date: string; latency: number }[];
  scores: {
    average_retrieval_score: number;
    average_rerank_score: number;
  };
  categories: Record<string, number>;
}
