import { useEffect } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  educationSchema,
  educationLevelOptions,
  educationLevelLabels,
  seniorHighTrackOptions,
  seniorHighTrackLabels,
  seniorHighStrandOptions,
  seniorHighStrandLabels,
  honorsOptions,
  honorsLabels,
  type EducationFormData,
} from '@/lib/schemas/education'

interface EducationFormProps {
  defaultValues?: Partial<EducationFormData>
  onValidChange: (isValid: boolean) => void
  onDataChange: (data: Partial<EducationFormData>) => void
}

export function EducationForm({
  defaultValues,
  onValidChange,
  onDataChange,
}: EducationFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      isCurrentlyEnrolled: false,
      ...defaultValues,
    },
  })

  const selectedLevel = useWatch({ control, name: 'level' })
  const isCurrentlyEnrolled = useWatch({ control, name: 'isCurrentlyEnrolled' })

  // Notify parent when validity changes
  useEffect(() => {
    onValidChange(isValid)
  }, [isValid, onValidChange])

  // Notify parent when data changes
  useEffect(() => {
    const subscription = watch((data) => {
      onDataChange(data)
    })
    return () => subscription.unsubscribe()
  }, [watch, onDataChange])

  const showDegreeField =
    selectedLevel === 'college' || selectedLevel === 'postgraduate'
  const showCourseField = selectedLevel === 'vocational'
  const showTrackStrandFields = selectedLevel === 'senior_high'
  const showHonorsField =
    selectedLevel && !isCurrentlyEnrolled && selectedLevel !== 'elementary'

  return (
    <FieldGroup>
      {/* Education Level */}
      <Field data-invalid={!!errors.level}>
        <FieldLabel htmlFor="level">Education level</FieldLabel>
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="level" className="w-full">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevelOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {educationLevelLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.level?.message}</FieldError>
      </Field>

      {/* School Name */}
      <Field data-invalid={!!errors.schoolName}>
        <FieldLabel htmlFor="schoolName">School name</FieldLabel>
        <Input
          id="schoolName"
          type="text"
          placeholder="Enter school name"
          {...register('schoolName')}
        />
        <FieldError>{errors.schoolName?.message}</FieldError>
      </Field>

      {/* School Address */}
      <Field data-invalid={!!errors.schoolAddress}>
        <FieldLabel htmlFor="schoolAddress">
          School address{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </FieldLabel>
        <Input
          id="schoolAddress"
          type="text"
          placeholder="City/Municipality, Province"
          {...register('schoolAddress')}
        />
        <FieldError>{errors.schoolAddress?.message}</FieldError>
      </Field>

      {/* Degree (for College/Postgraduate) */}
      {showDegreeField && (
        <Field data-invalid={!!errors.degree}>
          <FieldLabel htmlFor="degree">Degree</FieldLabel>
          <Input
            id="degree"
            type="text"
            placeholder="e.g., Bachelor of Science in Computer Science"
            {...register('degree')}
          />
          <FieldError>{errors.degree?.message}</FieldError>
        </Field>
      )}

      {/* Course (for Vocational) */}
      {showCourseField && (
        <Field data-invalid={!!errors.course}>
          <FieldLabel htmlFor="course">Course / Program</FieldLabel>
          <Input
            id="course"
            type="text"
            placeholder="e.g., Computer Systems Servicing NC II"
            {...register('course')}
          />
          <FieldError>{errors.course?.message}</FieldError>
        </Field>
      )}

      {/* Track and Strand (for Senior High) */}
      {showTrackStrandFields && (
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.track}>
            <FieldLabel htmlFor="track">Track</FieldLabel>
            <Controller
              name="track"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="track" className="w-full">
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    {seniorHighTrackOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {seniorHighTrackLabels[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.track?.message}</FieldError>
          </Field>
          <Field data-invalid={!!errors.strand}>
            <FieldLabel htmlFor="strand">Strand</FieldLabel>
            <Controller
              name="strand"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="strand" className="w-full">
                    <SelectValue placeholder="Select strand" />
                  </SelectTrigger>
                  <SelectContent>
                    {seniorHighStrandOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {seniorHighStrandLabels[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.strand?.message}</FieldError>
          </Field>
        </div>
      )}

      {/* Year Started and Year Graduated */}
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.yearStarted}>
          <FieldLabel htmlFor="yearStarted">Year started</FieldLabel>
          <Input
            id="yearStarted"
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            placeholder="e.g., 2018"
            {...register('yearStarted')}
          />
          <FieldError>{errors.yearStarted?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.yearGraduated}>
          <FieldLabel htmlFor="yearGraduated">
            Year graduated{' '}
            {isCurrentlyEnrolled && (
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            )}
          </FieldLabel>
          <Input
            id="yearGraduated"
            type="number"
            min={1900}
            max={new Date().getFullYear() + 10}
            placeholder={isCurrentlyEnrolled ? 'Expected year' : 'e.g., 2022'}
            disabled={isCurrentlyEnrolled}
            {...register('yearGraduated')}
          />
          <FieldError>{errors.yearGraduated?.message}</FieldError>
        </Field>
      </div>

      {/* Currently Enrolled */}
      <div className="flex items-center gap-3">
        <Controller
          name="isCurrentlyEnrolled"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isCurrentlyEnrolled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor="isCurrentlyEnrolled"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          I am currently enrolled in this school
        </label>
      </div>

      {/* Honors */}
      {showHonorsField && (
        <Field data-invalid={!!errors.honors}>
          <FieldLabel htmlFor="honors">
            Honors / Awards{' '}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </FieldLabel>
          <Controller
            name="honors"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="honors" className="w-full">
                  <SelectValue placeholder="Select honors (if any)" />
                </SelectTrigger>
                <SelectContent>
                  {honorsOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {honorsLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.honors?.message}</FieldError>
        </Field>
      )}
    </FieldGroup>
  )
}
