import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, MessageSquareText, SendHorizonal, Sparkles } from 'lucide-react';
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
      setError('Unable to connect to the backend. Please verify that the API is running.');
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
      setError('Unable to submit feedback. Please try again once the API is available.');
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
      {error && <ErrorState title="Unable to connect to the backend." message={error} />}

      {response && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Answer</h3>
              {response.latency && <Badge label={`${response.latency} ms`} tone="info" />}
            </div>
            <div className="text-sm leading-7 text-slate-200">{response.answer}</div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-medium text-slate-200">Knowledge base:</span>
              {enabledSources.length > 0 ? enabledSources.map((source) => <Badge key={source.id} label={source.name} tone="success" />) : <Badge label="No sources available" tone="neutral" />}
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
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Sources</h3>
            <div className="space-y-3">
              {response.sources.length === 0 ? (
                <EmptyState icon={MessageSquareText} title="No sources returned" detail="The backend returned no source excerpts for this query." />
              ) : (
                response.sources.map((source, index) => (
                  <div key={`${source.source}-${index}`} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{source.source}</p>
                        <p className="mt-1 text-xs text-slate-400">Category: {source.category ?? 'general'}</p>
                        {source.rerank_score !== undefined && (
                          <p className="mt-1 text-xs text-slate-400">Rerank score: {source.rerank_score.toFixed(2)}</p>
                        )}
                        {source.rrf_score !== undefined && (
                          <p className="mt-1 text-xs text-slate-400">RRF score: {source.rrf_score.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{source.text.slice(0, 260)}{source.text.length > 260 ? '…' : ''}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-3 text-sm font-medium text-slate-200">Was this answer helpful?</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleFeedback('positive')}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                aria-label="Mark answer as helpful"
              >
                👍
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('negative')}
                className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
                aria-label="Mark answer as not helpful"
              >
                👎
              </button>
              {feedbackState.rating && (
                <span className="text-xs text-slate-400">
                  Feedback recorded for: {feedbackState.rating === 'positive' ? 'helpful' : 'not helpful'}
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
