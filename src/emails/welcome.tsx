import {
  Body,
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

interface WelcomeEmailProps {
  userName?: string
  loginUrl?: string
}

export function WelcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  const previewText = 'Welcome to My Home Support - Your account is being verified'

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
            <Heading style={heading}>Welcome to My Home Support!</Heading>
            <Text style={paragraph}>Hi{userName ? ` ${userName}` : ''},</Text>
            <Text style={paragraph}>
              Thank you for signing up! We&apos;re excited to have you on board.
            </Text>
            <Section style={statusCard}>
              <Text style={statusHeading}>Account Status</Text>
              <Text style={statusText}>
                Your account is currently{' '}
                <span style={statusBadge}>Under Verification</span>
              </Text>
            </Section>
            <Text style={paragraph}>
              Our team is reviewing your account details to ensure everything is
              in order. This process typically takes 1-2 business days.
            </Text>
            <Text style={paragraph}>Here&apos;s what happens next:</Text>
            <Section style={listContainer}>
              <Text style={listItem}>
                <span style={bullet}>1.</span> We verify your account
                information
              </Text>
              <Text style={listItem}>
                <span style={bullet}>2.</span> You&apos;ll receive a
                confirmation email once approved
              </Text>
              <Text style={listItem}>
                <span style={bullet}>3.</span> You can then access all features
                of your account
              </Text>
            </Section>
            <Text style={paragraph}>
              In the meantime, you can explore our platform with limited access.
              If you have any questions, feel free to reach out to our support
              team.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              If you didn&apos;t create an account with My Home Support, please ignore
              this email or contact our support team.
            </Text>
            {loginUrl && (
              <>
                <Text style={footer}>You can access your account at:</Text>
                <Link href={loginUrl} style={link}>
                  {loginUrl}
                </Link>
              </>
            )}
          </Section>
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} My Home Support. All rights reserved.
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

const statusCard = {
  backgroundColor: '#faf5ff',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const statusHeading = {
  color: '#0f172a',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
}

const statusText = {
  color: '#475569',
  fontSize: '14px',
  margin: '0',
}

const statusBadge = {
  backgroundColor: '#fef3c7',
  color: '#92400e',
  fontSize: '12px',
  fontWeight: '500',
  padding: '4px 8px',
  borderRadius: '4px',
}

const listContainer = {
  margin: '0 0 16px 0',
}

const listItem = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  paddingLeft: '8px',
}

const bullet = {
  color: '#8b5cf6',
  fontWeight: '600',
  marginRight: '8px',
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

export default WelcomeEmail
