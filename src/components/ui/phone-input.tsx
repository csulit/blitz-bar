import * as React from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'type'> {
  value?: string
  onChange?: (value: string) => void
}

function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Limit to 10 digits (PH mobile numbers without country code)
  const limited = digits.slice(0, 10)

  // Format as XXX XXX XXXX
  if (limited.length <= 3) {
    return limited
  }
  if (limited.length <= 6) {
    return `${limited.slice(0, 3)} ${limited.slice(3)}`
  }
  return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
}

function PhoneInput({
  className,
  value = '',
  onChange,
  disabled,
  ...props
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Extract only digits from input
    const digits = inputValue.replace(/\D/g, '').slice(0, 10)
    onChange?.(digits)
  }

  const displayValue = formatPhoneNumber(value)

  return (
    <div
      data-slot="phone-input"
      className={cn(
        'border-input flex h-9 w-full items-center rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'dark:bg-input/30',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
    >
      <span className="text-muted-foreground flex h-full shrink-0 items-center border-r px-3 text-sm select-none">
        +(63)
      </span>
      <input
        type="tel"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        className="placeholder:text-muted-foreground h-full w-full min-w-0 bg-transparent px-3 text-base outline-none md:text-sm"
        {...props}
      />
    </div>
  )
}

export { PhoneInput }
