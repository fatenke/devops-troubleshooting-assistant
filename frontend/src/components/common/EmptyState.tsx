import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

export function EmptyState({ icon: Icon, title, detail }: EmptyStateProps) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/30 p-6 text-center">
      <div className="max-w-md">
        <div className="mb-4 flex justify-center text-slate-400">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{detail}</p>
      </div>
    </div>
  );
}
