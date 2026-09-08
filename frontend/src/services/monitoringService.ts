import api from './api';

export async function getHealth() {
  const { data } = await api.get<{ status: string; service: string }>('/health');
  return data;
}

export interface MonitoringMetrics {
  overview: {
    total_queries: number;
    average_latency: number;
    positive_feedback: number;
    negative_feedback: number;
  };

  queries_over_time: {
    date: string;
    queries: number;
  }[];

  feedback: {
    positive: number;
    negative: number;
  };

  latency_over_time: {
    date: string;
    latency: number;
  }[];

  scores: {
    average_retrieval_score: number;
    average_rerank_score: number;
  };

  categories: Record<string, number>;
}

export async function getMetrics(): Promise<MonitoringMetrics> {
  const { data } = await api.get<MonitoringMetrics>('/metrics');
  return data;
}
