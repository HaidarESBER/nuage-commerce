import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { categoryLabels } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog | Nuage',
  description:
    'Decouvrez nos guides, conseils et articles sur la chicha. Le blog Nuage vous accompagne dans votre experience hookah.',
  openGraph: {
    title: 'Blog | Nuage',
    description:
      'Decouvrez nos guides, conseils et articles sur la chicha. Le blog Nuage vous accompagne dans votre experience hookah.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="not-prose text-center py-16">
        <p className="text-muted text-lg">Aucun article pour le moment.</p>
        <p className="text-muted mt-2">Revenez bientot pour decouvrir nos guides et conseils.</p>
      </div>
    );
  }

  return (
    <div className="not-prose">
      <div className="grid gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-background-card rounded-lg p-6 border border-background-secondary hover:border-accent/30 hover:shadow-md transition-all duration-300"
          >
            {/* Category badge */}
            <span className="inline-block text-xs font-medium uppercase tracking-wide text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">
              {categoryLabels[post.category]}
            </span>

            {/* Title */}
            <h2 className="font-heading text-2xl text-primary group-hover:text-accent transition-colors duration-200 mb-2">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-muted leading-relaxed mb-4">
              {post.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-muted">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
