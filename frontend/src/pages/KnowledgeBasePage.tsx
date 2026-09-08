import { BookOpen, Database, FolderOpen } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import type { KnowledgeSource } from '../types/knowledge';

const sources: KnowledgeSource[] = [
  {
    id: 'docker',
    name: 'Docker',
    type: 'official',
    description: 'Official Docker documentation',
    enabled: true,
  },
  { id: 'kubernetes', name: 'Kubernetes', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'linux', name: 'Linux', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'git', name: 'Git', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'jenkins', name: 'Jenkins', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'terraform', name: 'Terraform', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'ansible', name: 'Ansible', type: 'future', description: 'Coming soon', enabled: false },
];

export function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">Knowledge Base</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map((source) => (
            <div key={source.id} className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-100">{source.name}</span>
                </div>
                <Badge label={source.enabled ? 'Available' : 'Coming soon'} tone={source.enabled ? 'success' : 'neutral'} />
              </div>

              <p className="text-sm text-slate-300">{source.description}</p>

              {source.enabled ? (
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between"><span>Documents</span><span>838</span></div>
                  <div className="flex items-center justify-between"><span>Chunks</span><span>13,816</span></div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Future knowledge base not yet connected.
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
