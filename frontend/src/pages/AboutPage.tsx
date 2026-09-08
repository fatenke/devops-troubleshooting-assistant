import {
  ArrowRight,
  Braces,
  CircleHelp,
  Database,
  FileSearch,
  Gauge,
  Layers3,
  Network,
  Sparkles,
} from 'lucide-react';

const techStack = ['React', 'TypeScript', 'FastAPI', 'Qdrant', 'BM25', 'RRF', 'Cross-Encoder', 'Groq', 'FastEmbed'];

const pipeline = [
  { label: 'User query', detail: 'The problem in your own words', icon: Braces, color: 'cyan' },
  { label: 'Query rewriting', detail: 'Intent becomes searchable context', icon: Sparkles, color: 'violet' },
  { label: 'Hybrid retrieval', detail: 'Vector search + BM25 work together', icon: Network, color: 'emerald' },
  { label: 'RRF + reranking', detail: 'The strongest evidence rises first', icon: Gauge, color: 'amber' },
  { label: 'Grounded answer', detail: 'Clear guidance with source excerpts', icon: FileSearch, color: 'rose' },
];

export function AboutPage() {
  return (
    <div className="about-page space-y-6">
      <section className="about-hero relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(8,47,73,0.2)] md:p-9">
        <div className="about-hero-grid" />
        <div className="relative max-w-3xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
            <CircleHelp size={24} />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Inside the assistant</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-slate-50 md:text-5xl">
            From an ambiguous incident to a grounded next step.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            DevOps Troubleshooting Assistant connects natural-language questions to trusted technical documentation, then keeps the evidence visible beside every answer.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium text-slate-300">
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">Documentation-first</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Docker knowledge base</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Source-backed answers</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoCard icon={Database} eyebrow="Current knowledge base" title="Official Docker documentation" detail="A focused starting point for containers, storage, networking, images, and deployment workflows." />
        <InfoCard icon={Layers3} eyebrow="System scope" title="Evidence over guesswork" detail="Retrieval, reranking, and grounded generation work together so recommendations stay close to the source material." />
      </section>

      <section className="rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-5 md:p-7">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">How it works</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-slate-100">The reasoning path</h2>
          </div>
          <span className="hidden text-xs text-slate-500 md:block">A transparent RAG pipeline</span>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {pipeline.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="pipeline-step relative" style={{ animationDelay: `${index * 90}ms` }}>
                <div className={`pipeline-icon pipeline-icon-${step.color}`}><Icon size={19} /></div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">0{index + 1}</span>
                  {index < pipeline.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 text-slate-600 md:block" />}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-100">{step.label}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><Sparkles size={17} /></div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">The toolkit</p>
            <h2 className="font-display text-xl font-semibold text-slate-100">Built for practical investigation</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((item) => <span key={item} className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200">{item}</span>)}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, eyebrow, title, detail }: { icon: typeof Database; eyebrow: string; title: string; detail: string }) {
  return (
    <div className="about-info-card rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-5 md:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon size={19} /></div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}
