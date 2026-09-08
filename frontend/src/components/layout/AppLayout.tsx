import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Activity, BookOpen, Boxes, CircleHelp, GitBranch, MessageSquare, Moon, Settings2, Sun } from 'lucide-react'
import { SidebarNavItem } from './SidebarNavItem'

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/assistant': {
    eyebrow: 'Workspace',
    title: 'Troubleshooting assistant',
    description: 'Investigate infrastructure issues with answers grounded in your knowledge base.',
  },
  '/evaluation': {
    eyebrow: 'Quality',
    title: 'Evaluation',
    description: 'Measure retrieval and generation quality as your system evolves.',
  },
  '/monitoring': {
    eyebrow: 'Operations',
    title: 'Monitoring',
    description: 'Keep an eye on usage, latency, feedback, and retrieval health.',
  },
  '/knowledge-base': {
    eyebrow: 'Sources',
    title: 'Knowledge base',
    description: 'Manage the documentation sources available to the assistant.',
  },
  '/about': {
    eyebrow: 'System',
    title: 'About the project',
    description: 'Understand the architecture behind grounded DevOps answers.',
  },
}

export function AppLayout() {
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? pageMeta['/assistant']
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem('devops-theme') === 'light')

  function toggleTheme() {
    const nextMode = !isLightMode
    setIsLightMode(nextMode)
    localStorage.setItem('devops-theme', nextMode ? 'light' : 'dark')
  }

  return (
    <div className={`app-shell min-h-screen ${isLightMode ? 'theme-light' : 'theme-dark'}`}>
      <aside className="app-sidebar fixed inset-y-0 left-0 z-20 flex w-64 flex-col px-4 py-5 backdrop-blur-xl">
        <div className="mb-9 flex items-center gap-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-ink-950 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
            <Boxes size={19} strokeWidth={2.5} />
          </div>
          <div>
            <p className="app-brand font-display text-sm font-semibold tracking-tight">DevOps Assist</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Control plane</p>
          </div>
        </div>

        <nav className="space-y-1" aria-label="Primary navigation">
          <SidebarNavItem to="/assistant" label="Assistant" icon={MessageSquare} />
          <SidebarNavItem to="/evaluation" label="Evaluation" icon={GitBranch} />
          <SidebarNavItem to="/monitoring" label="Monitoring" icon={Activity} />
          <SidebarNavItem to="/knowledge-base" label="Knowledge Base" icon={BookOpen} />
          <SidebarNavItem to="/about" label="About" icon={CircleHelp} />
        </nav>

        <div className="app-status mt-auto pt-5">
          <div className="app-muted mb-3 flex items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-[0.16em]">
            <Settings2 size={13} />
            System status
          </div>
          <div className="space-y-3 px-3">
            <StatusItem label="API status" />
            <StatusItem label="Knowledge base" />
          </div>
          <div className="app-faint mt-6 px-3 text-[11px]">v0.1.0 · Local workspace</div>
        </div>
      </aside>

      <main className="app-main ml-64 min-h-screen">
        <header className="app-header px-8 py-7 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{meta.eyebrow}</p>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{meta.title}</h1>
              <p className="app-muted mt-2 max-w-2xl text-sm">{meta.description}</p>
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {isLightMode ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function StatusItem({ label }: { label: string }) {
  return (
    <div className="app-muted flex items-center justify-between text-xs">
      <span>{label}</span>
      <span className="app-faint flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
        Pending
      </span>
    </div>
  )
}
