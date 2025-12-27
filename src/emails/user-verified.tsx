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

interface UserVerifiedEmailProps {
  userFirstName?: string
  loginUrl: string
}

export function UserVerifiedEmail({
  userFirstName,
  loginUrl,
}: UserVerifiedEmailProps) {
  const previewText =
    'Your account has been verified - you can now start using My Home Support'

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
            <Heading style={heading}>Account verified</Heading>
            <Text style={paragraph}>
              Hi{userFirstName ? ` ${userFirstName}` : ''},
            </Text>
            <Text style={paragraph}>
              Great news! Your My Home Support account has been verified by an
              administrator. You now have full access to all features and can
              start using the app.
            </Text>
            <Text style={paragraph}>
              Log in now to explore everything My Home Support has to offer.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Get started
              </Button>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={loginUrl} style={link}>
              {loginUrl}
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

export default UserVerifiedEmail
