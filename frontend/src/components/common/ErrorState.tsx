import { AlertTriangle } from 'lucide-react';

type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = 'Unable to connect to the backend.',
  message = 'Please verify that the API is running.',
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
