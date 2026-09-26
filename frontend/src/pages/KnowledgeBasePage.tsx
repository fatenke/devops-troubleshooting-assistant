import { Boxes, Check, GitBranch, Network, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { KnowledgeSource } from '../types/knowledge';

const sources: (KnowledgeSource & { icon: LucideIcon; accent: string })[] = [
  {
    id: 'docker',
    name: 'Docker',
    type: 'official',
    description: 'Official Docker documentation',
    enabled: true,
    icon: Boxes,
    accent: 'docker',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    type: 'official',
    description: 'Official Kubernetes documentation',
    enabled: true,
    icon: Network,
    accent: 'kubernetes',
  },
  {
    id: 'git',
    name: 'Git',
    type: 'official',
    description: 'Official Git documentation',
    enabled: true,
    icon: GitBranch,
    accent: 'git',
  },
];

export function KnowledgeBasePage() {
  return (
    <div className="knowledge-base-page space-y-6">
      <section className="knowledge-base-intro flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="knowledge-base-mark"><BookOpen aria-hidden="true" size={21} /></div>
          <div>
            <p className="knowledge-base-eyebrow">CONNECTED COLLECTIONS</p>
            <h2 className="knowledge-base-heading">Documentation sources</h2>
            <p className="knowledge-base-copy">Reference libraries currently available to the assistant.</p>
          </div>
        </div>
        <div className="knowledge-base-count" aria-label={`${sources.length} sources available`}>
          <span className="knowledge-base-count-value">{String(sources.length).padStart(2, '0')}</span>
          <span className="knowledge-base-count-label">sources available</span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => {
          const SourceIcon = source.icon;

          return (
            <article key={source.id} className="knowledge-base-card">
              <div className="flex items-start justify-between gap-4">
                <div className={`knowledge-base-icon knowledge-base-icon-${source.accent}`}>
                  <SourceIcon aria-hidden="true" size={21} />
                </div>
                <span className="knowledge-base-status"><span />Available</span>
              </div>
              <h3 className="knowledge-base-source-name">{source.name}</h3>
              <p className="knowledge-base-source-description">{source.description}</p>
              <div className="knowledge-base-card-footer">
                <Check aria-hidden="true" size={15} />
                <span>Ready for retrieval</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
