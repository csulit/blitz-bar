import type { ReactNode } from 'react'

interface InfoFieldProps {
  label: string
  value: ReactNode
  capitalize?: boolean
  icon?: ReactNode
}

export function InfoField({
  label,
  value,
  capitalize = false,
  icon,
}: InfoFieldProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-0.5 flex items-center gap-1.5 text-sm font-medium ${capitalize ? 'capitalize' : ''} ${!value ? 'text-muted-foreground' : ''}`}
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {value ?? '—'}
      </p>
    </div>
  )
}
