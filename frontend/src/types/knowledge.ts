export interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  description: string;
  enabled: boolean;
}

export interface KnowledgeBaseStatus {
  status: 'available' | 'coming-soon' | 'unknown';
  label: string;
}
