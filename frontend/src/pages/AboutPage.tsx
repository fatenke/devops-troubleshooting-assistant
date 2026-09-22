import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Boxes, BrainCircuit, CircleCheck, Cloud, Database, GitBranch, Menu, Moon, Network, Search, ShieldCheck, Sparkles, Sun, Terminal, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { number: '01', title: 'Ask in plain language', detail: 'Describe the incident, symptom, or command that has you stuck.', icon: Terminal },
  { number: '02', title: 'Retrieve the evidence', detail: 'Semantic and keyword search find the strongest passages in your docs.', icon: Search },
  { number: '03', title: 'Get a grounded answer', detail: 'Reranked context gives the model what it needs to explain the next move.', icon: Sparkles },
];

const technologies = [
  { label: 'Docker', icon: Boxes },
  { label: 'Kubernetes', icon: Network },
  { label: 'Git', icon: GitBranch },
  { label: 'Cloud infrastructure', icon: Cloud },
  { label: 'FastAPI', icon: Zap },
  { label: 'Qdrant', icon: Database },
];

const architecture = [
  { label: 'Question', icon: Terminal, tone: 'cyan' },
  { label: 'Rewrite', icon: Sparkles, tone: 'violet' },
  { label: 'Hybrid search', icon: Search, tone: 'green' },
  { label: 'Rerank', icon: BarChart3, tone: 'amber' },
  { label: 'Generate', icon: BrainCircuit, tone: 'rose' },
];

