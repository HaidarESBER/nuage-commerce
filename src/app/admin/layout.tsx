import Link from "next/link";
import { Sparkles, Search } from "lucide-react";

export const metadata = {
  title: "Nuage Admin",
  description: "Panneau d'administration Nuage",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-background border-b border-primary/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-heading font-semibold">Nuage Admin</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-secondary border-r border-primary/10">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/produits"
              className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
            >
              Produits
            </Link>
            <Link
              href="/admin/commandes"
              className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
            >
              Commandes
            </Link>
            <Link
              href="/admin/scraper"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
            >
              <Search className="w-4 h-4" />
              Sourcing
            </Link>
            <Link
              href="/admin/curation"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Curation
            </Link>

            {/* Analytics Section */}
            <div className="pt-4 mt-4 border-t border-primary/10">
              <p className="text-xs font-semibold text-primary/50 uppercase mb-2 px-4">
                Analytics
              </p>
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/analytics/revenue"
                className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
              >
                💰 Revenus
              </Link>
              <Link
                href="/admin/analytics/products"
                className="block px-4 py-2 rounded-md text-primary hover:bg-accent/20 transition-colors"
              >
                📦 Produits
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
