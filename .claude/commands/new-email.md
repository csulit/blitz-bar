---
description: Create a new React Email template with Resend integration
argument-hint: WelcomeEmail userName loginUrl - welcome new users
---

# Create a New Email Template

Create a new React Email template that matches the app's design system and integrates with Resend.

## Instructions

Based on the user's request "$ARGUMENTS", create a new email template by:

1. **Parse the request:**
   - Extract template name (e.g., `WelcomeEmail`, `InvitationEmail`)
   - Identify props/variables needed
   - Note the purpose (description after `-`)

2. **Create the email template** in `src/emails/{name}.tsx`:
   - Import components from `@react-email/components`
   - Use the app's design system colors and typography
   - Include preview text for email clients
   - Add fallback link below buttons
   - Export both named and default export

3. **Follow the skill guidelines** in `.claude/skills/react-email-templates/SKILL.md`

## Design System Requirements

Use these exact styles to match the app:

```typescript
// Colors
const main = { backgroundColor: '#e0d4f5' }           // Lavender background
const card = { backgroundColor: '#ffffff' }           // White card
const button = { backgroundColor: '#8b5cf6' }         // Purple button
const heading = { color: '#0f172a' }                  // Dark heading
const paragraph = { color: '#475569' }                // Body text
const link = { color: '#8b5cf6' }                     // Purple link
const footerText = { color: '#94a3b8' }               // Muted footer

// Typography
fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
heading: fontSize: '24px', fontWeight: '600'
paragraph: fontSize: '14px', lineHeight: '24px'
footer: fontSize: '12px'

// Spacing
card: padding: '40px', borderRadius: '12px'
button: padding: '12px 32px', borderRadius: '8px'
container: maxWidth: '480px'
```

## Prop Patterns

| Template Type   | Common Props                                |
| --------------- | ------------------------------------------- |
| Password Reset  | `resetLink`, `userFirstName`                |
| Welcome         | `userName`, `loginUrl`                      |
| Verification    | `verificationLink`, `userName`              |
| Notification    | `title`, `message`, `actionUrl`             |
| Invitation      | `inviterName`, `organizationName`, `inviteLink` |
| Receipt         | `orderNumber`, `items`, `total`             |

## Example Commands

- `/new-email WelcomeEmail userName loginUrl - welcome new users after signup`
- `/new-email VerificationEmail verificationLink userName - verify email address`
- `/new-email InvitationEmail inviterName orgName inviteLink - team invitation`
- `/new-email NotificationEmail title message actionUrl - generic notification`
- `/new-email ReceiptEmail orderNumber total - order confirmation`

## Template Structure

```tsx
// src/emails/{name}.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface {Name}EmailProps {
  // Props based on user request
}

export function {Name}Email({ ...props }: {Name}EmailProps) {
  const previewText = 'Preview text for email client'

  return (
    <Html>
      <Head>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');`}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={heading}>Title</Heading>
            {/* Content */}
            <Section style={buttonContainer}>
              <Button style={button} href={actionUrl}>
                Action
              </Button>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>Fallback link text</Text>
            <Link href={actionUrl} style={link}>{actionUrl}</Link>
          </Section>
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles (copy from skill file)
const main = { /* ... */ }
// ... all other styles

export default {Name}Email
```

## Output

Creates a single file:

```
src/emails/{template-name}.tsx
```

## Usage After Creation

Send the email using the Resend client:

```typescript
import { resend } from '@/lib/resend'
import { {Name}Email } from '@/emails/{name}'

await resend.emails.send({
  from: 'Acme Inc <noreply@acmeinc.com>',
  to: recipientEmail,
  subject: 'Email Subject',
  react: {Name}Email({ /* props */ }),
})
```
