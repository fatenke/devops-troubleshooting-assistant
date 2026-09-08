import { AlertTriangle } from 'lucide-react';

type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = 'We could not complete your request.',
  message = 'Something went wrong on our side. Please try again in a moment.',
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
      <div className="max-w-md">
        <div className="mb-3 flex justify-center text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
}
