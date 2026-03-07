import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { ecoTrack } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/ui/FadeIn';

interface LifeMomentCard {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  collectionSlug: string;
}

const shopAllCard: LifeMomentCard = {
  title: 'Shop All Products',
  subtitle: 'Every piece we carry, hand-picked for style and small-space living. Free shipping on everything.',
  image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80',
  href: '/collections/all',
  collectionSlug: 'all',
};

const lifeMoments: LifeMomentCard[] = [
  {
    title: 'Making Your Tiny Space Work',
    subtitle: "Furniture that actually fits. Pieces designed for apartments, studios, and small rooms that don't sacrifice style.",
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    href: '/collections/small-spaces',
    collectionSlug: 'small-spaces',
  },
  {
    title: 'Plan a Wedding That Feels Like You',
    subtitle: "Decor that feels personal, not mass-produced. Pieces for a wedding that actually looks like you.",
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    href: '/collections/wedding',
    collectionSlug: 'wedding',
  },
  {
    title: 'Create Your Personal Sanctuary',
    subtitle: "Stressed? Your space matters. Wellness essentials that turn any room into a retreat from chaos.",
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80',
    href: '/collections/wellness',
    collectionSlug: 'wellness',
  },
  {
    title: 'Turn Your Dorm Into Your Space',
    subtitle: "It doesn't have to feel temporary. Pieces that make a small dorm room feel like yours.",
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    href: '/collections/dorms',
    collectionSlug: 'dorms',
  },
];

function trackMomentCardClick(cardTitle: string, collectionSlug: string) {
  ecoTrack('moment_card_click', {
    card_title: cardTitle,
    collection_slug: collectionSlug,
    source: 'home_page',
  });
}

export default function LifeMomentCards() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-8 lg:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Find Your Moment
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Curated collections for every corner of your home
          </p>
        </FadeIn>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {[shopAllCard, ...lifeMoments].map((moment, index) => (
            <StaggerItem
              key={index}
              className={cn(index === 0 ? 'sm:col-span-2' : '')}
            >
              <Link href={moment.href}>
              <div
                className={cn(
                  'group relative rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer',
                  index === 0
                    ? 'aspect-[16/9] sm:aspect-[16/6]'
                    : 'aspect-[4/3] sm:aspect-[4/3] lg:aspect-[16/10]'
                )}
                onClick={() => trackMomentCardClick(moment.title, moment.collectionSlug)}
              >
                {/* Background Image */}
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Neutral Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-800/40 to-stone-700/20" />

                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 lg:p-8 flex flex-col justify-end">
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-3 leading-tight">
                    {moment.title}
                  </h3>
                  <p className="text-stone-100/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 lg:mb-4 line-clamp-2">
                    {moment.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-white/90 font-medium text-sm lg:text-base group-hover:gap-3 transition-all">
                    <span>{moment.collectionSlug === 'all' ? 'Explore All' : 'Explore Collection'}</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
