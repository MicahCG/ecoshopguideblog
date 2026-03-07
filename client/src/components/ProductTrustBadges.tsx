import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import cydelPhoto from '@assets/cydel_giraudel_founder.jpeg';
import mersulPhoto from '@assets/mersula_giraudel_founder.png';

export default function ProductTrustBadges() {
  return (
    <Link href="/pages/about">
      <div className="bg-gradient-to-r from-green-50 to-primary/5 rounded-lg border border-primary/10 p-4 cursor-pointer hover:border-primary/20 transition-colors group">
        <div className="flex items-center gap-4">
          {/* Overlapping founder photos */}
          <div className="flex -space-x-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img
                src={cydelPhoto}
                alt="Cydel, Co-founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img
                src={mersulPhoto}
                alt="Mersula, Co-founder"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-foreground">
              Family-Founded in Austin
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Hand-picked for small-space living
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
