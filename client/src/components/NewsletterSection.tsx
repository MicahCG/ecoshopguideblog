import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { trackNewsletterSignup } from '@/lib/analytics';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailFailed, setEmailFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('submitting');

    try {
      const res = await apiRequest('POST', '/api/newsletter/subscribe', {
        email: trimmed,
        source: 'homepage_section',
      });
      const data = await res.json();
      setStatus('success');
      // Set flag so exit-intent popup knows not to show
      localStorage.setItem('newsletter_subscribed', 'true');
      trackNewsletterSignup('homepage_section');
      if (data.emailSent === false) {
        setEmailFailed(true);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-secondary/60 py-12 sm:py-16 md:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Stay in the Loop
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Stay in the Loop
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
          New finds, styling ideas, and first access to drops. Once a week, no spam.
        </p>

        {status === 'success' ? (
          <div className="animate-in fade-in duration-500">
            <p className="text-primary font-medium text-base sm:text-lg">
              {emailFailed ? "You're in! We had trouble sending the welcome email — but you're all set." : "You're in! Check your inbox for a welcome surprise."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="flex-1 h-11 bg-background"
                disabled={status === 'submitting'}
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 px-6 whitespace-nowrap"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Joining...' : 'Join the List →'}
              </Button>
            </div>
            {errorMessage && (
              <p className="text-destructive text-sm animate-in fade-in duration-300">
                {errorMessage}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
