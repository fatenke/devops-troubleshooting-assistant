import { Activity, BookOpen, CircleHelp, GitBranch, MessageSquare } from 'lucide-react';
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

    </aside>
  );
}
