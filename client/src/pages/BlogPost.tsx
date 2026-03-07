import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Lightbulb, ArrowRight, User, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Blog } from '@shared/schema';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AffiliateProduct {
  type?: 'affiliate';
  name: string;
  description?: string;
  affiliateLink: string;
  image: string;
  badge?: string;
}

interface EditorialSection {
  type?: 'editorial';
  id?: number;
  title: string;
  description: string;
  tip: string;
  image: string;
}

type BlogContent = AffiliateProduct | EditorialSection;

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: blog, isLoading } = useQuery<Blog>({
    queryKey: ['/api/blogs', slug],
  });

  const { data: allBlogs } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });

  const relatedBlogs = allBlogs?.filter(b => b.slug !== slug) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Link href="/blog">
          <Button variant="outline" data-testid="button-back-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const content = blog.products as BlogContent[];

  // Detect content type - if has 'title' field, it's editorial
  const isEditorial = content.length > 0 && 'title' in content[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent pt-24 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6" data-testid="button-back-blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
              data-testid="text-post-title"
            >
              {blog.title}
            </h1>

            <p
              className="text-lg text-muted-foreground leading-relaxed mb-6"
              data-testid="text-post-intro"
            >
              {blog.intro}
            </p>

            {/* Author Byline */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By <span className="font-medium text-foreground">Cydel Giraudel</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>January 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{content.length * 2} min read</span>
              </div>
            </div>
          </div>
        </div>

        {isEditorial ? (
          <EditorialSectionList sections={content as EditorialSection[]} cta={blog.cta} />
        ) : (
          <AffiliateProductGrid products={content as AffiliateProduct[]} cta={blog.cta} />
        )}

        {relatedBlogs.length > 0 && (
          <RelatedPosts blogs={relatedBlogs} />
        )}
      </div>

      <Footer />
    </div>
  );
}

function EditorialSectionList({ sections, cta }: { sections: EditorialSection[]; cta: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {sections.map((section, index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={section.id || index}
            className="mb-16 sm:mb-20 last:mb-12"
            data-testid={`editorial-section-${index}`}
          >
            <div className={`flex flex-col gap-8 lg:gap-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              {/* Image */}
              <div className="w-full lg:flex-1">
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-muted">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    data-testid={`section-image-${index}`}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:flex-1 flex flex-col justify-center">
                <h2
                  className="text-2xl sm:text-3xl font-serif font-bold mb-4"
                  data-testid={`section-title-${index}`}
                >
                  {section.title}
                </h2>
                <p
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6"
                  data-testid={`section-description-${index}`}
                >
                  {section.description}
                </p>

                {/* Tip */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                  <p data-testid={`section-tip-${index}`}>
                    {section.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div className="bg-primary/5 rounded-lg p-6 sm:p-8 text-center border border-primary/20">
        <p
          className="text-lg sm:text-xl text-foreground font-medium leading-relaxed"
          data-testid="text-cta"
        >
          {cta}
        </p>
      </div>
    </div>
  );
}

function AffiliateProductGrid({ products, cta }: { products: AffiliateProduct[]; cta: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8" data-testid="text-featured-products">
        Featured Picks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            data-testid={`product-link-${index}`}
          >
            <Card className="h-full hover-elevate transition-all duration-300 overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-testid={`product-image-${index}`}
                />
                <Badge
                  className="absolute top-3 right-3 bg-primary text-primary-foreground"
                  data-testid={`badge-affiliate-${index}`}
                >
                  <ExternalLink className="w-3 h-3 mr-1 inline" /> Shop Now
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3
                  className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors"
                  data-testid={`product-name-${index}`}
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid={`product-description-${index}`}
                  >
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="bg-primary/5 rounded-lg p-6 sm:p-8 text-center border border-primary/20">
        <p
          className="text-lg sm:text-xl text-foreground font-medium"
          data-testid="text-cta"
        >
          {cta}
        </p>
      </div>
    </div>
  );
}

function RelatedPosts({ blogs }: { blogs: Blog[] }) {
  const getFirstImage = (blog: Blog): string => {
    const products = blog.products as (AffiliateProduct | EditorialSection)[];
    if (products && products.length > 0) {
      return products[0].image;
    }
    return 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80';
  };

  return (
    <div className="bg-muted/30 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl sm:text-3xl font-serif font-bold"
            data-testid="text-more-articles"
          >
            More Articles to Explore
          </h2>
          <Link href="/blog">
            <Button variant="ghost" className="hidden sm:flex" data-testid="button-view-all-articles">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <Card
                className="h-full hover-elevate transition-all duration-300 overflow-visible cursor-pointer group"
                data-testid={`related-post-${blog.slug}`}
              >
                <div className="relative overflow-hidden rounded-t-lg aspect-[16/10] bg-muted">
                  <img
                    src={getFirstImage(blog)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-testid={`related-image-${blog.slug}`}
                  />
                  {blog.featured && (
                    <Badge
                      className="absolute top-3 left-3 bg-primary text-primary-foreground"
                      data-testid={`badge-featured-${blog.slug}`}
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3
                    className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2"
                    data-testid={`related-title-${blog.slug}`}
                  >
                    {blog.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    data-testid={`related-intro-${blog.slug}`}
                  >
                    {blog.intro}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog">
            <Button variant="outline" data-testid="button-view-all-articles-mobile">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
