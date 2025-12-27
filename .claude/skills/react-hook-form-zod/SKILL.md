---
name: react-hook-form-zod
description: Create interactive forms with react-hook-form and Zod v4 validation. Use when building forms with validation, handling form state, or integrating form submissions with TanStack Query mutations.
---

# React Hook Form + Zod v4 Forms

This skill provides guidelines for creating validated, interactive forms using react-hook-form with Zod v4 schema validation.

## Key Dependencies

- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolvers (including Zod)
- `zod` (v4+) - Schema validation

## Resolver Import

Import the resolver from `@hookform/resolvers/zod`:

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
```

## Directory Structure

Organize form-related code:

```
src/
├── lib/
│   └── schemas/           # Zod schemas
│       ├── auth.ts
│       └── user.ts
├── components/
│   ├── forms/             # Form components
│   │   ├── login-form.tsx
│   │   └── user-form.tsx
│   └── ui/
│       └── field.tsx      # Field components (already exists)
```

## Zod v4 Schema Patterns

### Important v4 Changes

Zod v4 has significant changes from v3:

1. **`error` replaces `message`** - Use `error` param for custom messages
2. **`error` accepts functions** - Dynamic error messages based on context
3. **Top-level validators** - `z.email()` instead of `z.string().email()`
4. **Unified error API** - `error` replaces both `message` and `errorMap`

### Basic Schema

```typescript
// src/lib/schemas/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(2, {
    error: 'Name must be at least 2 characters',
  }),
  email: z.email({ error: 'Invalid email address' }),
  age: z.number({ error: 'Age must be a number' }).min(18, {
    error: 'Must be at least 18 years old',
  }),
})

