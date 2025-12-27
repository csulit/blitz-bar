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

interface ForgotPasswordEmailProps {
  resetLink: string
  userFirstName?: string
}

export function ForgotPasswordEmail({
  resetLink,
  userFirstName,
}: ForgotPasswordEmailProps) {
  const previewText = 'Reset your My Home Support password'

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
            <Heading style={heading}>Reset your password</Heading>
            <Text style={paragraph}>
              Hi{userFirstName ? ` ${userFirstName}` : ''},
            </Text>
            <Text style={paragraph}>
              We received a request to reset your password for your My Home
              Support account. Click the button below to choose a new password.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Reset password
              </Button>
            </Section>
            <Text style={paragraph}>
              This link will expire in 1 hour. If you didn&apos;t request a
              password reset, you can safely ignore this email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>
          </Section>
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} My Home Support. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#e0d4f5',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
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

export default ForgotPasswordEmail
