import { ReactNode } from 'react';

/**
 * Blog layout with centered prose container and brand typography.
 * Applied to all /blog routes (index and individual posts).
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Blog header */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-2">
            Le Blog Nuage
          </h1>
          <p className="text-muted text-lg">
            Guides, conseils et culture chicha
          </p>
        </div>

        {/* Content area with Tailwind Typography prose */}
        <div className="prose prose-lg prose-stone max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent-dark">
          {children}
        </div>
      </div>
    </div>
  );
}
