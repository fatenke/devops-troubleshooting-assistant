import api from './api';
import type { ChatResponse, FeedbackPayload } from '../types/chat';

export async function sendChatMessage(query: string): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>('/chat', { query });
  return data;
}

export async function sendFeedback(payload: FeedbackPayload) {
  const { data } = await api.post('/feedback', payload);
  return data;
}
