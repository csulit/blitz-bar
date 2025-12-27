import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface UserDeactivatedEmailProps {
  userFirstName?: string
}

export function UserDeactivatedEmail({
  userFirstName,
}: UserDeactivatedEmailProps) {
  const previewText = 'Your My Home Support account has been deactivated'

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
            <Heading style={heading}>Account deactivated</Heading>
            <Text style={paragraph}>
              Hi{userFirstName ? ` ${userFirstName}` : ''},
            </Text>
            <Text style={paragraph}>
              Your My Home Support account has been deactivated.
            </Text>
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

const footerText = {
  color: '#94a3b8',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '24px 0 0 0',
}

export default UserDeactivatedEmail
