export interface RetrievalMetric {
  method: string;
  recall_at_5: number;
  precision_at_5: number;
  mrr: number;
}

export interface LLMMetric {
  strategy: string;
  relevance: number;
  groundedness: number;
  correctness: number;
}

export interface EvaluationSummary {
  bestMethod: string;
  bestStrategy: string;
}
