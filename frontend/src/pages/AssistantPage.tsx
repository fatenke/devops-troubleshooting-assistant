import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Check, ChevronDown, FileText, LoaderCircle, SendHorizontal, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, sendFeedback } from '../services/chatService';
import { getHealth } from '../services/monitoringService';
import type { ChatResponse, FeedbackPayload, SourceResult } from '../types/chat';
import type { KnowledgeSource } from '../types/knowledge';
import './AssistantPage.css';

const knowledgeSources: KnowledgeSource[] = [
  { id: 'docker', name: 'Docker', type: 'official', description: 'Official Docker documentation', enabled: true },
  { id: 'kubernetes', name: 'Kubernetes', type: 'official', description: 'Official Kubernetes documentation', enabled: true },
  { id: 'linux', name: 'Linux', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'git', name: 'Git', type: 'official', description: 'Official Git documentation', enabled: true },
  { id: 'jenkins', name: 'Jenkins', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'terraform', name: 'Terraform', type: 'future', description: 'Coming soon', enabled: false },
  { id: 'ansible', name: 'Ansible', type: 'future', description: 'Coming soon', enabled: false },
];

export function AssistantPage() {
  const [query, setQuery] = useState('');
  const [turns, setTurns] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; response?: ChatResponse }>>([]);
  const [loading, setLoading] = useState(false);
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuery, setExpandedQuery] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceResult | null>(null);
  const [feedbackState, setFeedbackState] = useState<{ query: string; rating: 'positive' | 'negative' | null }>({
    query: '',
    rating: null,
  });
  const conversationRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [turns, loading]);

  useEffect(() => {
    if (!selectedSource) {
      return;
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedSource(null);
      }
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedSource]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submittedQuery = query.trim();
    if (!submittedQuery || loading) {
      return;
    }

    setTurns((previous) => [...previous, { id: `user-${Date.now()}`, role: 'user', content: submittedQuery }]);
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(submittedQuery);
      setTurns((previous) => [...previous, { id: `assistant-${Date.now()}`, role: 'assistant', content: data.answer, response: data }]);
      setFeedbackState({ query: data.query, rating: null });
      setBackendReady(true);
    } catch {
      setError('We could not process your request right now. Please try again in a moment.');
      setBackendReady(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(message: string, rating: 'positive' | 'negative') {
    const payload: FeedbackPayload = {
      query: message,
      rating,
    };

    try {
      await sendFeedback(payload);
      setFeedbackState({ query: payload.query, rating });
    } catch {
      setError('We could not save your feedback right now. Please try again in a moment.');
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="assistant-chat" aria-label="DevOps troubleshooting chat">
      <div className="assistant-chat-shell">
        <div className="assistant-conversation" ref={conversationRef} role="log" aria-live="polite" aria-relevant="additions text">
          {turns.length === 0 ? (
            <div className="assistant-welcome">
              <div className="assistant-welcome-icon"><Sparkles size={22} aria-hidden="true" /></div>
              <p className="assistant-overline">DEVOPS TROUBLESHOOTING</p>
              <h3>What are you trying to solve?</h3>
              <p className="assistant-welcome-copy">Describe an incident, error, or infrastructure question. I’ll search the connected documentation and show the evidence behind the answer.</p>
              <div className="assistant-prompt-grid">
                {[
                  'Why does my container lose data after a restart?',
                  'How can I troubleshoot a failing Kubernetes pod?',
                  'How do I undo my last Git commit safely?',
                ].map((prompt) => (
                  <button key={prompt} type="button" onClick={() => setQuery(prompt)}>{prompt}<ChevronDown size={14} aria-hidden="true" /></button>
                ))}
              </div>
            </div>
          ) : (
            <div className="assistant-turn-list">
              {turns.map((turn) => (
                <article key={turn.id} className={`assistant-turn assistant-turn-${turn.role}`}>
                  {turn.role === 'user' ? (
                    <>
                      <div className="assistant-user-avatar" aria-hidden="true">Y</div>
                      <div className="assistant-user-message">{turn.content}</div>
                    </>
                  ) : (
                    <>
                      <div className="assistant-ai-avatar"><Sparkles size={15} aria-hidden="true" /></div>
                      <div className="assistant-ai-content">
                        <div className="assistant-ai-label">DevOps assistant</div>
                        <div className="assistant-markdown">
                          <ReactMarkdown>{turn.content}</ReactMarkdown>
                        </div>

                        {turn.response && (
                          <>
                            <div className="assistant-sources-heading">
                              <span>Sources</span>
                              <span>{turn.response.sources.length} retrieved</span>
                            </div>
                            {turn.response.sources.length > 0 ? (
                              <div className="assistant-source-list">
                                {turn.response.sources.map((source, index) => (
                                  <article key={source.chunk_id ?? `${source.source}-${index}`} className="assistant-source-card">
                                    <div className="assistant-source-icon"><FileText size={15} aria-hidden="true" /></div>
                                    <div className="assistant-source-main">
                                      <h4 title={source.source}>{source.source}</h4>
                                      <div className="assistant-source-meta">
                                        <span className="assistant-category">{source.category ?? 'Documentation'}</span>
                                        {source.rerank_score !== undefined && <span>Score {source.rerank_score.toFixed(2)}</span>}
                                      </div>
                                    </div>
                                    <button type="button" className="assistant-source-open" onClick={() => setSelectedSource(source)}>
                                      View document
                                    </button>
                                  </article>
                                ))}
                              </div>
                            ) : (
                              <p className="assistant-no-sources">No source documents were returned for this response.</p>
                            )}

                            <div className="assistant-message-actions">
                              {turn.response.latency !== undefined && <span className="assistant-latency">Answered in {turn.response.latency} s</span>}
                              <span className="assistant-feedback-label">Helpful?</span>
                              <button
                                type="button"
                                className={feedbackState.query === turn.response.query && feedbackState.rating === 'positive' ? 'is-selected' : ''}
                                onClick={() => handleFeedback(turn.response!.query, 'positive')}
                                aria-label="Mark answer as helpful"
                                title="Helpful"
                              >
                                {feedbackState.query === turn.response.query && feedbackState.rating === 'positive' ? <Check size={16} /> : <ThumbsUp size={16} />}
                              </button>
                              <button
                                type="button"
                                className={feedbackState.query === turn.response.query && feedbackState.rating === 'negative' ? 'is-selected is-negative' : ''}
                                onClick={() => handleFeedback(turn.response!.query, 'negative')}
                                aria-label="Mark answer as not helpful"
                                title="Not helpful"
                              >
                                <ThumbsDown size={16} />
                              </button>
                            </div>

                            <button type="button" className="assistant-query-toggle" onClick={() => setExpandedQuery((previous) => !previous)} aria-expanded={expandedQuery}>
                              <span>Query processing</span><ChevronDown size={15} className={expandedQuery ? 'is-expanded' : ''} />
                            </button>
                            {expandedQuery && (
                              <div className="assistant-query-details">
                                <div><span>Original query</span><p>{turn.response.query}</p></div>
                                <div><span>Rewritten query</span><p>{turn.response.rewritten_query}</p></div>
                                <div className="assistant-pipeline-summary"><span>Hybrid search</span><span>Cross-encoder reranking</span><span>{turn.response.sources.length} context documents</span></div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}

          {loading && (
            <div className="assistant-thinking" aria-label="Searching documentation">
              <div className="assistant-ai-avatar"><Sparkles size={15} aria-hidden="true" /></div>
              <div><LoaderCircle size={16} className="assistant-spinner" aria-hidden="true" /><span>Searching documentation and preparing an answer…</span></div>
            </div>
          )}
          {error && <div className="assistant-inline-error" role="alert">{error}</div>}
        </div>

        <div className="assistant-composer-wrap">
          <form onSubmit={handleSubmit} className="assistant-composer">
            <label className="sr-only" htmlFor="assistant-query">Describe your DevOps problem</label>
            <textarea
              id="assistant-query"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
              onKeyDown={handleComposerKeyDown}
              rows={2}
              placeholder="Ask about Docker, Kubernetes, Git, or an infrastructure issue…"
            />
            <div className="assistant-composer-footer">
              <div className="assistant-source-hints" aria-label="Connected documentation sources">
                {knowledgeSources.filter((source) => source.enabled).map((source) => <span key={source.id}>{source.name}</span>)}
              </div>
              <button type="submit" disabled={loading || !query.trim()} aria-label={loading ? 'Preparing answer' : 'Send message'} title="Send message">
                {loading ? <LoaderCircle size={17} className="assistant-spinner" /> : <SendHorizontal size={17} />}
              </button>
            </div>
          </form>
          <p className="assistant-composer-note">AI-generated guidance can be imperfect. Verify critical commands before running them.</p>
        </div>
      </div>

      {selectedSource && (
        <div className="assistant-source-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedSource(null); }}>
          <aside className="assistant-source-drawer" role="dialog" aria-modal="true" aria-labelledby="assistant-source-title">
            <header>
              <div className="assistant-source-drawer-heading"><div className="assistant-source-icon"><FileText size={16} aria-hidden="true" /></div><div><span>Retrieved document</span><h3 id="assistant-source-title">{selectedSource.source}</h3></div></div>
              <button type="button" onClick={() => setSelectedSource(null)} aria-label="Close document panel" title="Close"><X size={19} /></button>
            </header>
            <div className="assistant-source-drawer-meta">
              <span className="assistant-category">{selectedSource.category ?? 'Documentation'}</span>
              {selectedSource.rerank_score !== undefined && <span>Relevance {selectedSource.rerank_score.toFixed(3)}</span>}
              {selectedSource.rrf_score !== undefined && <span>Retrieval {selectedSource.rrf_score.toFixed(4)}</span>}
            </div>
            <div className="assistant-document-text"><ReactMarkdown>{selectedSource.text}</ReactMarkdown></div>
          </aside>
        </div>
      )}
    </section>
  );
}
