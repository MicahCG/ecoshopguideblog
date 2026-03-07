import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Don't show if already subscribed or already shown this session
    if (
      localStorage.getItem('newsletter_subscribed') ||
      sessionStorage.getItem('newsletter_popup_shown')
    ) {
      return;
    }

    // Show after 4 seconds
    const timer = setTimeout(() => {
      sessionStorage.setItem('newsletter_popup_shown', 'true');
      setIsOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-close after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setIsOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
      await apiRequest('POST', '/api/newsletter/subscribe', {
        email: trimmed,
        source: 'exit_intent_popup',
      });
      setStatus('success');
      localStorage.setItem('newsletter_subscribed', 'true');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div
        className="relative bg-background rounded-lg shadow-xl max-w-md w-[calc(100%-2rem)] mx-4 p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4 animate-in fade-in duration-500">
            <p className="text-primary font-medium text-lg">
              You're in! Check your inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                Sustainable living, simplified.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Join our readers for weekly guides, tips, and ideas — straight to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="h-11 bg-background"
                disabled={status === 'submitting'}
                autoFocus
              />
              {errorMessage && (
                <p className="text-destructive text-sm animate-in fade-in duration-300">
                  {errorMessage}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full h-11"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Subscribing...' : 'Subscribe →'}
              </Button>
            </form>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
