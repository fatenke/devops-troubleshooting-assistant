import { useEffect, useMemo, useState } from 'react';
import { BarChart3, GitBranch, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { getLLMEvaluation, getRetrievalEvaluation } from '../services/evaluationService';
import type { LLMMetric, RetrievalMetric } from '../types/evaluation';

export function EvaluationPage() {
  const [retrievalMetrics, setRetrievalMetrics] = useState<RetrievalMetric[]>([]);
  const [llmMetrics, setLLMMetrics] = useState<LLMMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [retrievalData, llmData] = await Promise.all([
          getRetrievalEvaluation(),
          getLLMEvaluation(),
        ]);

        if (!active) {
          return;
        }

        setRetrievalMetrics(retrievalData);
        setLLMMetrics(llmData);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setRetrievalMetrics([]);
        setLLMMetrics([]);
        setError('We could not load the evaluation data right now. Please try again in a moment.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const retrievalChartData = useMemo(
    () =>
      retrievalMetrics.map((metric) => ({
        name: metric.method,
        recall: metric.recall_at_5,
        precision: metric.precision_at_5,
        mrr: metric.mrr,
      })),
    [retrievalMetrics],
  );

  const llmChartData = useMemo(
    () =>
      llmMetrics.map((metric) => ({
        name: metric.strategy,
        relevance: metric.relevance,
        groundedness: metric.groundedness,
        correctness: metric.correctness,
      })),
    [llmMetrics],
  );

  const bestRetrievalMethod = retrievalMetrics.reduce<RetrievalMetric | null>((best, current) => {
    if (!best) return current;
    return current.mrr > best.mrr ? current : best;
  }, null);

  const bestStrategy = llmMetrics.reduce<LLMMetric | null>((best, current) => {
    if (!best) return current;
    return current.correctness > best.correctness ? current : best;
  }, null);

  return (
    <div className="space-y-6">
      {loading && <LoadingState message="Loading evaluation data..." />}
      {error && <ErrorState title="We could not load the evaluation data." message={error} />}

      {!loading && !error && retrievalMetrics.length === 0 && llmMetrics.length === 0 && (
        <EmptyState icon={BarChart3} title="No evaluation data available yet." detail="Run the evaluation pipeline or connect the backend to populate retrieval and LLM metrics." />
      )}

      {!loading && !error && (retrievalMetrics.length > 0 || llmMetrics.length > 0) && (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-slate-100">Retrieval & LLM Evaluation</h2>
              </div>
              {bestRetrievalMethod && <Badge label={`Best method: ${bestRetrievalMethod.method}`} tone="success" />}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {retrievalMetrics.map((metric) => (
                <div key={metric.method} className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
                  <p className="text-sm font-medium text-slate-100">{metric.method}</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between"><span>Recall@5</span><span>{metric.recall_at_5.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>Precision@5</span><span>{metric.precision_at_5.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>MRR</span><span>{metric.mrr.toFixed(3)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {retrievalChartData.length > 0 && (
              <div className="mt-6 h-72 rounded-xl border border-slate-700 bg-slate-950/30 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retrievalChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey="recall" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mrr" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-slate-100">LLM Evaluation</h2>
              </div>
              {bestStrategy && <Badge label={`Best strategy: ${bestStrategy.strategy}`} tone="warning" />}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {llmMetrics.map((metric) => (
                <div key={metric.strategy} className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
                  <p className="text-sm font-medium text-slate-100">{metric.strategy}</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between"><span>Relevance</span><span>{metric.relevance.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>Groundedness</span><span>{metric.groundedness.toFixed(3)}</span></div>
                    <div className="flex justify-between"><span>Correctness</span><span>{metric.correctness.toFixed(3)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {llmChartData.length > 0 && (
              <div className="mt-6 h-72 rounded-xl border border-slate-700 bg-slate-950/30 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={llmChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey="relevance" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="groundedness" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="correctness" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="mt-4 text-xs text-slate-400">
              LLM scores are heuristic automatic indicators and should be interpreted as experimental evaluation results.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
