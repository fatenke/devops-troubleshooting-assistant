import api from './api';

export async function getMetrics() {
  const { data } = await api.get('/monitoring');
  return data;
}

export async function getHealth() {
  const { data } = await api.get('/health');
  return data;
}
