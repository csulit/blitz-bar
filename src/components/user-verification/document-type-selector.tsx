import { cn } from '@/lib/utils'
import { documentTypes } from './constants'
import type { DocumentType } from './types'

interface DocumentTypeSelectorProps {
  selected: DocumentType
  onSelect: (type: DocumentType) => void
}

export function DocumentTypeSelector({
  selected,
  onSelect,
}: DocumentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {documentTypes.map((type) => {
        const isSelected = selected === type.id
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all duration-200',
              'hover:border-primary/50 hover:bg-primary/5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground',
            )}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-in zoom-in-50 duration-200">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            <div
              className={cn(
                'transition-colors duration-200',
                isSelected
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground',
              )}
            >
              {type.icon}
            </div>
            <span>{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
