import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, FileText, MessageSquareText, SendHorizonal, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { sendChatMessage, sendFeedback } from '../services/chatService';
import { getHealth } from '../services/monitoringService';
import type { ChatResponse, FeedbackPayload } from '../types/chat';
import type { KnowledgeSource } from '../types/knowledge';

const knowledgeSources: KnowledgeSource[] = [
  { id: 'docker', name: 'Docker', type: 'official', description: 'Official Docker documentation', enabled: true },
  { id: 'kubernetes', name: 'Kubernetes', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'linux', name: 'Linux', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'git', name: 'Git', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'jenkins', name: 'Jenkins', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'terraform', name: 'Terraform', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'ansible', name: 'Ansible', type: 'future', description: 'Coming soon', enabled: false },
];

export function AssistantPage() {
  const [query, setQuery] = useState('My Docker container loses data after restart');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuery, setExpandedQuery] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{ query: string; rating: 'positive' | 'negative' | null }>({
    query: '',
    rating: null,
  });

  useEffect(() => {
    let active = true;

    async function checkApiHealth() {
      try {
        await getHealth();
        if (active) {
          setBackendReady(true);
        }
      } catch {
        if (active) {
          setBackendReady(false);
        }
      }
    }

    checkApiHealth();

    return () => {
      active = false;
    };
  }, []);

  const enabledSources = useMemo(() => knowledgeSources.filter((source) => source.enabled), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setBackendReady(null);

    try {
      const data = await sendChatMessage(query.trim());
      setResponse(data);
      setFeedbackState({ query: data.query, rating: null });
      setBackendReady(true);
    } catch {
      setError('We could not process your request right now. Please try again in a moment.');
      setResponse(null);
      setBackendReady(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(rating: 'positive' | 'negative') {
    if (!query.trim()) {
      return;
    }

    const payload: FeedbackPayload = {
      query: response?.query ?? query,
      rating,
    };

    try {
      await sendFeedback(payload);
      setFeedbackState({ query: payload.query, rating });
    } catch {
      setError('We could not save your feedback right now. Please try again in a moment.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">DevOps Troubleshooting Assistant</h2>
            <p className="mt-1 text-sm text-slate-300">Diagnose infrastructure problems using trusted technical documentation.</p>
          </div>
          <Badge label="Docker" tone="success" size="md" />
        </div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Knowledge Base</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {knowledgeSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/40 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-100">{source.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{source.description}</p>
                </div>
                <Badge label={source.enabled ? 'Available' : 'Coming soon'} tone={source.enabled ? 'success' : 'neutral'} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Describe your problem
          </label>
          <textarea
            aria-label="Describe your problem"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError(null);
            }}
            rows={5}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="Describe the infrastructure issue you need help with..."
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <SendHorizonal size={16} />
              {loading ? 'Analyzing documentation...' : 'Troubleshoot'}
            </button>
          </div>
        </form>
      </div>

      {backendReady === null && !response && !error && <LoadingState message="Checking backend connection..." />}
      {backendReady === false && !response && !error && (
        <EmptyState
          icon={Sparkles}
          title="No backend available yet."
          detail="Start the FastAPI service and retry your troubleshooting query."
        />
      )}
      {loading && <LoadingState message="Analyzing documentation..." />}
      {error && <ErrorState title="We could not complete your request." message={error} />}

      {response && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/70 shadow-[0_12px_40px_rgba(8,47,73,0.14)]">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/35 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Grounded response</p>
                  <h3 className="mt-0.5 text-lg font-semibold text-slate-100">Answer</h3>
                </div>
              </div>
              {response.latency && <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400">{response.latency} ms</span>}
            </div>
            <div className="px-5 py-5">
              <div className="assistant-markdown text-[15px] leading-7 text-slate-200">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h4>{children}</h4>,
                    h2: ({ children }) => <h4>{children}</h4>,
                    h3: ({ children }) => <h5>{children}</h5>,
                    p: ({ children }) => <p>{children}</p>,
                    ul: ({ children }) => <ul>{children}</ul>,
                    ol: ({ children }) => <ol>{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong>{children}</strong>,
                    code: ({ className, children, ...props }) => (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => <pre>{children}</pre>,
                  }}
                >
                  {response.answer}
                </ReactMarkdown>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Based on</span>
                {enabledSources.length > 0 ? enabledSources.map((source) => <Badge key={source.id} label={source.name} tone="success" />) : <Badge label="No sources available" tone="neutral" />}
                <span className="ml-auto">{response.sources.length} cited {response.sources.length === 1 ? 'source' : 'sources'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <button
              type="button"
              onClick={() => setExpandedQuery((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 text-left"
              aria-expanded={expandedQuery}
            >
              <h3 className="text-lg font-semibold text-slate-100">Query processing</h3>
              <ChevronDown className={`h-4 w-4 text-slate-300 transition ${expandedQuery ? 'rotate-180' : ''}`} />
            </button>

            {expandedQuery && (
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Original query</p>
                  <p className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">{response.query}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Rewritten query</p>
                  <p className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">{response.rewritten_query}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Retrieval</p>
                    <p>Hybrid Search</p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Reranking</p>
                    <p>Cross-Encoder</p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Final context</p>
                    <p>{response.sources.length} documents</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Evidence</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-100">Sources</h3>
              </div>
              {response.sources.length > 0 && <span className="text-xs text-slate-500">Ranked documentation excerpts</span>}
            </div>
            <div className="space-y-3">
              {response.sources.length === 0 ? (
                <EmptyState icon={MessageSquareText} title="No sources returned" detail="The backend returned no source excerpts for this query." />
              ) : (
                response.sources.map((source, index) => (
                  <div key={`${source.source}-${index}`} className="group rounded-xl border border-slate-700/80 bg-slate-950/45 p-4 transition hover:border-cyan-400/30 hover:bg-slate-950/70">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-400/10 text-xs font-semibold text-cyan-300">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <FileText size={15} className="shrink-0 text-slate-500" />
                            <p className="truncate text-sm font-medium text-slate-100">{source.source}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{source.category ?? 'general'}</span>
                        </div>
                        {source.rerank_score !== undefined && (
                          <p className="mt-2 text-[11px] text-slate-500">Relevance {source.rerank_score.toFixed(2)}</p>
                        )}
                        {source.rrf_score !== undefined && (
                          <p className="mt-1 text-[11px] text-slate-500">RRF {source.rrf_score.toFixed(2)}</p>
                        )}
                        <p className="mt-3 border-l-2 border-slate-700 pl-3 text-sm leading-6 text-slate-300">{source.text.slice(0, 260)}{source.text.length > 260 ? '…' : ''}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm font-medium text-slate-200">Was this answer helpful?</p>
            <p className="mt-1 text-xs text-slate-500">Your feedback helps improve troubleshooting quality.</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleFeedback('positive')}
                className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${feedbackState.rating === 'positive' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 bg-slate-950/40 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300'}`}
                aria-label="Mark answer as helpful"
              >
                {feedbackState.rating === 'positive' ? <Check size={15} /> : <ThumbsUp size={15} />}
                Helpful
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('negative')}
                className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${feedbackState.rating === 'negative' ? 'border-rose-400 bg-rose-500/20 text-rose-200' : 'border-slate-700 bg-slate-950/40 text-slate-300 hover:border-rose-500/50 hover:text-rose-300'}`}
                aria-label="Mark answer as not helpful"
              >
                <ThumbsDown size={15} />
                Not helpful
              </button>
              {feedbackState.rating && (
                <span className="text-xs text-slate-400">
                  Thanks, your feedback was recorded.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!response && !loading && !error && backendReady === true && (
        <EmptyState icon={Sparkles} title="Ready to troubleshoot" detail="Describe your infrastructure problem to begin the investigation workflow." />
      )}
    </div>
  );
}
