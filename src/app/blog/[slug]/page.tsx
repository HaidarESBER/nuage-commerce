import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import { generateArticleSchema, safeJsonLd } from '@/lib/seo';
import { categoryLabels } from '@/types/blog';

/**
 * Generate static params for all blog posts.
 */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/**
 * Only render statically generated slugs; 404 for unknown slugs.
 */
export const dynamicParams = false;

/**
 * Generate per-post metadata for SEO.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Article non trouve | Nuage' };
  }

  return {
    title: `${post.title} | Blog Nuage`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'fr_FR',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Dynamic import of the MDX content
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);

  // Generate Article JSON-LD schema
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    slug: post.slug,
  });

  return (
    <>
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />

      {/* Breadcrumb navigation */}
      <nav className="not-prose mb-8" aria-label="Fil d'Ariane">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">&rsaquo;</li>
          <li className="text-primary truncate">{post.title}</li>
        </ol>
      </nav>

      {/* Article header */}
      <header className="not-prose mb-8">
        <span className="inline-block text-xs font-medium uppercase tracking-wide text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-4">
          {categoryLabels[post.category]}
        </span>
        <h1 className="font-heading text-3xl md:text-4xl text-primary mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>{post.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      {/* MDX content */}
      <article>
        <Post />
      </article>
    </>
  );
}
