---
name: react-email-templates
description: Create email templates with React Email and send via Resend. Use when building transactional emails like password reset, welcome, notifications, or any email that needs to match the app's design system.
---

# React Email Templates with Resend

This skill provides guidelines for creating beautiful, responsive email templates using React Email components and sending them via Resend.

## Key Dependencies

- `resend` - Email delivery service
- `@react-email/components` - React components for email templates

## Directory Structure

```
src/
├── lib/
│   └── resend.ts           # Resend client instance
├── emails/                  # Email templates
│   ├── forgot-password.tsx
│   ├── welcome.tsx
│   └── notification.tsx
└── env.ts                   # RESEND_API_KEY config
```

## Resend Client Setup

The Resend client is configured in `src/lib/resend.ts`:

```typescript
import { Resend } from 'resend'
import { env } from '@/env'

export const resend = new Resend(env.RESEND_API_KEY)
```

## Design System

All email templates should match the app's design aesthetic:

### Colors

| Element        | Color     | Usage                          |
| -------------- | --------- | ------------------------------ |
| Background     | `#e0d4f5` | Light purple/lavender          |
| Card           | `#ffffff` | White container                |
| Primary Button | `#8b5cf6` | Purple action buttons          |
| Heading        | `#0f172a` | Dark slate for titles          |
| Body Text      | `#475569` | Slate gray for paragraphs      |
| Muted Text     | `#64748b` | Lighter gray for secondary     |
| Footer Text    | `#94a3b8` | Light gray for copyright       |
| Link           | `#8b5cf6` | Purple for links               |
| Border/HR      | `#e2e8f0` | Light gray for dividers        |

### Typography

- **Font Family**: Inter (via Google Fonts import)
- **Heading Size**: 24px, font-weight 600
- **Body Size**: 14px, line-height 24px
- **Footer Size**: 12px

### Spacing

- **Card Padding**: 40px
- **Card Border Radius**: 12px
- **Button Padding**: 12px 32px
- **Button Border Radius**: 8px
- **Section Margin**: 24px

## Email Template Pattern

### Basic Template Structure

```tsx
// src/emails/example.tsx
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

interface ExampleEmailProps {
  userName?: string
  actionUrl: string
}

export function ExampleEmail({ userName, actionUrl }: ExampleEmailProps) {
  const previewText = 'Preview text shown in email clients'

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          `}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={heading}>Email Title</Heading>
            <Text style={paragraph}>
              Hi{userName ? ` ${userName}` : ''},
            </Text>
            <Text style={paragraph}>
              Your email content goes here.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={actionUrl}>
                Action Button
              </Button>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              If the button doesn&apos;t work, copy this link:
            </Text>
            <Link href={actionUrl} style={link}>
              {actionUrl}
            </Link>
          </Section>
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles matching app design system
const main = {
  backgroundColor: '#e0d4f5',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}

const container = {
  margin: '0 auto',
  maxWidth: '480px',
}

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const heading = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
}

const paragraph = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#8b5cf6',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 32px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
}

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 0 8px 0',
}

const link = {
  color: '#8b5cf6',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
}

const footerText = {
  color: '#94a3b8',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '24px 0 0 0',
}

export default ExampleEmail
```

## Sending Emails

### From Better Auth Hooks

```typescript
// src/lib/auth.ts
import { resend } from '@/lib/resend'
import { ForgotPasswordEmail } from '@/emails/forgot-password'

export const auth = betterAuth({
  emailAndPassword: {
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Acme Inc <noreply@acmeinc.com>',
        to: user.email,
        subject: 'Reset your password',
        react: ForgotPasswordEmail({
          resetLink: url,
          userFirstName: user.name?.split(' ')[0],
        }),
      })
    },
  },
})
```

### From Server Functions

```typescript
// src/server/send-welcome-email.ts
import { createServerFn } from '@tanstack/react-start'
import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/emails/welcome'

export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .validator((data: { email: string; name: string }) => data)
  .handler(async ({ data }) => {
    await resend.emails.send({
      from: 'Acme Inc <noreply@acmeinc.com>',
      to: data.email,
      subject: 'Welcome to Acme Inc!',
      react: WelcomeEmail({ userName: data.name }),
    })

    return { success: true }
  })
```

## Common Email Templates

### Password Reset

Props: `resetLink`, `userFirstName`
Use case: Forgot password flow

### Welcome Email

Props: `userName`, `loginUrl`
Use case: After user registration

### Email Verification

Props: `verificationLink`, `userName`
Use case: Verify email address

### Notification

Props: `title`, `message`, `actionUrl`, `actionLabel`
Use case: Generic notifications

### Invitation

Props: `inviterName`, `organizationName`, `inviteLink`
Use case: Team/org invitations

## Available Components

From `@react-email/components`:

| Component   | Usage                             |
| ----------- | --------------------------------- |
| `Html`      | Root element                      |
| `Head`      | Document head (styles, fonts)     |
| `Preview`   | Preview text for email clients    |
| `Body`      | Email body wrapper                |
| `Container` | Centered content container        |
| `Section`   | Group related content             |
| `Heading`   | h1-h6 headings                    |
| `Text`      | Paragraph text                    |
| `Button`    | CTA buttons with href             |
| `Link`      | Hyperlinks                        |
| `Hr`        | Horizontal rule/divider           |
| `Img`       | Images (use absolute URLs)        |
| `Row`       | Flex row for layouts              |
| `Column`    | Columns within Row                |

## Best Practices

### 1. Always Include Preview Text

```tsx
<Preview>Short preview text shown in inbox</Preview>
```

### 2. Use Inline Styles

Email clients strip `<style>` tags. Use inline styles for everything except font imports.

### 3. Provide Fallback Links

Always include a plain text URL below buttons:

```tsx
<Button href={url}>Click Here</Button>
<Hr />
<Text>Or copy this link: {url}</Text>
```

### 4. Keep Width Under 600px

Most email clients display at max 600px width. Use `maxWidth: '480px'` or `maxWidth: '560px'`.

### 5. Test Across Clients

Test emails in:
- Gmail (web & mobile)
- Outlook (desktop & web)
- Apple Mail
- Yahoo Mail

### 6. Use Absolute URLs for Images

```tsx
<Img src="https://yourdomain.com/logo.png" alt="Logo" />
```

### 7. Default Export

Always include a default export for the email preview:

```tsx
export default ExampleEmail
```

## Environment Variables

Required in `.env`:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

For development, use `onboarding@resend.dev` as the from address (only sends to your own email).

For production, verify your domain in the Resend dashboard.
