import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

type SidebarNavItemProps = {
  to: string
  label: string
  icon: LucideIcon
}

export function SidebarNavItem({ to, label, icon: Icon }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? 'nav-item-active font-medium'
            : 'nav-item-inactive'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className={isActive ? 'text-cyan-400' : 'nav-icon'} />
          {label}
        </>
      )}
    </NavLink>
  )
}
