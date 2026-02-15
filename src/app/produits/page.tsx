import { Metadata } from "next";
import { Container } from "@/components/ui";
import { ProduitsClientEnhanced } from "./ProduitsClientEnhanced";
import { getAllProducts } from "@/lib/products";
import { getBatchProductRatingStats } from "@/lib/reviews";
import {
  ProductCategory,
} from "@/types/product";

interface ProduitsPageProps {
  searchParams: Promise<{ categorie?: string; q?: string; page?: string }>;
}

const categoryMeta: Record<string, { title: string; description: string }> = {
  chicha: {
    title: "Chichas Premium",
    description:
      "Decouvrez notre selection de chichas haut de gamme. Designs elegants et materiaux de qualite pour une experience unique.",
  },
  bol: {
    title: "Bols a Chicha",
    description:
      "Bols en ceramique, verre et silicone pour chicha. Qualite artisanale pour une chauffe optimale du tabac.",
  },
  tuyau: {
    title: "Tuyaux de Chicha",
    description:
      "Tuyaux en silicone et cuir pour chicha. Materiaux premium pour un tirage parfait et une experience confortable.",
  },
  charbon: {
    title: "Charbon pour Chicha",
    description:
      "Charbon naturel et auto-allumant pour chicha. Combustion longue et reguliere pour des sessions prolongees.",
  },
  accessoire: {
    title: "Accessoires Chicha",
    description:
      "Accessoires essentiels pour chicha: pinces, embouts, filtres, brosses et plus. Tout pour entretenir votre chicha.",
  },
};

export async function generateMetadata({
  searchParams,
}: ProduitsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.categorie;

  const meta =
    category && categoryMeta[category] ? categoryMeta[category] : null;
  const title = meta ? `${meta.title} | Nuage` : "Produits | Nuage";
  const description =
    meta?.description ||
    "Decouvrez notre collection de chichas premium, bols, tuyaux, charbon et accessoires. Qualite superieure pour une experience unique.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
    },
  };
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const params = await searchParams;
  const categoryParam = params.categorie as ProductCategory | undefined;
  const searchQuery = params.q || '';
  const currentPage = parseInt(params.page || '1', 10);

  // Validate category parameter
  const validCategories: ProductCategory[] = [
    "chicha",
    "bol",
    "tuyau",
    "charbon",
    "accessoire",
  ];
  const isValidCategory =
    categoryParam && validCategories.includes(categoryParam);
  const activeCategory = isValidCategory ? categoryParam : null;

  // Load products from database
  const products = await getAllProducts();

  // Fetch ratings for all products in a single batch query (optimized)
  const productIds = products.map(p => p.id);
  const ratingsMap = await getBatchProductRatingStats(productIds);

  return (
    <ProduitsClientEnhanced
      products={products}
      activeCategory={activeCategory}
      searchQuery={searchQuery}
      ratingsMap={ratingsMap}
      initialPage={currentPage}
    />
  );
}
