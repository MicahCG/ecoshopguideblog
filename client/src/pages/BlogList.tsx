import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { Blog } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

export function getFeatureImage(blog: Blog): string {
  if (blog.featureImage) return blog.featureImage;
  const products = blog.products as any[];
  if (products && products.length > 0) {
    const first = products[0];
    if (first.image) return first.image;
    if (first.imageUrl) return first.imageUrl;
  }
  return DEFAULT_IMAGE;
}

export function getCategoryDisplay(category: string | null): string {
  if (category === "wedding") return "Wedding";
  if (category === "apartment") return "Small Spaces";
  return "Home Decor";
}

type FilterCategory = "all" | "home" | "wedding" | "apartment";

const CATEGORIES: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All Articles" },
  { value: "home", label: "Home Decor" },
  { value: "wedding", label: "Wedding" },
  { value: "apartment", label: "Small Spaces" },
];

// ─── Card: image on top, category + title below ──────────────────────────────

export function ArticleCard({ blog }: { blog: Blog }) {
  const image = getFeatureImage(blog);
  return (
    <Link href={`/blog/${blog.slug}`}>
      <article className="group cursor-pointer" data-testid={`blog-card-${blog.slug}`}>
        <div className="overflow-hidden rounded-lg mb-3">
          <img
            src={image}
            alt={blog.title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1.5">
          {getCategoryDisplay(blog.category)}
        </p>
        <h3 className="font-serif font-bold text-base md:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <span className="inline-flex items-center gap-1 mt-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </article>
    </Link>
  );
}

// ─── Featured: big image left, list right (The Sill style) ───────────────────

export function FeaturedSection({ blogs }: { blogs: Blog[] }) {
  const [hero, ...rest] = blogs;
  const listPosts = rest.slice(0, 4);

  if (!hero) return null;

  return (
    <div className="grid md:grid-cols-[3fr_2fr] gap-8 md:gap-14 items-start">
      {/* Hero image */}
      <Link href={`/blog/${hero.slug}`}>
        <div className="group overflow-hidden rounded-lg cursor-pointer">
          <img
            src={getFeatureImage(hero)}
            alt={hero.title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      {/* List */}
      <div className="divide-y divide-border">
        {[hero, ...listPosts].map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <div className="group py-5 first:pt-0 last:pb-0 cursor-pointer">
              <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                {getCategoryDisplay(blog.category)}
              </p>
              <h3 className="font-serif text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                {blog.title}
              </h3>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogList() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const { data: blogs = [], isLoading } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  const sorted = [...blogs].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filtered =
    filter === "all" ? sorted : sorted.filter((b) => b.category === filter);

  const showFeatured = filter === "all";
  const gridBlogs = showFeatured ? filtered.slice(5) : filtered;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Page header ── */}
        <section className="pt-20 md:pt-28 pb-10 md:pb-12 border-b">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3"
              data-testid="badge-curated-guides"
            >
              Curated Guides
            </p>
            <h1
              className="font-serif text-4xl md:text-5xl xl:text-6xl font-bold"
              data-testid="text-blog-page-heading"
            >
              Sustainable Living,
              <br />
              Simplified.
            </h1>
          </div>
        </section>

        {/* ── Browse by topic ── */}
        <section className="border-b">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mr-2 shrink-0">
                Browse by topic
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  data-testid={`button-filter-${cat.value}`}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${
                      filter === cat.value
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured section (all articles only) ── */}
        {showFeatured && (
          <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8">
              Most Popular
            </p>
            {isLoading ? <SkeletonFeatured /> : <FeaturedSection blogs={filtered.slice(0, 5)} />}
          </section>
        )}

        {/* ── Articles grid ── */}
        {(isLoading || gridBlogs.length > 0) && (
          <section
            className={`max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-24 ${
              showFeatured ? "border-t pt-12 md:pt-16" : "pt-10 md:pt-14"
            }`}
          >
            {showFeatured && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8">
                All Articles
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : gridBlogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {gridBlogs.map((blog) => (
                  <ArticleCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-16">
                No articles in this category yet.
              </p>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