export function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem('devops-theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', isLightMode);
    localStorage.setItem('devops-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.landing-reveal').forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className={`landing-page ${isLightMode ? 'landing-page-light' : ''} min-h-screen overflow-hidden bg-[#081116] text-slate-100`}>
      <header className="landing-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#081116]/75 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 font-display font-bold text-slate-950 shadow-[0_0_26px_rgba(103,232,249,0.35)]">D</span>
            <span className="font-display text-sm font-semibold tracking-tight sm:text-base">DevOps Assist</span>
          </Link>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-5 right-5 top-[4.5rem] flex-col gap-1 rounded-2xl border border-white/10 bg-[#101c21] p-3 shadow-2xl md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            <a href="#how-it-works" className="landing-nav-link" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#architecture" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Architecture</a>
            <a href="#stack" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Technology</a>
            <Link to="/assistant" className="landing-nav-cta" onClick={() => setMenuOpen(false)}>Open assistant <ArrowRight size={15} /></Link>
            <button type="button" className="landing-theme-toggle" onClick={() => setIsLightMode((previous) => !previous)} aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'} title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}>{isLightMode ? <Moon size={16} /> : <Sun size={16} />}</button>
          </nav>
          <button className="landing-menu-button md:hidden" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main>
        <section className="landing-hero relative grid min-h-screen w-full items-center gap-12 px-5 pb-20 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:px-[8vw] lg:pb-28">
          <div className="landing-hero-glow" />
          <div className="relative z-10 landing-reveal">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />Grounded intelligence for infrastructure</div>
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">Troubleshoot with <span className="text-cyan-300">evidence</span>, not guesswork.</h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">DevOps Troubleshooting Assistant is an AI-powered RAG workspace that turns messy infrastructure symptoms into clear, source-backed next steps.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Link to="/assistant" className="landing-primary-button">Try the Assistant <ArrowRight size={17} /></Link><a href="#how-it-works" className="landing-secondary-button">See how it works <span aria-hidden="true">↓</span></a></div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-slate-400"><span className="flex items-center gap-2"><CircleCheck size={15} className="text-emerald-300" /> Source-backed answers</span><span className="flex items-center gap-2"><CircleCheck size={15} className="text-emerald-300" /> Hybrid retrieval</span><span className="flex items-center gap-2"><CircleCheck size={15} className="text-emerald-300" /> Built for engineers</span></div>
          </div>
          <div className="relative z-10 landing-reveal" style={{ animationDelay: '140ms' }}><SystemVisual /></div>
        </section>

        <section id="how-it-works" className="landing-section border-y border-white/10 bg-[#0d1a1f]/80"><div className="w-full px-5 py-24 lg:px-[8vw]"><SectionIntro eyebrow="A faster path to clarity" title="From incident to insight in three deliberate steps." /><div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">{steps.map(({ number, title, detail, icon: Icon }, index) => <article key={number} className="landing-step landing-reveal bg-[#0d1a1f] p-7" style={{ animationDelay: `${index * 100}ms` }}><div className="flex items-center justify-between"><span className="font-display text-sm text-cyan-300">{number}</span><Icon size={20} className="text-slate-500" /></div><h3 className="mt-12 font-display text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{detail}</p></article>)}</div></div></section>

        <section id="architecture" className="landing-section w-full px-5 py-24 lg:px-[8vw]"><div className="grid w-full items-start gap-14 lg:grid-cols-[0.7fr_1.3fr]"><SectionIntro eyebrow="The RAG architecture" title="Every answer has a trail." text="The assistant combines the precision of keyword search with the context of semantic retrieval, then reranks the evidence before generation." /><div className="landing-architecture landing-reveal"><div className="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap">{architecture.map(({ label, icon: Icon, tone }, index) => <div key={label} className="flex items-center gap-2"><div className={`architecture-node architecture-node-${tone}`}><Icon size={18} /><span>{label}</span></div>{index < architecture.length - 1 && <ArrowRight size={16} className="hidden text-slate-600 sm:block" />}</div>)}</div><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={Search} label="Hybrid retrieval" value="BM25 + vectors" /><Metric icon={BarChart3} label="Reranking" value="Cross-encoder" /><Metric icon={ShieldCheck} label="Generation" value="Grounded prompts" /></div></div></div></section>

        <section id="stack" className="landing-section border-y border-white/10 bg-[#0d1a1f]/80"><div className="w-full px-5 py-24 lg:px-[8vw]"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionIntro eyebrow="Built around your stack" title="The language of modern operations." text="Start with the systems your team already knows. The knowledge base is designed to grow with the environments you run." /><span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/5 px-4 py-2 text-xs text-emerald-200 md:inline-flex">6 connected domains</span></div><div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{technologies.map(({ label, icon: Icon }, index) => <div key={label} className="landing-tech landing-reveal" style={{ animationDelay: `${index * 70}ms` }}><Icon size={20} className="text-cyan-300" /><span>{label}</span><ArrowRight size={15} className="ml-auto text-slate-600" /></div>)}</div></div></section>

        <section className="w-full px-5 py-24 lg:px-[8vw]"><div className="grid w-full gap-5 md:grid-cols-3"><Feature icon={Search} title="Hybrid search + reranking" text="Find exact commands and related concepts together, then let a cross-encoder prioritize what matters." /><Feature icon={BarChart3} title="Evaluation you can inspect" text="Compare retrieval strategies and grounded prompts with dedicated evaluation views." /><Feature icon={ShieldCheck} title="Operational visibility" text="Track latency, retrieval quality, reranking scores, and feedback in one monitoring surface." /></div></section>

        <section className="relative w-full overflow-hidden border-t border-white/10 bg-cyan-300 px-5 py-20 text-slate-950 lg:px-[8vw]"><div className="landing-cta-grid" /><div className="relative flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700">Ready when incidents are not</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Put a better troubleshooting loop in your hands.</h2></div><Link to="/assistant" className="landing-dark-button">Try the Assistant <ArrowRight size={17} /></Link></div></section>
      </main>
      <footer className="w-full border-t border-white/10 px-5 py-7 text-xs text-slate-500 lg:px-[8vw]"><div className="flex w-full flex-col justify-between gap-3 sm:flex-row"><span>DevOps Troubleshooting Assistant</span><span>RAG-powered infrastructure intelligence</span></div></footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <div className="max-w-xl landing-reveal"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p><h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">{title}</h2>{text && <p className="mt-5 text-base leading-8 text-slate-400">{text}</p>}</div>; }
function Metric({ icon: Icon, label, value }: { icon: typeof Search; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><Icon size={17} className="text-cyan-300" /><p className="mt-5 text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-200">{value}</p></div>; }
function Feature({ icon: Icon, title, text }: { icon: typeof Search; title: string; text: string }) { return <article className="landing-feature"><Icon size={20} className="text-cyan-300" /><h3 className="mt-7 font-display text-lg font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>; }
function SystemVisual() { return <div className="landing-visual relative mx-auto aspect-square max-w-[520px]"><div className="visual-ring visual-ring-one" /><div className="visual-ring visual-ring-two" /><div className="visual-core"><BrainCircuit size={40} className="text-cyan-200" /><span>RAG<br /><small>ENGINE</small></span></div><div className="visual-node visual-node-top"><Cloud size={17} /><span>Cloud signals</span></div><div className="visual-node visual-node-right"><Boxes size={17} /><span>Containers</span></div><div className="visual-node visual-node-bottom"><GitBranch size={17} /><span>Code context</span></div><div className="visual-node visual-node-left"><Database size={17} /><span>Knowledge base</span></div><div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" /></div>; }
