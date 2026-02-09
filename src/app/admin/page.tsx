import Link from "next/link";
import { getProductStats } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getProductStats();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-heading font-semibold text-primary">
          Bienvenue sur Nuage Admin
        </h2>
        <p className="mt-2 text-primary/70">
          Gerez vos produits et votre boutique depuis ce panneau.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Produits"
          value={stats.total}
          description="Produits dans le catalogue"
        />
        <StatCard
          title="Produits Vedettes"
          value={stats.featured}
          description="Mis en avant sur le site"
        />
        <StatCard
          title="Rupture de Stock"
          value={stats.outOfStock}
          description={stats.outOfStock > 0 ? "A reapprovisionner" : "Tout est en stock"}
          highlight={stats.outOfStock > 0}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary rounded-lg p-6 border border-primary/10">
        <h3 className="text-lg font-heading font-semibold text-primary mb-4">
          Actions Rapides
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center px-4 py-2 bg-primary text-background rounded-md hover:bg-accent hover:text-primary transition-colors"
          >
            + Ajouter un produit
          </Link>
          <Link
            href="/admin/produits"
            className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-background transition-colors"
          >
            Voir tous les produits
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  highlight = false,
}: {
  title: string;
  value: number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-secondary rounded-lg p-6 border border-primary/10">
      <h3 className="text-sm font-medium text-primary/70">{title}</h3>
      <p
        className={`mt-2 text-3xl font-heading font-semibold ${
          highlight ? "text-accent" : "text-primary"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-primary/60">{description}</p>
    </div>
  );
}
