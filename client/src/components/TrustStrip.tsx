import { Package, Gem, RotateCcw } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

const trusts = [
  {
    icon: Gem,
    title: 'Hand-Picked Selection',
    desc: 'Every item curated for style and small-space living — not algorithm-driven.',
  },
  {
    icon: Package,
    title: 'Free US Shipping',
    desc: '7–15 business day delivery. No minimums, no surprises.',
  },
  {
    icon: RotateCcw,
    title: 'Easy 30-Day Returns',
    desc: 'Not in love with it? We make returns simple and hassle-free.',
  },
];

export default function TrustStrip() {
  return (
    <FadeIn>
      <div className="border-y border-border/60 bg-background py-7 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
          {trusts.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="flex items-start sm:items-center sm:flex-col sm:text-center gap-4 py-5 sm:py-0 sm:px-8 first:pt-0 last:pb-0 sm:first:pl-0 sm:last:pr-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
