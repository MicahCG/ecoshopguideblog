import { Link } from 'wouter';
import { ArrowLeft, Shield, Eye, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent pt-24 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" className="mb-6" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
              data-testid="text-page-title"
            >
              Privacy Policy
            </h1>
            
            <p className="text-sm text-muted-foreground mb-6">
              Last updated: November 24, 2025
            </p>
            
            <p 
              className="text-lg text-muted-foreground leading-relaxed"
              data-testid="text-page-intro"
            >
              At EcoShopGuide, we respect your privacy and are committed to protecting your personal information.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mb-8" data-testid="card-information-collection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground mb-2">When you interact with our site, we may collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Name and email address (when you subscribe to our newsletter)</li>
                  <li>Reading preferences and content interactions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Automatically Collected Information</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Browser type and device information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-information-use">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Send newsletter emails and content updates (with your consent)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Respond to inquiries and customer service requests</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Improve our website and content</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Prevent fraud and maintain security</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-data-protection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>SSL encryption for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal data</li>
                <li>Secure data storage with encryption</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-data-sharing">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li><strong>Email Service Providers:</strong> To send newsletters (e.g. Resend)</li>
                <li><strong>Analytics Partners:</strong> To understand site traffic (e.g. Google Analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-cookies">
            <CardHeader>
              <CardTitle>Cookies & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to show relevant ads (with your consent)</li>
              </ul>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-your-rights">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to data processing</li>
                <li>Request data portability</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at{' '}
                <a 
                  href="mailto:livebambana@gmail.com" 
                  className="text-primary hover:underline"
                  data-testid="link-email"
                >
                  livebambana@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-third-party">
            <CardHeader>
              <CardTitle>Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites (including Amazon affiliate links). 
                We are not responsible for the privacy practices of these external sites. 
                Please review their privacy policies before providing any personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-children">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not directed to children under 13. We do not knowingly collect 
                personal information from children. If you believe we have collected information 
                from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-changes">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by posting the new policy on this page and updating the 
                "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-contact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <a 
                    href="mailto:livebambana@gmail.com" 
                    className="text-primary hover:underline"
                    data-testid="link-email-contact"
                  >
                    livebambana@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Location:</strong> Austin, Texas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
