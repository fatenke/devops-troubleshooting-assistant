import { useEffect, useState, type ReactElement } from 'react';
import { Activity, BarChart3, Gauge, MessageSquareQuote, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { getMetrics } from '../services/monitoringService';
import type { MonitoringMetrics } from '../types/monitoring';

const emptyMetrics: MonitoringMetrics = {
  overview: { total_queries: 0, average_latency: 0, positive_feedback: 0, negative_feedback: 0 },
  queries_over_time: [],
  feedback: { positive: 0, negative: 0 },
  latency_over_time: [],
  scores: { average_retrieval_score: 0, average_rerank_score: 0 },
  categories: {},
};

const tooltipStyle = { backgroundColor: '#020817', border: '1px solid #334155', borderRadius: '12px' };

export function MonitoringPage() {
  const [metrics, setMetrics] = useState<MonitoringMetrics>(emptyMetrics);
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
        setMetrics(data ?? emptyMetrics);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setMetrics(emptyMetrics);
        setError('We could not load the monitoring data right now. Please try again in a moment.');
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

  const hasData = metrics.overview.total_queries > 0;
  const categoryData = Object.entries(metrics.categories).map(([category, count]) => ({ category, count }));
  const feedbackData = [
    { name: 'Positive', count: metrics.feedback.positive },
    { name: 'Negative', count: metrics.feedback.negative },
  ];
  const scoreData = [
    { name: 'Retrieval', score: metrics.scores.average_retrieval_score },
    { name: 'Reranking', score: metrics.scores.average_rerank_score },
  ];

  return (
    <div className="space-y-6">
      {loading && <LoadingState message="Loading monitoring metrics..." />}
      {error && <ErrorState title="We could not load the monitoring data." message={error} />}

      {!loading && !error && !hasData && (
        <EmptyState
          icon={Activity}
          title="No monitoring data available yet."
          detail="Run some troubleshooting queries and submit feedback to populate this dashboard."
        />
      )}

      {!loading && !error && hasData && (
        <>
          <section>
            <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Performance snapshot</p><h2 className="mt-1 text-xl font-semibold text-slate-100">Overview</h2></div><span className="text-xs text-slate-500">Live data from the monitoring API</span></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewCard icon={MessageSquareQuote} label="Total queries" value={metrics.overview.total_queries} />
              <OverviewCard icon={Gauge} label="Average latency" value={`${metrics.overview.average_latency.toFixed(2)} s`} />
              <OverviewCard icon={ThumbsUp} label="Positive feedback" value={metrics.overview.positive_feedback} />
              <OverviewCard icon={ThumbsDown} label="Negative feedback" value={metrics.overview.negative_feedback} />
            </div>
          </section>
          <section>
            <div className="mb-4"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Trends and quality signals</p><h2 className="mt-1 text-xl font-semibold text-slate-100">Charts</h2></div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ChartCard icon={MessageSquareQuote} title="Queries over time"><LineChart data={metrics.queries_over_time}><ChartGrid /><XAxis dataKey="date" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="queries" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ChartCard>
              <ChartCard icon={BarChart3} title="Feedback distribution"><BarChart data={feedbackData}><ChartGrid /><XAxis dataKey="name" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} /></BarChart></ChartCard>
              <ChartCard icon={Gauge} title="Response latency"><LineChart data={metrics.latency_over_time}><ChartGrid /><XAxis dataKey="date" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ChartCard>
              <ChartCard icon={BarChart3} title="Retrieval vs reranking scores"><BarChart data={scoreData}><ChartGrid /><XAxis dataKey="name" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="score" fill="#fbbf24" radius={[4, 4, 0, 0]} /></BarChart></ChartCard>
            </div>
            <div className="mt-4"><ChartCard icon={Activity} title="Problem categories"><BarChart data={categoryData} layout="vertical"><ChartGrid /><XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} /><YAxis type="category" dataKey="category" stroke="#94a3b8" width={110} fontSize={12} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="count" fill="#fb7185" radius={[0, 4, 4, 0]} /></BarChart></ChartCard></div>
          </section>
        </>
      )}
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number | string }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400"><Icon size={18} /></div><p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p></div>;
}

function ChartCard({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: ReactElement }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><div className="mb-3 flex items-center gap-2 text-slate-100"><Icon className="h-4 w-4 text-cyan-400" /><h3 className="text-sm font-semibold">{title}</h3></div><div className="h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></div>;
}

function ChartGrid() {
  return <CartesianGrid strokeDasharray="3 3" stroke="#334155" />;
}
