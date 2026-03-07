import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const messages = [
  'New articles every week — sustainable living made simple',
  'Guides for small spaces, eco-friendly homes, and more',
  'Subscribe to get new posts straight to your inbox',
  'Free US Shipping — 7-15 Business Days',
  'Use code WELCOME10 for 10% off your first order',
  'Hand-picked pieces for intentional small spaces',
];

export default function AnnouncementBanner() {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('announcement_dismissed') === 'true';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsFading(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    sessionStorage.setItem('announcement_dismissed', 'true');
  }, []);

  if (isDismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground relative z-[55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center h-9 relative">
          <p
            className={`text-xs sm:text-sm font-medium text-center transition-opacity duration-300 ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {messages[currentIndex]}
          </p>
          <button
            onClick={handleDismiss}
            className="absolute right-0 p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
