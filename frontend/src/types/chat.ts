export interface SourceResult {
  chunk_id?: string;
  source: string;
  category?: string;
  text: string;
  rerank_score?: number;
  rrf_score?: number;
}

export interface ChatResponse {
  query: string;
  rewritten_query: string;
  answer: string;
  sources: SourceResult[];
  latency?: number;
}

export interface FeedbackPayload {
  query: string;
  rating: 'positive' | 'negative';
  comment?: string;
}
