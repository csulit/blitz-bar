import { useEffect, useRef } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Trash2 } from 'lucide-react'
import { useUpdateJobHistory } from './hooks/mutations/use-update-job-history'
import type { JobHistoryFormData } from '@/lib/schemas/job-history'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  jobHistorySchema,
  monthLabels,
  monthOptions,
  yearOptions,
} from '@/lib/schemas/job-history'

interface JobHistoryFormProps {
  defaultValues?: JobHistoryFormData
  onValidChange: (isValid: boolean) => void
  onDataChange: (data: JobHistoryFormData) => void
}

const emptyJob = {
  companyName: '',
  position: '',
  startMonth: '',
  endMonth: '',
  isCurrentJob: false,
  summary: '',
}

export function JobHistoryForm({
  defaultValues,
  onValidChange,
  onDataChange,
}: JobHistoryFormProps) {
  const {
    register,
    control,
    formState: { errors, isValid },
  } = useForm<JobHistoryFormData>({
    resolver: zodResolver(jobHistorySchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? { jobs: [emptyJob] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobs',
  })

  const formData = useWatch({ control })
  const { mutate: saveJobHistory } = useUpdateJobHistory()
  const isInitialMount = useRef(true)

  // Debounced save function - 500ms delay
  const debouncedSave = useDebouncedCallback((data: JobHistoryFormData) => {
    // Only save if we have at least one job with data
    const hasData = data.jobs.some(
      (job) => job.companyName || job.position || job.summary,
    )

    if (hasData) {
      saveJobHistory(data)
    }
  }, 500)

  // Notify parent when validity changes
  useEffect(() => {
    onValidChange(isValid)
  }, [isValid, onValidChange])

  // Notify parent when data changes and trigger debounced save
  useEffect(() => {
    const data = formData as JobHistoryFormData
    onDataChange(data)

    // Skip the initial mount to avoid saving defaultValues immediately
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Trigger debounced save to database
    debouncedSave(data)
  }, [formData, onDataChange, debouncedSave])

  const addJob = () => {
    append(emptyJob)
  }

  const removeJob = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const jobErrors = errors.jobs?.[index]
        const isCurrentJob = formData.jobs?.[index]?.isCurrentJob

        return (
          <div key={field.id} className="space-y-4">
            {/* Separator between jobs (only if not first job) */}
            {index > 0 && <div className="border-t border-border pt-6 mt-2" />}

            {/* Header with job number and remove button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Job {index + 1}
              </span>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeJob(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <FieldGroup>
              {/* Company Name */}
              <Field data-invalid={!!jobErrors?.companyName}>
                <FieldLabel htmlFor={`jobs.${index}.companyName`}>
                  Company / Employer / Agency name
                </FieldLabel>
                <Input
                  id={`jobs.${index}.companyName`}
                  type="text"
                  placeholder="e.g., Acme Corporation"
                  {...register(`jobs.${index}.companyName`)}
                />
                <FieldError>{jobErrors?.companyName?.message}</FieldError>
              </Field>

              {/* Position */}
              <Field data-invalid={!!jobErrors?.position}>
                <FieldLabel htmlFor={`jobs.${index}.position`}>
                  Position / Designation
                </FieldLabel>
                <Input
                  id={`jobs.${index}.position`}
                  type="text"
                  placeholder="e.g., Software Developer"
                  {...register(`jobs.${index}.position`)}
                />
                <FieldError>{jobErrors?.position?.message}</FieldError>
              </Field>

              {/* Start Date (Month & Year) */}
              <Field data-invalid={!!jobErrors?.startMonth}>
                <FieldLabel>Start date</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name={`jobs.${index}.startMonth`}
                    control={control}
                    render={({ field: startField }) => {
                      const [year, month] = (startField.value || '').split('-')
                      return (
                        <>
                          <Select
                            value={month || ''}
                            onValueChange={(newMonth) => {
                              const newValue = year
                                ? `${year}-${newMonth}`
                                : `${new Date().getFullYear()}-${newMonth}`
                              startField.onChange(newValue)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {monthOptions.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {monthLabels[m]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={year || ''}
                            onValueChange={(newYear) => {
                              const newValue = month
                                ? `${newYear}-${month}`
                                : `${newYear}-01`
                              startField.onChange(newValue)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={y}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )
                    }}
                  />
                </div>
                <FieldError>{jobErrors?.startMonth?.message}</FieldError>
              </Field>

              {/* End Date (Month & Year) */}
              <Field data-invalid={!!jobErrors?.endMonth}>
                <FieldLabel>
                  End date{' '}
                  {isCurrentJob && (
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  )}
                </FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name={`jobs.${index}.endMonth`}
                    control={control}
                    render={({ field: endField }) => {
                      const [year, month] = (endField.value || '').split('-')
                      return (
                        <>
                          <Select
                            value={month || ''}
                            onValueChange={(newMonth) => {
                              const newValue = year
                                ? `${year}-${newMonth}`
                                : `${new Date().getFullYear()}-${newMonth}`
                              endField.onChange(newValue)
                            }}
                            disabled={isCurrentJob}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {monthOptions.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {monthLabels[m]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={year || ''}
                            onValueChange={(newYear) => {
                              const newValue = month
                                ? `${newYear}-${month}`
                                : `${newYear}-01`
                              endField.onChange(newValue)
                            }}
                            disabled={isCurrentJob}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {yearOptions.map((y) => (
                                <SelectItem key={y} value={y}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )
                    }}
                  />
                </div>
                <FieldError>{jobErrors?.endMonth?.message}</FieldError>
              </Field>

              {/* Currently Working Here */}
              <div className="flex items-center gap-3">
                <Controller
                  name={`jobs.${index}.isCurrentJob`}
                  control={control}
                  render={({ field: checkboxField }) => (
                    <Checkbox
                      id={`jobs.${index}.isCurrentJob`}
                      checked={checkboxField.value}
                      onCheckedChange={checkboxField.onChange}
                    />
                  )}
                />
                <label
                  htmlFor={`jobs.${index}.isCurrentJob`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  I am currently working here
                </label>
              </div>

              {/* Job Summary */}
              <Field data-invalid={!!jobErrors?.summary}>
                <FieldLabel htmlFor={`jobs.${index}.summary`}>
                  Job summary
                </FieldLabel>
                <Textarea
                  id={`jobs.${index}.summary`}
                  placeholder="Briefly describe your role and responsibilities..."
                  rows={3}
                  maxLength={500}
                  {...register(`jobs.${index}.summary`)}
                />
                <div className="flex justify-between">
                  <FieldError>{jobErrors?.summary?.message}</FieldError>
                  <span className="text-xs text-muted-foreground">
                    {formData.jobs?.[index]?.summary?.length || 0}/500
                  </span>
                </div>
              </Field>
            </FieldGroup>
          </div>
        )
      })}

      {/* Add Job Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addJob}
        className="w-full"
      >
        <Plus className="size-4 mr-2" />
        Add another job
      </Button>
    </div>
  )
}
