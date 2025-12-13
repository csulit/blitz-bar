import { Link, createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/terms')({
  component: TermsOfServicePage,
  head: () => ({
    meta: [
      {
        title: 'Terms of Service | My Home Support',
      },
      {
        name: 'description',
        content:
          'Terms of Service for My Home Support - Read our terms and conditions.',
      },
    ],
  }),
})

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-150 h-150 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-primary/3 rounded-full blur-3xl translate-y-1/2" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-lg tracking-tight hover:text-primary transition-colors"
          >
            My Home Support
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              Legal
            </span>
            <span className="text-sm text-muted-foreground">
              Last updated December 12, 2025
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Please read these terms carefully before using our services. By
            accessing or using My Home Support, you agree to be bound by these terms.
          </p>
        </div>
      </header>

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
                { num: '01', title: 'Acceptance of Terms' },
                { num: '02', title: 'Use of Services' },
                { num: '03', title: 'User Accounts' },
                { num: '04', title: 'Intellectual Property' },
                { num: '05', title: 'Prohibited Activities' },
                { num: '06', title: 'Disclaimers' },
                { num: '07', title: 'Limitation of Liability' },
                { num: '08', title: 'Termination' },
                { num: '09', title: 'Governing Law' },
                { num: '10', title: 'Contact Information' },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-xs font-mono text-primary">
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
            <Section id="section-01" number="01" title="Acceptance of Terms">
              <p>
                By accessing and using the services provided by My Home Support ("we,"
                "us," or "our"), you accept and agree to be bound by these Terms
                of Service and our Privacy Policy. If you do not agree to these
                terms, you may not use our services.
              </p>
              <p>
                We reserve the right to update or modify these terms at any time
                without prior notice. Your continued use of the services
                following any changes constitutes your acceptance of the revised
                terms.
              </p>
            </Section>

            <Section id="section-02" number="02" title="Use of Services">
              <p>
                You agree to use our services only for lawful purposes and in
                accordance with these Terms. You are responsible for ensuring
                that your use of the services complies with all applicable laws,
                regulations, and ordinances.
              </p>
              <p>
                We grant you a limited, non-exclusive, non-transferable, and
                revocable license to access and use our services for your
                personal or internal business purposes, subject to these Terms.
              </p>
            </Section>

            <Section id="section-03" number="03" title="User Accounts">
              <p>
                To access certain features of our services, you may be required
                to create an account. You agree to provide accurate, current,
                and complete information during the registration process and to
                update such information to keep it accurate, current, and
                complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials
                and for all activities that occur under your account. You agree
                to notify us immediately of any unauthorized use of your account
                or any other breach of security.
              </p>
            </Section>

            <Section id="section-04" number="04" title="Intellectual Property">
              <p>
                All content, features, and functionality of our services,
                including but not limited to text, graphics, logos, icons,
                images, audio clips, and software, are owned by My Home Support or our
                licensors and are protected by copyright, trademark, and other
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative
                works of, publicly display, publicly perform, republish,
                download, store, or transmit any of our content without our
                prior written consent.
              </p>
            </Section>

            <Section id="section-05" number="05" title="Prohibited Activities">
              <p>
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-none space-y-3 mt-4">
                {[
                  'Using the services for any illegal purpose or in violation of any laws',
                  'Attempting to interfere with, compromise, or disrupt the services',
                  'Impersonating another person or entity, or falsifying your affiliation',
                  'Collecting or harvesting any information from the services without permission',
                  'Uploading or transmitting viruses, malware, or other malicious code',
                  'Engaging in any automated use of the system, such as scraping or data mining',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="section-06" number="06" title="Disclaimers">
              <p>
                Our services are provided on an "as is" and "as available"
                basis, without any warranties of any kind, either express or
                implied. We disclaim all warranties, including but not limited
                to implied warranties of merchantability, fitness for a
                particular purpose, and non-infringement.
              </p>
              <p>
                We do not warrant that the services will be uninterrupted,
                timely, secure, or error-free, or that any defects will be
                corrected. We make no representations about the accuracy,
                reliability, or completeness of any content available through
                the services.
              </p>
            </Section>

            <Section
              id="section-07"
              number="07"
              title="Limitation of Liability"
            >
              <p>
                To the fullest extent permitted by applicable law, My Home Support
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses.
              </p>
              <p>
                In no event shall our aggregate liability exceed the greater of
                one hundred dollars ($100) or the amount you paid us, if any, in
                the past six months for the services giving rise to the claim.
              </p>
            </Section>

            <Section id="section-08" number="08" title="Termination">
              <p>
                We may terminate or suspend your access to our services
                immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach these
                Terms.
              </p>
              <p>
                Upon termination, your right to use the services will
                immediately cease. All provisions of these Terms which by their
                nature should survive termination shall survive, including
                ownership provisions, warranty disclaimers, and limitations of
                liability.
              </p>
            </Section>

            <Section id="section-09" number="09" title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, without regard to its
                conflict of law provisions. Any disputes arising under or in
                connection with these Terms shall be subject to the exclusive
                jurisdiction of the courts located in Delaware.
              </p>
            </Section>

            <Section id="section-10" number="10" title="Contact Information">
              <p>
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="mt-6 p-6 rounded-xl bg-accent/50 border border-border/50">
                <div className="grid gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Email
                    </span>
                    <p className="mt-1 text-foreground">legal@acme.inc</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Address
                    </span>
                    <p className="mt-1 text-foreground">
                      My Home Support
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
                © 2025 My Home Support. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
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
        <span className="font-mono text-sm text-primary/60">{number}</span>
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
