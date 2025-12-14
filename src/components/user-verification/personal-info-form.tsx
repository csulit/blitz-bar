import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebouncedCallback } from 'use-debounce'
import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useUpdatePersonalInfo } from './hooks/mutations/use-update-personal-info'
import type {PersonalInfoFormData} from '@/lib/schemas/personal-info';
import { cn } from '@/lib/utils'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  
  genderOptions,
  maritalStatusOptions,
  personalInfoSchema
} from '@/lib/schemas/personal-info'

interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoFormData>
  onValidChange: (isValid: boolean) => void
  onDataChange: (data: Partial<PersonalInfoFormData>) => void
}

export function PersonalInfoForm({
  defaultValues,
  onValidChange,
  onDataChange,
}: PersonalInfoFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues,
  })

  const { mutate: savePersonalInfo } = useUpdatePersonalInfo()
  const isInitialMount = useRef(true)

  // Debounced save function - 500ms delay
  const debouncedSave = useDebouncedCallback(
    (data: Partial<PersonalInfoFormData>) => {
      // Only save non-empty values
      const nonEmptyData = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== undefined && value !== '',
        ),
      ) as Partial<PersonalInfoFormData>

      if (Object.keys(nonEmptyData).length > 0) {
        savePersonalInfo(nonEmptyData)
      }
    },
    500,
  )

  // Notify parent when validity changes
  useEffect(() => {
    onValidChange(isValid)
  }, [isValid, onValidChange])

  // Notify parent when data changes and trigger debounced save
  useEffect(() => {
    const subscription = watch((data) => {
      onDataChange(data)

      // Skip the initial mount to avoid saving defaultValues immediately
      if (isInitialMount.current) {
        isInitialMount.current = false
        return
      }

      // Trigger debounced save to database
      debouncedSave(data)
    })
    return () => subscription.unsubscribe()
  }, [watch, onDataChange, debouncedSave])

  return (
    <FieldGroup>
      {/* Name Fields */}
      <div className="grid grid-cols-[1fr_4rem] gap-4">
        <Field data-invalid={!!errors.firstName}>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register('firstName')}
          />
          <FieldError>{errors.firstName?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.middleInitial}>
          <FieldLabel htmlFor="middleInitial">M.I.</FieldLabel>
          <Input
            id="middleInitial"
            type="text"
            maxLength={1}
            className="text-center uppercase"
            placeholder="A"
            {...register('middleInitial')}
          />
          <FieldError>{errors.middleInitial?.message}</FieldError>
        </Field>
      </div>
      <Field data-invalid={!!errors.lastName}>
        <FieldLabel htmlFor="lastName">Last name</FieldLabel>
        <Input
          id="lastName"
          type="text"
          placeholder="Doe"
          {...register('lastName')}
        />
        <FieldError>{errors.lastName?.message}</FieldError>
      </Field>

      {/* Age and Birthday */}
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.age}>
          <FieldLabel htmlFor="age">Age</FieldLabel>
          <Input
            id="age"
            type="number"
            min={1}
            max={150}
            placeholder="25"
            {...register('age', { valueAsNumber: true })}
          />
          <FieldError>{errors.age?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.birthday}>
          <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => {
              const dateValue = field.value
                ? parse(field.value, 'yyyy-MM-dd', new Date())
                : undefined
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthday"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? format(dateValue!, 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={dateValue}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )
            }}
          />
          <FieldError>{errors.birthday?.message}</FieldError>
        </Field>
      </div>

      {/* Gender and Marital Status */}
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.gender}>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.gender?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.maritalStatus}>
          <FieldLabel htmlFor="maritalStatus">Marital status</FieldLabel>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="maritalStatus" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.maritalStatus?.message}</FieldError>
        </Field>
      </div>

      {/* Phone Number */}
      <Field data-invalid={!!errors.phoneNumber}>
        <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInput
              id="phoneNumber"
              placeholder="908 899 1537"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError>{errors.phoneNumber?.message}</FieldError>
      </Field>
    </FieldGroup>
  )
}
