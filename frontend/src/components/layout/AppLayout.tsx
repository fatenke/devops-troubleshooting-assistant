import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/assistant': {
    eyebrow: 'Workspace',
    title: 'DevOps Troubleshooting Assistant',
    description: 'Diagnose infrastructure problems using trusted technical documentation.',
  },
  '/evaluation': {
    eyebrow: 'Quality',
    title: 'Retrieval & LLM Evaluation',
    description: 'Measure retrieval and generation quality across the current system.',
  },
  '/monitoring': {
    eyebrow: 'Operations',
    title: 'Monitoring',
    description: 'Track usage, latency, and response quality across the assistant.',
  },
  '/knowledge-base': {
    eyebrow: 'Sources',
    title: 'Knowledge Base',
    description: 'Review the documentation sources currently available to the system.',
  },
  '/about': {
    eyebrow: 'System',
    title: 'About the project',
    description: 'Understand the architecture behind grounded DevOps answers.',
  },
};

export function AppLayout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? pageMeta['/assistant'];

  return (
    <div className="app-shell min-h-screen">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <Header eyebrow={meta.eyebrow} title={meta.title} description={meta.description} />
        <div className="page-enter mx-auto max-w-7xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
