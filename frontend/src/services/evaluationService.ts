import api from './api';
import type { LLMMetric, RetrievalMetric } from '../types/evaluation';

export async function getRetrievalEvaluation(): Promise<RetrievalMetric[]> {
  const { data } = await api.get<RetrievalMetric[]>('/evaluation/retrieval');
  return data;
}

export async function getLLMEvaluation(): Promise<LLMMetric[]> {
  const { data } = await api.get<LLMMetric[]>('/evaluation/llm');
  return data;
}
