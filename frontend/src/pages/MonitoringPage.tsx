import { useEffect, useState } from 'react';
import { Activity, BarChart3, Gauge, MessageSquareQuote } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { getMetrics } from '../services/monitoringService';
import type { MonitoringSummary } from '../types/monitoring';

const emptySummary: MonitoringSummary = {
  queriesOverTime: [],
  feedback: [],
  latency: [],
  retrievalScores: [],
  categories: [],
};

export function MonitoringPage() {
  const [summary, setSummary] = useState<MonitoringSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getMetrics();
        if (!active) {
          return;
        }
        setSummary(data && Object.keys(data).length > 0 ? data : emptySummary);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setSummary(emptySummary);
        setError('Unable to connect to the monitoring API.');
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

  const hasData =
    summary.queriesOverTime.length > 0 ||
    summary.feedback.length > 0 ||
    summary.latency.length > 0 ||
    summary.retrievalScores.length > 0 ||
    summary.categories.length > 0;

  return (
    <div className="space-y-6">
      {loading && <LoadingState message="Loading monitoring metrics..." />}
      {error && <ErrorState title="Unable to connect to the backend." message={error} />}

      {!loading && !error && !hasData && (
        <EmptyState
          icon={Activity}
          title="No monitoring data available yet."
          detail="Run some troubleshooting queries to populate this dashboard."
        />
      )}

      {!loading && !error && hasData && (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-100">
                <MessageSquareQuote className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold">Queries over time</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.queriesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="queries" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-100">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Positive vs Negative Feedback</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.feedback}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Bar dataKey="positive" fill="#34d399" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-100">
                <Gauge className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-semibold">Response Latency</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.latency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-100">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold">Retrieval / Reranking Scores</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.retrievalScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Bar dataKey="avgScore" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-100">
              <Activity className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-semibold">Most Common Problem Categories</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis type="category" dataKey="category" stroke="#94a3b8" width={90} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#fb7185" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
