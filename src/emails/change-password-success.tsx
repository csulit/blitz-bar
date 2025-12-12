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

interface ChangePasswordSuccessEmailProps {
  userName?: string
  loginUrl?: string
}

export function ChangePasswordSuccessEmail({
  userName,
  loginUrl,
}: ChangePasswordSuccessEmailProps) {
  const previewText = 'Your password has been changed successfully'

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
            <Section style={iconContainer}>
              <Text style={checkIcon}>✓</Text>
            </Section>
            <Heading style={heading}>Password Changed</Heading>
            <Text style={paragraph}>Hi{userName ? ` ${userName}` : ''},</Text>
            <Text style={paragraph}>
              Your password has been successfully updated. You can now use your
              new password to sign in to your account.
            </Text>
            {loginUrl && (
              <Section style={buttonContainer}>
                <Button style={button} href={loginUrl}>
                  Sign in to your account
                </Button>
              </Section>
            )}
            <Section style={warningCard}>
              <Text style={warningText}>
                If you didn&apos;t make this change, please contact our support
                team immediately and secure your account.
              </Text>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              For security reasons, we recommend using a strong, unique password
              that you don&apos;t use on other websites.
            </Text>
            {loginUrl && (
              <>
                <Text style={footer}>Sign in at:</Text>
                <Link href={loginUrl} style={link}>
                  {loginUrl}
                </Link>
              </>
            )}
          </Section>
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
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

const iconContainer = {
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
}

const checkIcon = {
  backgroundColor: '#dcfce7',
  color: '#16a34a',
  fontSize: '24px',
  fontWeight: '600',
  width: '48px',
  height: '48px',
  lineHeight: '48px',
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0',
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

const warningCard = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
}

const warningText = {
  color: '#991b1b',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
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

export default ChangePasswordSuccessEmail
