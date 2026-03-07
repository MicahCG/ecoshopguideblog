import { Leaf, Search, ShoppingBag } from 'lucide-react';

const benefits = [
  {
    icon: Search,
    title: 'Curated Selection',
    description: 'Every product is hand-picked for style, quality, and small-space living.',
  },
  {
    icon: Leaf,
    title: 'Thoughtfully Sourced',
    description: 'We look for natural materials, quality construction, and pieces that feel special.',
  },
  {
    icon: ShoppingBag,
    title: 'Hassle-Free Shopping',
    description: 'Free shipping, easy returns, and real human support if you need help.',
  },
];

export default function WhyThisMatters() {
  return (
    <div
      className="bg-gradient-to-br from-primary/5 to-green-50/50 border border-primary/10 rounded-xl p-4 sm:p-5 space-y-4"
      data-testid="why-this-matters"
    >
      <div className="flex items-center gap-2">
        <Leaf className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Why This Matters</h3>
      </div>

      <div className="space-y-3">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div key={idx} className="flex gap-3" data-testid={`benefit-${idx}`}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-foreground">{benefit.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
