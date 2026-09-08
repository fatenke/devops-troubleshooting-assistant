import { Activity, BookOpen, CircleHelp, GitBranch, MessageSquare, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/assistant', label: 'Assistant', icon: MessageSquare },
  { to: '/evaluation', label: 'Evaluation', icon: GitBranch },
  { to: '/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/about', label: 'About', icon: CircleHelp },
];

export function Sidebar() {
  return (
    <aside className="app-sidebar fixed inset-y-0 left-0 z-20 flex w-64 flex-col px-4 py-5 backdrop-blur-xl">
      <div className="mb-7 flex items-center gap-3 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/90 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.3)]">
          <span className="text-base font-bold">D</span>
        </div>
        <div>
          <p className="font-display text-sm font-semibold tracking-tight text-slate-100">DevOps Assist</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Control plane</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Primary navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'nav-item-active font-medium' : 'nav-item-inactive'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-cyan-400' : 'nav-icon'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="app-status mt-auto pt-5">
        <div className="mb-3 flex items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
          <Settings2 size={13} />
          System status
        </div>
        <div className="space-y-3 px-3 text-xs text-slate-300">
          <StatusItem label="API status" />
          <StatusItem label="Knowledge base" />
        </div>
        <div className="mt-6 px-3 text-[11px] text-slate-500">v0.1.0 · Local workspace</div>
      </div>
    </aside>
  );
}

type StatusItemProps = {
  label: string;
};

function StatusItem({ label }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1.5 text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        Pending
      </span>
    </div>
  );
}
