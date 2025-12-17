interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
