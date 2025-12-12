import { createFileRoute, Link } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      {
        title: 'Privacy Policy | Acme Inc',
      },
      {
        name: 'description',
        content:
          'Privacy Policy for Acme Inc - Learn how we collect, use, and protect your data.',
      },
    ],
  }),
})

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-1/4 w-150 h-150 bg-chart-2/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-125 h-125 bg-chart-3/5 rounded-full blur-3xl translate-y-1/2" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-lg tracking-tight hover:text-primary transition-colors"
          >
            Acme Inc
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2 border border-chart-2/20">
              Privacy
            </span>
            <span className="text-sm text-muted-foreground">
              Effective December 12, 2025
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Your privacy matters to us. This policy explains how we collect,
            use, share, and protect your personal information when you use our
            services.
          </p>
        </div>
      </header>

      {/* Quick Summary Card */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-linear-to-br from-card to-accent/30 border border-border/50 backdrop-blur-sm">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Privacy at a Glance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-display text-primary mb-1">
                  Minimal
                </div>
                <p className="text-sm text-muted-foreground">
                  We only collect data essential for providing our services
                </p>
              </div>
              <div>
                <div className="text-2xl font-display text-primary mb-1">
                  Secure
                </div>
                <p className="text-sm text-muted-foreground">
                  Industry-standard encryption protects your information
                </p>
              </div>
              <div>
                <div className="text-2xl font-display text-primary mb-1">
                  Yours
                </div>
                <p className="text-sm text-muted-foreground">
                  You control your data with full export and deletion rights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <aside className="mb-16 p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm">
            <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Contents
            </h2>
            <nav className="grid md:grid-cols-2 gap-2">
              {[
                { num: '01', title: 'Information We Collect' },
                { num: '02', title: 'How We Use Your Information' },
                { num: '03', title: 'Information Sharing' },
                { num: '04', title: 'Data Security' },
                { num: '05', title: 'Cookies & Tracking' },
                { num: '06', title: 'Your Rights & Choices' },
                { num: '07', title: 'Data Retention' },
                { num: '08', title: "Children's Privacy" },
                { num: '09', title: 'International Transfers' },
                { num: '10', title: 'Contact Us' },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#privacy-${item.num}`}
                  className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-xs font-mono text-chart-2">
                    {item.num}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.title}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Sections */}
          <article className="space-y-16">
            <Section id="privacy-01" number="01" title="Information We Collect">
              <p>
                We collect information to provide and improve our services. The
                types of information we collect include:
              </p>

              <Subsection title="Information You Provide">
                <p>
                  When you create an account, make a purchase, or contact us,
                  you may provide personal information such as your name, email
                  address, phone number, billing address, and payment
                  information.
                </p>
              </Subsection>

              <Subsection title="Automatically Collected Information">
                <p>
                  When you use our services, we automatically collect certain
                  information, including your IP address, device type, browser
                  type, operating system, referring URLs, pages viewed, and the
                  dates and times of your visits.
                </p>
              </Subsection>

              <Subsection title="Information from Third Parties">
                <p>
                  We may receive information about you from third parties, such
                  as social media platforms, marketing partners, and public
                  databases, to supplement the information we collect directly
                  from you.
                </p>
              </Subsection>
            </Section>

            <Section
              id="privacy-02"
              number="02"
              title="How We Use Your Information"
            >
              <p>
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-none space-y-3 mt-4">
                {[
                  'Providing, maintaining, and improving our services',
                  'Processing transactions and sending related information',
                  'Sending promotional communications (with your consent)',
                  'Responding to your comments, questions, and requests',
                  'Monitoring and analyzing trends, usage, and activities',
                  'Detecting, investigating, and preventing fraudulent transactions',
                  'Personalizing and improving your experience',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-chart-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="privacy-03" number="03" title="Information Sharing">
              <p>
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>

              <Subsection title="Service Providers">
                <p>
                  We share information with third-party vendors, consultants,
                  and service providers who perform services on our behalf, such
                  as payment processing, data analysis, email delivery, hosting,
                  and customer service.
                </p>
              </Subsection>

              <Subsection title="Legal Requirements">
                <p>
                  We may disclose information if required to do so by law or in
                  response to valid requests by public authorities, such as
                  court orders or subpoenas.
                </p>
              </Subsection>

              <Subsection title="Business Transfers">
                <p>
                  In connection with any merger, acquisition, or sale of company
                  assets, your information may be transferred as part of the
                  transaction, subject to standard confidentiality agreements.
                </p>
              </Subsection>
            </Section>

            <Section id="privacy-04" number="04" title="Data Security">
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. These measures
                include:
              </p>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: '🔐',
                    title: 'Encryption',
                    desc: 'All data encrypted in transit and at rest',
                  },
                  {
                    icon: '🛡️',
                    title: 'Access Controls',
                    desc: 'Strict role-based access policies',
                  },
                  {
                    icon: '🔍',
                    title: 'Monitoring',
                    desc: 'Continuous security monitoring',
                  },
                  {
                    icon: '📋',
                    title: 'Audits',
                    desc: 'Regular security assessments',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl bg-accent/50 border border-border/50"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-medium mb-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6">
                While we strive to protect your personal information, no method
                of transmission over the internet or electronic storage is 100%
                secure. We cannot guarantee absolute security.
              </p>
            </Section>

            <Section id="privacy-05" number="05" title="Cookies & Tracking">
              <p>
                We use cookies and similar tracking technologies to collect and
                store information about your interactions with our services. You
                can control cookies through your browser settings.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-border/50">
                <table className="w-full text-sm">
                  <thead className="bg-accent/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">
                        Essential
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Required for basic functionality
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">
                        Analytics
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Help us understand usage patterns
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        1 year
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">
                        Preferences
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Remember your settings
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        1 year
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="privacy-06" number="06" title="Your Rights & Choices">
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>
              <ul className="list-none space-y-3 mt-4">
                {[
                  {
                    right: 'Access',
                    desc: 'Request a copy of the personal information we hold about you',
                  },
                  {
                    right: 'Correction',
                    desc: 'Request correction of inaccurate or incomplete information',
                  },
                  {
                    right: 'Deletion',
                    desc: 'Request deletion of your personal information',
                  },
                  {
                    right: 'Portability',
                    desc: 'Receive your data in a structured, machine-readable format',
                  },
                  {
                    right: 'Objection',
                    desc: 'Object to certain processing of your personal information',
                  },
                  {
                    right: 'Restriction',
                    desc: 'Request restriction of processing in certain circumstances',
                  },
                ].map((item) => (
                  <li key={item.right} className="flex items-start gap-3">
                    <span className="shrink-0 w-24 font-medium text-foreground">
                      {item.right}
                    </span>
                    <span className="text-muted-foreground">{item.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                To exercise any of these rights, please contact us using the
                information provided below. We will respond to your request
                within the timeframe required by applicable law.
              </p>
            </Section>

            <Section id="privacy-07" number="07" title="Data Retention">
              <p>
                We retain your personal information for as long as necessary to
                fulfill the purposes for which it was collected, including to
                satisfy any legal, accounting, or reporting requirements.
              </p>
              <p>
                When we no longer need your personal information, we will
                securely delete or anonymize it. The criteria used to determine
                retention periods include the nature of the data, why it was
                collected, and applicable legal requirements.
              </p>
            </Section>

            <Section id="privacy-08" number="08" title="Children's Privacy">
              <p>
                Our services are not directed to children under 13 years of age
                (or the applicable age of consent in your jurisdiction). We do
                not knowingly collect personal information from children.
              </p>
              <p>
                If you are a parent or guardian and believe that your child has
                provided us with personal information, please contact us. If we
                learn that we have collected personal information from a child
                without parental consent, we will take steps to delete that
                information.
              </p>
            </Section>

            <Section
              id="privacy-09"
              number="09"
              title="International Transfers"
            >
              <p>
                Your information may be transferred to, and maintained on,
                servers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ.
              </p>
              <p>
                If you are located outside the United States and choose to
                provide information to us, please note that we transfer the data
                to the United States and process it there. Your consent to this
                Privacy Policy followed by your submission of such information
                represents your agreement to that transfer.
              </p>
            </Section>

            <Section id="privacy-10" number="10" title="Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-6 p-6 rounded-xl bg-linear-to-br from-chart-2/10 to-chart-3/10 border border-border/50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Privacy Team
                    </span>
                    <p className="mt-1 text-foreground">privacy@acme.inc</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Data Protection Officer
                    </span>
                    <p className="mt-1 text-foreground">dpo@acme.inc</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Mailing Address
                    </span>
                    <p className="mt-1 text-foreground">
                      Acme Inc — Privacy Department
                      <br />
                      123 Innovation Drive
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </article>

          {/* Footer Navigation */}
          <footer className="mt-24 pt-12 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-muted-foreground">
                © 2025 Acme Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Back to Login →
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-sm text-chart-2/60">{number}</span>
        <h2 className="font-display text-2xl md:text-3xl tracking-tight">
          {title}
        </h2>
      </div>
      <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 pl-10">
        {children}
      </div>
    </section>
  )
}

function Subsection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-lg text-foreground mb-2">{title}</h3>
      {children}
    </div>
  )
}
