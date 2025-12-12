---
description: Create a new form with react-hook-form and Zod v4 validation
argument-hint: LoginForm email password - user authentication
---

# Create a New Form Component

Create a new validated form using react-hook-form with Zod v4 schema validation.

## Instructions

Based on the user's request "$ARGUMENTS", create a new form by:

1. **Parse the request:**
   - Extract form name (e.g., `LoginForm`, `UserForm`)
   - Identify fields and their types
   - Note any special requirements (description after `-`)

2. **Create the Zod schema** in `src/lib/schemas/{name}.ts`:
   - Use Zod v4 syntax with `error` parameter (not `message`)
   - Use `z.email()` for email fields (v4 top-level validator)
   - Use `z.url()` for URL fields
   - Export both schema and inferred type

3. **Create the form component** in `src/components/forms/{name}.tsx`:
   - Use `useForm` with `zodResolver`
   - Use existing Field components from `@/components/ui/field`
   - Add proper TypeScript types
   - Handle loading and error states

4. **Follow the skill guidelines** in `.claude/skills/react-hook-form-zod/SKILL.md`

## Zod v4 Requirements

Use Zod v4 syntax (NOT v3):

```typescript
// Correct v4 syntax
z.string({ error: 'Name is required' })
z.email({ error: 'Invalid email' })
z.string().min(8, { error: 'Minimum 8 characters' })

// Dynamic errors (v4 feature)
z.string({
  error: (issue) => (issue.input === undefined ? 'Required' : 'Invalid'),
})

// DON'T use deprecated v3 syntax
z.string({ message: 'Required' }) // deprecated
z.string().email() // use z.email() instead
```

## Field Type Mapping

| Argument                 | Zod Type                   | Input Type                        |
| ------------------------ | -------------------------- | --------------------------------- |
| email                    | `z.email()`                | `type="email"`                    |
| password                 | `z.string().min(8)`        | `type="password"`                 |
| name, title, text        | `z.string()`               | `type="text"`                     |
| age, count, number       | `z.number()`               | `type="number"` + `valueAsNumber` |
| url, website             | `z.url()`                  | `type="url"`                      |
| checkbox, agree, enabled | `z.boolean()`              | Checkbox component                |
| date                     | `z.string()` or `z.date()` | `type="date"`                     |
| select, role, status     | `z.enum([...])`            | Select component                  |

## Example Commands

- `/new-form LoginForm email password - user authentication`
- `/new-form ContactForm name email message - contact page form`
- `/new-form SettingsForm theme:select notifications:checkbox - user settings`
- `/new-form ProfileForm name bio:optional website:optional - edit profile`
- `/new-form RegisterForm email password confirmPassword - with password confirmation`

## Output Structure

```
src/
├── lib/
│   └── schemas/
│       └── {form-name}.ts    # Zod schema + types
└── components/
    └── forms/
        └── {form-name}.tsx   # Form component
```
