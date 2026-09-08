import { Loader2 } from 'lucide-react';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/40">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        <span>{message}</span>
      </div>
    </div>
  );
}
