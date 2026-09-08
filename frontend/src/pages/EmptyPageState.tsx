import type { LucideIcon } from 'lucide-react'

type EmptyPageStateProps = {
  icon: LucideIcon
  title: string
  detail: string
}

export function EmptyPageState({ icon: Icon, title, detail }: EmptyPageStateProps) {
  return (
    <section className="empty-state rounded-xl border border-dashed px-8 py-20 text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
        <Icon size={22} />
      </div>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="app-muted mx-auto mt-2 max-w-md text-sm">{detail}</p>
    </section>
  )
}
