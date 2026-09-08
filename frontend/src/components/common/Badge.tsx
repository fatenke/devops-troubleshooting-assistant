type BadgeProps = {
  label: string;
  tone?: 'success' | 'warning' | 'neutral' | 'danger' | 'info';
  size?: 'sm' | 'md';
};

const toneStyles: Record<NonNullable<BadgeProps['tone']>, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  neutral: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  danger: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
};

export function Badge({ label, tone = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