export type UserFormData = z.infer<typeof userSchema>
```

### Schema with Dynamic Errors (v4 Pattern)

```typescript
// src/lib/schemas/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? 'Email is required' : 'Invalid email format',
  }),
  password: z.string().min(8, {
    error: (issue) => {
      if (issue.code === 'too_small') {
        return `Password must be at least ${issue.minimum} characters`
      }
      return 'Invalid password'
    },
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

### Optional Fields with Defaults

```typescript
import { z } from 'zod'

export const profileSchema = z.object({
  displayName: z.string().min(1, { error: 'Display name is required' }),
  bio: z.string().optional().default(''),
  website: z.url({ error: 'Invalid URL' }).optional().or(z.literal('')),
  notificationsEnabled: z.boolean().default(true),
})

export type ProfileFormData = z.infer<typeof profileSchema>
```

### Refinements and Transforms

```typescript
import { z } from 'zod'

export const registrationSchema = z
  .object({
    email: z.email({ error: 'Invalid email' }),
    password: z.string().min(8, { error: 'Minimum 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegistrationFormData = z.infer<typeof registrationSchema>
```

## Form Component Pattern

### Basic Form with Field Components

```typescript
// src/components/forms/user-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormData } from '@/lib/schemas/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'

interface UserFormProps {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => void | Promise<void>
  isLoading?: boolean
}

export function UserForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="Enter your name"
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
          />
          <FieldDescription>We'll never share your email.</FieldDescription>
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.age}>
          <FieldLabel htmlFor="age">Age</FieldLabel>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
          />
          <FieldError>{errors.age?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </FieldGroup>
    </form>
  )
}
```

### Form with TanStack Query Mutation

```typescript
// src/components/forms/create-user-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { userSchema, type UserFormData } from '@/lib/schemas/user'
import { useCreateUser } from '@/hooks/mutations/use-create-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'

export function CreateUserForm() {
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser.mutateAsync(data)
      toast.success('User created successfully')
      reset()
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={createUser.isPending}>
          {createUser.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </FieldGroup>
    </form>
  )
}
```

### Controlled Components with Controller

```typescript
// src/components/forms/settings-form.tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    error: 'Please select a theme',
  }),
  notifications: z.boolean().default(false),
  language: z.string().min(1, { error: 'Please select a language' }),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme: 'system',
      notifications: false,
      language: '',
    },
  })

  const onSubmit = (data: SettingsFormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.theme}>
          <FieldLabel>Theme</FieldLabel>
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.theme?.message}</FieldError>
        </Field>

        <Field orientation="horizontal">
          <Controller
            name="notifications"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="notifications"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
        </Field>

        <Button type="submit">Save Settings</Button>
      </FieldGroup>
    </form>
  )
}
```

## Form Hooks Pattern

### Custom Form Hook with Mutation

```typescript
// src/hooks/forms/use-user-form.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormData } from '@/lib/schemas/user'
import { useCreateUser } from '@/hooks/mutations/use-create-user'
import { useUpdateUser } from '@/hooks/mutations/use-update-user'

interface UseUserFormOptions {
  mode: 'create' | 'edit'
  userId?: string
  defaultValues?: Partial<UserFormData>
  onSuccess?: () => void
}

export function useUserForm({
  mode,
  userId,
  defaultValues,
  onSuccess,
}: UseUserFormOptions) {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const mutation = mode === 'create' ? createUser : updateUser

  const onSubmit = form.handleSubmit(async (data) => {
    if (mode === 'edit' && userId) {
      await updateUser.mutateAsync({ id: userId, ...data })
    } else {
      await createUser.mutateAsync(data)
    }
    onSuccess?.()
  })

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
```

## Best Practices

### 1. Schema Organization

- Keep schemas in `src/lib/schemas/`
- Export both schema and inferred type
- Use descriptive error messages

### 2. Zod v4 Error Messages

```typescript
// DO: Use the new error parameter
z.string({ error: 'Required' })
z.string().min(5, { error: 'Too short' })

// DO: Use error functions for dynamic messages
z.string({
  error: (issue) => (issue.input === undefined ? 'Required' : 'Invalid'),
})

// DON'T: Use deprecated message parameter
z.string({ message: 'Required' }) // deprecated in v4
```

### 3. Form State

- Use `formState.errors` for displaying errors
- Use `formState.isSubmitting` or mutation `isPending` for loading states
- Use `reset()` after successful submission

### 4. Validation Timing

```typescript
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur
  // mode: 'onChange', // Validate on every change
  // mode: 'onSubmit', // Only validate on submit (default)
})
```

### 5. Field Registration

```typescript
// Simple fields
<Input {...register('name')} />

// Number fields
<Input type="number" {...register('age', { valueAsNumber: true })} />

// Checkbox fields
<Input type="checkbox" {...register('agree')} />

// Controlled components (Select, Checkbox, etc.)
<Controller
  name="theme"
  control={control}
  render={({ field }) => <Select {...field} />}
/>
```

### 6. Watching Field Values

Use `useWatch` instead of `watch` for better performance. `useWatch` isolates re-renders to only when watched values change, while `watch` causes the entire form to re-render.

```typescript
import { useForm, useWatch } from 'react-hook-form'

function MyForm() {
  const { control, register } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { level: '', isStudent: false },
  })

  // Preferred: useWatch for conditional rendering
  const selectedLevel = useWatch({ control, name: 'level' })
  const isStudent = useWatch({ control, name: 'isStudent' })

  // Watch multiple fields
  const [firstName, lastName] = useWatch({
    control,
    name: ['firstName', 'lastName'],
  })

  return (
    <form>
      {/* Conditional fields based on watched values */}
      {selectedLevel === 'college' && (
        <Input {...register('degree')} placeholder="Degree" />
      )}
      {isStudent && (
        <Input {...register('studentId')} placeholder="Student ID" />
      )}
    </form>
  )
}
```

### 7. Error Display

```typescript
// Using the Field components
<Field data-invalid={!!errors.name}>
  <FieldLabel>Name</FieldLabel>
  <Input {...register('name')} />
  <FieldError>{errors.name?.message}</FieldError>
</Field>

// With FieldError errors prop (for field arrays)
<FieldError errors={[errors.items?.[0]?.name]} />
```

### 8. Server-Side Validation

For forms that submit to server functions:

```typescript
const onSubmit = async (data: FormData) => {
  const result = await serverAction(data)

  if (result.errors) {
    // Set server-side errors
    Object.entries(result.errors).forEach(([field, message]) => {
      form.setError(field as keyof FormData, { message })
    })
    return
  }

  // Success handling
  toast.success('Saved!')
}
```

## Common Patterns

### Password Confirmation

```typescript
const schema = z
  .object({
    password: z.string().min(8, { error: 'Minimum 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords must match',
    path: ['confirmPassword'],
  })
```

### Optional URL Field

```typescript
const schema = z.object({
  website: z.url({ error: 'Invalid URL' }).optional().or(z.literal('')),
})
```

### Enum with Custom Messages

```typescript
const schema = z.object({
  role: z.enum(['admin', 'user', 'guest'], {
    error: (issue) => {
      if (issue.code === 'invalid_value') {
        return `Must be one of: ${issue.expected.join(', ')}`
      }
      return 'Invalid role'
    },
  }),
})
```

### Array of Items (Field Arrays)

```typescript
import { useFieldArray } from 'react-hook-form'

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(1, { error: 'Name required' }),
      quantity: z.number().min(1, { error: 'Must be at least 1' }),
    })
  ),
})

function ItemsForm() {
  const { control, register } = useForm({
    resolver: zodResolver(schema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Input {...register(`items.${index}.name`)} />
          <Input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          />
          <Button type="button" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({ name: '', quantity: 1 })}>
        Add Item
      </Button>
    </>
  )
}
```

## After Implementation

Use the `dev-ops` subagent to validate new forms:

```
Use the dev-ops subagent to run pnpm check and pnpm test
```
