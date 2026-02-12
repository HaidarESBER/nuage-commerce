"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCategory, categoryLabels } from "@/types/product";

interface CategoryTabsProps {
  activeCategory?: ProductCategory;
}

export function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const categories: Array<{ value: ProductCategory | null; label: string }> = [
    { value: null, label: "Tous" },
    { value: "chicha", label: categoryLabels.chicha },
    { value: "bol", label: categoryLabels.bol },
    { value: "tuyau", label: categoryLabels.tuyau },
    { value: "charbon", label: categoryLabels.charbon },
    { value: "accessoire", label: categoryLabels.accessoire },
  ];

  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 overflow-x-auto scrollbar-hide" aria-label="Product categories">
        {categories.map(({ value, label }) => {
          const isActive = value === activeCategory || (value === null && !activeCategory);
          const href = value ? `/produits?category=${value}` : "/produits";

          return (
            <Link
              key={value || "all"}
              href={href}
              className={`relative px-6 py-3 text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap ${
                isActive ? "text-primary" : "text-muted hover:text-primary"
              }`}
            >
              {label}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4A5A5]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
