import { useEffect, useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // After mounting, determine if dark mode is active
  const isDark =
    mounted &&
    (theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches))

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative h-9 w-9 rounded-full',
        'bg-secondary/80 hover:bg-secondary',
        'border border-border/50 hover:border-border',
        'transition-all duration-300 ease-out',
        'hover:scale-105 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'group cursor-pointer',
        className,
      )}
      aria-label="Toggle theme"
    >
      {/* Sun */}
      <svg
        className={cn(
          'absolute inset-0 m-auto h-4 w-4',
          'text-amber-500',
          'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isDark
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100',
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          strokeLinecap="round"
          className={cn(
            'origin-center transition-all duration-300',
            isDark ? 'scale-0' : 'scale-100',
          )}
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </svg>

      {/* Moon */}
      <svg
        className={cn(
          'absolute inset-0 m-auto h-4 w-4',
          'text-violet-400',
          'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0',
        )}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>

      {/* Glow effect */}
      <span
        className={cn(
          'absolute inset-0 rounded-full',
          'transition-all duration-500',
          isDark
            ? 'bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
            : 'bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
          'opacity-0 group-hover:opacity-100',
        )}
      />
    </button>
  )
}
