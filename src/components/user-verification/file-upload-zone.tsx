import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { UploadedFile } from './types'

interface FileUploadZoneProps {
  label: string
  file: UploadedFile | null
  onFileSelect: (file: File) => void
  onRemove: () => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function FileUploadZone({
  label,
  file,
  onFileSelect,
  onRemove,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  if (file) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div
          className={cn(
            'relative flex items-center gap-3 rounded-xl border-2 bg-background p-4 transition-all duration-300',
            file.status === 'uploading' && 'border-primary/30',
            file.status === 'success' && 'border-green-500/30 bg-green-500/5',
            file.status === 'error' && 'border-red-500/30 bg-red-500/5',
          )}
        >
          {/* File icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              file.status === 'uploading' && 'bg-primary/10',
              file.status === 'success' && 'bg-green-500/10',
              file.status === 'error' && 'bg-red-500/10',
            )}
          >
            <svg
              className={cn(
                'h-5 w-5',
                file.status === 'uploading' && 'text-primary',
                file.status === 'success' &&
                  'text-green-600 dark:text-green-500',
                file.status === 'error' && 'text-red-600 dark:text-red-500',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
              {file.status === 'uploading' && ` • Uploading ${file.progress}%`}
              {file.status === 'success' && ' • Upload complete'}
              {file.status === 'error' && ' • Upload failed'}
            </p>
          </div>

          {/* Progress/Status indicator */}
          {file.status === 'uploading' && (
            <div className="flex h-8 w-8 items-center justify-center">
              <svg
                className="h-5 w-5 animate-spin text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {file.status === 'success' && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Progress bar */}
          {file.status === 'uploading' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all duration-200',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragging
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
            : 'border-border bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload icon with animated ring */}
        <div className="relative">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200',
              isDragging
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
            )}
          >
            <svg
              className={cn(
                'h-6 w-6 transition-transform duration-200',
                isDragging && 'scale-110',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          {/* Animated rings on drag */}
          {isDragging && (
            <>
              <div className="absolute inset-0 animate-ping rounded-xl border border-primary/30" />
              <div
                className="absolute inset-0 animate-ping rounded-xl border border-primary/20"
                style={{ animationDelay: '150ms' }}
              />
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm">
            <span className="font-medium text-primary">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPG, JPEG, PNG less than 10MB
          </p>
          <p className="text-xs text-muted-foreground">
            Ensure your document is in good condition and readable
          </p>
        </div>
      </div>
    </div>
  )
}
