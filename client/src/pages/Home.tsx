import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { Blog } from "@shared/schema";
import Header from "@/components/Header";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { ArticleCard, FeaturedSection, getFeatureImage, getCategoryDisplay } from "./BlogList";

function SkeletonFeatured() {
  return (
    <div className="grid md:grid-cols-[3fr_2fr] gap-8 md:gap-14 animate-pulse">
      <div className="bg-muted rounded-lg aspect-[4/3]" />
      <div className="space-y-6 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 pb-5 border-b last:border-0">
            <div className="bg-muted rounded h-3 w-20" />
            <div className="bg-muted rounded h-5 w-full" />
            <div className="bg-muted rounded h-5 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg aspect-[4/3] mb-3" />
      <div className="bg-muted rounded h-3 w-24 mb-2" />
      <div className="bg-muted rounded h-5 w-full mb-1" />
      <div className="bg-muted rounded h-5 w-3/4" />
    </div>
  );
}

export default function Home() {
  const { data: blogs = [], isLoading } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  const sorted = [...blogs].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredBlogs = sorted.slice(0, 5);
  const recentBlogs = sorted.slice(5, 11);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Page header ── */}
        <section className="pt-20 md:pt-28 pb-10 md:pb-12 border-b">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              Curated Guides
            </p>
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-bold">
              Sustainable Living,
              <br />
              Simplified.
            </h1>
          </div>
        </section>

        {/* ── Featured posts ── */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8">
            Most Popular
          </p>
          {isLoading ? (
            <SkeletonFeatured />
          ) : (
            <FeaturedSection blogs={featuredBlogs} />
          )}
        </section>

        {/* ── Latest articles grid ── */}
        {(isLoading || recentBlogs.length > 0) && (
          <section className="max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-24 border-t pt-12 md:pt-16">
            <div className="flex items-baseline justify-between mb-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Latest Articles
              </p>
              <Link href="/blog">
                <span className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  Show me everything <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : recentBlogs.map((blog) => <ArticleCard key={blog.id} blog={blog} />)}
            </div>

            <div className="mt-12 pt-10 border-t text-center">
              <Link href="/blog">
                <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase hover:text-primary transition-colors">
                  Browse all articles <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
