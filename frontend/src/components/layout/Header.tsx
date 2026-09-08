import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type HeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function Header({ eyebrow, title, description }: HeaderProps) {
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem('devops-theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', isLightMode);
    localStorage.setItem('devops-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  return (
    <header className="app-header px-8 py-7 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-50">{title}</h1>
          <p className="app-muted mt-2 max-w-2xl text-sm">{description}</p>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsLightMode((prev) => !prev)}
          aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLightMode ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>
    </header>
  );
}
