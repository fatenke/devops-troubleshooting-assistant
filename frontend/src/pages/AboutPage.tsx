import {
  Activity,
  ArrowDown,
  BarChart3,
  BookOpen,
  Braces,
  CheckCircle2,
  CircleHelp,
  Code2,
  Database,
  FileCode2,
  FileSearch,
  FolderTree,
  Gauge,
  Layers3,
  Network,
  Server,
  Settings2,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';
import type { ReactNode } from 'react';

const architecture = [
  { label: 'User Question', detail: 'A Docker problem in natural language', icon: Braces, tone: 'cyan' },
  { label: 'Query Rewriting', detail: 'Clarifies intent and search terms', icon: Sparkles, tone: 'violet' },
  { label: 'Hybrid Retrieval', detail: 'Combines semantic and lexical search', icon: Network, tone: 'emerald', branches: ['Vector Search', 'BM25', 'RRF'] },
  { label: 'Cross-Encoder Reranking', detail: 'Prioritizes the most relevant passages', icon: Gauge, tone: 'amber' },
  { label: 'Grounded Prompt', detail: 'Packages evidence for generation', icon: FileSearch, tone: 'rose' },
  { label: 'Groq LLM', detail: 'Generates a technical response', icon: Server, tone: 'blue' },
  { label: 'Answer + Sources', detail: 'Actionable guidance with citations', icon: CheckCircle2, tone: 'green' },
];

const technologyGroups = [
  { title: 'Frontend', icon: Code2, items: ['React', 'TypeScript', 'Tailwind CSS'] },
  { title: 'Backend', icon: Server, items: ['FastAPI', 'Python'] },
  { title: 'Retrieval', icon: Database, items: ['Qdrant', 'BM25', 'Reciprocal Rank Fusion (RRF)'] },
  { title: 'Reranking', icon: Gauge, items: ['Cross-Encoder'] },
  { title: 'Embeddings', icon: Layers3, items: ['BAAI/bge-small-en-v1.5'] },
  { title: 'LLM', icon: Sparkles, items: ['Groq', 'openai/gpt-oss-20b'] },
];

const structure = [
  { label: 'frontend/', detail: 'React application, pages, components, services', icon: Code2 },
  { label: 'src/api/', detail: 'FastAPI routes and application entrypoint', icon: Server },
  { label: 'src/retrieval/', detail: 'Query rewriting, search, and reranking', icon: Network },
  { label: 'src/llm/', detail: 'Prompt building and answer generation', icon: Sparkles },
  { label: 'src/evaluation/', detail: 'Retrieval and LLM evaluation scripts', icon: BarChart3 },
  { label: 'data/', detail: 'Documentation, processed chunks, and evaluation data', icon: FolderTree },
];

export function AboutPage() {
  return (
    <div className="about-page space-y-6">
      <section className="about-hero relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(8,47,73,0.2)] md:p-9">
        <div className="about-hero-grid" />
        <div className="relative max-w-4xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
            <CircleHelp size={24} />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Documentation</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-slate-50 md:text-5xl">A grounded way to investigate DevOps problems.</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            This assistant helps engineers find practical answers to Docker issues by retrieving relevant official documentation and generating grounded technical guidance with sources.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium text-slate-300">
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">Official documentation</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Retrieval augmented generation</span>
            <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5">Answers with sources</span>
          </div>
        </div>
      </section>

      <DocSection eyebrow="01 / Context" title="Problem description" icon={FileSearch}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm leading-7 text-slate-300">
              DevOps engineers regularly troubleshoot Docker issues involving containers, images, networking, volumes and storage, environment variables, and Docker Compose. Each incident may have several valid causes, and the right fix is often buried inside a large technical documentation set.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Finding the relevant explanation, checking its context, and translating it into a safe next step can be time-consuming. The project objective is to make that investigation faster while keeping the underlying evidence visible and reviewable.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Project objective</p>
            <p className="mt-3 text-base font-medium leading-7 text-slate-100">Retrieve the right documentation, generate a grounded answer, and show the sources that support it.</p>
          </div>
        </div>
      </DocSection>

      <DocSection eyebrow="02 / Corpus" title="Knowledge base" icon={BookOpen}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Source" value="Official Docker documentation" icon={BookOpen} />
          <StatCard label="Documents" value="838" icon={FileCode2} />
          <StatCard label="Chunks" value="13,816" icon={Braces} />
          <StatCard label="Index" value="Vector embeddings · Qdrant" icon={Database} />
        </div>
      </DocSection>

      <DocSection eyebrow="03 / Architecture" title="RAG architecture" icon={Network}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="max-w-2xl text-sm leading-6 text-slate-400">Every response follows a visible retrieval and generation path. The system combines semantic similarity with exact-term matching before the model writes its answer.</p>
          <span className="hidden rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-500 md:block">Question → evidence → answer</span>
        </div>
        <div className="space-y-3">
          {architecture.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="architecture-step" style={{ animationDelay: `${index * 70}ms` }}>
                <div className={`architecture-icon architecture-${step.tone}`}><Icon size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-sm font-semibold text-slate-100">{step.label}</h3>
                    <span className="text-xs text-slate-500">{step.detail}</span>
                  </div>
                  {step.branches && <div className="mt-3 flex flex-wrap gap-2">{step.branches.map((branch) => <span key={branch} className="rounded-md border border-slate-700 bg-slate-950/45 px-2.5 py-1 text-xs text-slate-300">{branch}</span>)}</div>}
                </div>
                {index < architecture.length - 1 && <ArrowDown className="hidden h-4 w-4 shrink-0 text-slate-600 md:block" />}
              </div>
            );
          })}
        </div>
      </DocSection>

      <DocSection eyebrow="04 / Stack" title="Technologies" icon={Settings2}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {technologyGroups.map(({ title, icon: Icon, items }) => (
            <div key={title} className="about-info-card rounded-xl border border-slate-700 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-cyan-300"><Icon size={16} /><h3 className="text-sm font-semibold text-slate-100">{title}</h3></div>
              <div className="mt-4 space-y-2">{items.map((item) => <p key={item} className="flex items-center gap-2 text-sm text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{item}</p>)}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <DocSection eyebrow="05 / Quality" title="Evaluation" icon={BarChart3}>
          <p className="text-sm leading-7 text-slate-300">The system compares BM25, Vector Search, Hybrid Search, and Hybrid + Reranking for retrieval quality. It also compares a Basic Prompt with a Grounded Prompt for answer quality.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultCard label="Best retrieval results" value="Hybrid + Reranking" /><ResultCard label="Best LLM results" value="Grounded Prompt" /></div>
        </DocSection>
        <DocSection eyebrow="06 / Operations" title="Monitoring" icon={Activity}>
          <p className="text-sm leading-7 text-slate-300">The application records queries, response latency, retrieval and reranking scores, and user feedback. These metrics are exposed through the Monitoring dashboard for quality and operational review.</p>
          <div className="mt-5 flex flex-wrap gap-2">{['Queries', 'Latency', 'Retrieval scores', 'Reranking scores', 'Feedback'].map((item) => <span key={item} className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-300">{item}</span>)}</div>
        </DocSection>
      </div>

      
    </div>
  );
}

function DocSection({ eyebrow, title, icon: Icon, children }: { eyebrow: string; title: string; icon: typeof BookOpen; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-7"><div className="mb-6 flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon size={17} /></div><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p><h2 className="mt-1 font-display text-xl font-semibold text-slate-100">{title}</h2></div></div>{children}</section>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BookOpen }) {
  return <div className="about-info-card rounded-xl border border-slate-700 bg-slate-950/40 p-4"><Icon className="h-4 w-4 text-cyan-300" /><p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-sm font-medium leading-6 text-slate-100">{value}</p></div>;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4"><p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold text-emerald-300">{value}</p></div>;
}
