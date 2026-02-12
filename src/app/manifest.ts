import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nuage | L'art de la détente",
    short_name: "Nuage",
    description: "Boutique en ligne d'accessoires chicha haut de gamme",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9", // Cream color from brand
    theme_color: "#2C2C2C", // Charcoal from brand
    orientation: "portrait-primary",
    scope: "/",
    categories: ["shopping", "lifestyle"],
    icons: [
      // Icons will be added in next task
    ],
  };
}
