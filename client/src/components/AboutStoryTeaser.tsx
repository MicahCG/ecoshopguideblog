import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cydelPhoto from '@assets/cydel_giraudel_founder.jpeg';
import mersulPhoto from '@assets/mersula_giraudel_founder.png';

export default function AboutStoryTeaser() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-primary/5 rounded-xl border border-primary/10 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-shrink-0">
          {/* Overlapping founder photos */}
          <div className="flex -space-x-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-md overflow-hidden">
              <img
                src={cydelPhoto}
                alt="Cydel, Co-founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-md overflow-hidden">
              <img
                src={mersulPhoto}
                alt="Mersula, Co-founder"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground">
            Family-Founded, Nature-Inspired
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Born from Dominica, "The Nature Island," we're a family-run business dedicated to bringing sustainable, earth-inspired products to your home.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href="/pages/about">
            <Button variant="outline" className="group whitespace-nowrap">
              Our Story
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
