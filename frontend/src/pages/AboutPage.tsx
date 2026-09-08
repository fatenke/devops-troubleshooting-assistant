import { ArrowDown, CircleHelp } from 'lucide-react';

const techStack = ['React', 'TypeScript', 'FastAPI', 'Qdrant', 'BM25', 'RRF', 'Cross-Encoder Reranking', 'Groq', 'FastEmbed'];

export function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-4 flex items-center gap-3">
          <CircleHelp className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">Objective</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          DevOps Troubleshooting Assistant helps engineers troubleshoot common DevOps problems using trusted technical documentation.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Current Knowledge Base</p>
            <p className="mt-2 text-base font-medium text-slate-100">Official Docker documentation.</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">System Scope</p>
            <p className="mt-2 text-base font-medium text-slate-100">Grounded troubleshooting for infrastructure and deployment issues.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-5 text-lg font-semibold text-slate-100">RAG Pipeline</h2>

        <div className="space-y-4 text-sm text-slate-200">
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">User Query</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Query Rewriting</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">
            Hybrid Retrieval
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">Vector Search</div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">BM25</div>
            </div>
          </div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">RRF</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Reranking</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Top Documents</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Grounded Prompt</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Groq LLM</div>
          <div className="flex justify-center text-slate-500"><ArrowDown className="h-4 w-4" /></div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3">Answer + Sources</div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((item) => (
            <span key={item} className="rounded-full border border-slate-700 bg-slate-950/40 px-2.5 py-1 text-xs text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
