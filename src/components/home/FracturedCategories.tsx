"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCategory, categoryLabels } from "@/types/product";

interface CategoryCard {
  category: ProductCategory;
  label: string;
  clipPath: string;
  marginRight: string;
  imageUrl: string;
  number: string;
  textPaddingLeft?: string;
}

const categories: CategoryCard[] = [
  {
    category: "bol",
    label: categoryLabels.bol,
    clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
    marginRight: "-8%",
    imageUrl: "/bowl.jpg",
    number: "01",
  },
  {
    category: "chicha",
    label: categoryLabels.chicha,
    clipPath: "polygon(20% 0, 100% 0, 85% 100%, 0% 100%)",
    marginRight: "-7%",
    imageUrl: "/chicha.jpg",
    number: "02",
    textPaddingLeft: "pl-8 md:pl-16",
  },
  {
    category: "tuyau",
    label: categoryLabels.tuyau,
    clipPath: "polygon(15% 0, 100% 0, 80% 100%, 0% 100%)",
    marginRight: "-8%",
    imageUrl: "/hose.webp",
    number: "03",
    textPaddingLeft: "pl-6 md:pl-12",
  },
  {
    category: "charbon",
    label: categoryLabels.charbon,
    clipPath: "polygon(20% 0, 100% 0, 90% 100%, 0% 100%)",
    marginRight: "-6%",
    imageUrl: "/coal.webp",
    number: "04",
    textPaddingLeft: "pl-8 md:pl-16",
  },
  {
    category: "accessoire",
    label: categoryLabels.accessoire,
    clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
    marginRight: "0",
    imageUrl: "/accessories.jpg",
    number: "05",
    textPaddingLeft: "pl-4 md:pl-8",
  },
];

interface FracturedCategoriesProps {
  textPosition?: 'top' | 'bottom';
}

export function FracturedCategories({ textPosition = 'bottom' }: FracturedCategoriesProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile: Simple Grid Layout */}
      <div className="md:hidden relative w-full px-4 py-8 grid grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={index === categories.length - 1 ? "col-span-2" : ""}
          >
            <Link
              href={`/produits?categorie=${cat.category}`}
              className="group relative h-48 overflow-hidden rounded-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] block"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${cat.imageUrl})`,
                  filter: 'grayscale(40%) brightness(0.5)',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <span className="text-amber-400 text-[10px] tracking-[0.3em] mb-2 uppercase">
                  {cat.number}
                </span>
                <h3 className="text-white text-base font-extralight uppercase tracking-wider leading-tight">
                  {cat.label.split(' ')[0]}
                  {cat.label.split(' ')[1] && (
                    <>
                      <br />
                      <span className="font-medium">{cat.label.split(' ').slice(1).join(' ')}</span>
                    </>
                  )}
                </h3>
              </div>

              {/* Hover effect - remove grayscale */}
              <style jsx>{`
                .group:hover > div:first-child {
                  filter: grayscale(0%) brightness(0.7) !important;
                }
              `}</style>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Shattered Glass Category Bar */}
      <div className="hidden md:block relative w-full">
        <div className="relative h-[70vh] flex w-full">
          {categories.map((cat, index) => (
            <Link
              key={cat.category}
              href={`/produits?categorie=${cat.category}`}
              className="group relative h-full flex-1 overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:flex-[1.5]"
              style={{
                clipPath: cat.clipPath,
                marginRight: cat.marginRight,
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out bg-cover bg-center group-hover:scale-110"
                style={{
                  backgroundImage: `url(${cat.imageUrl})`,
                  filter: 'grayscale(40%) brightness(0.5)',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-400 group-hover:from-black/40 group-hover:to-transparent" />

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col ${textPosition === 'top' ? 'justify-start' : 'justify-end'} p-6 md:p-12 ${cat.textPaddingLeft || ''}`}>
                <span className="text-amber-400 text-[10px] md:text-xs tracking-[0.3em] mb-2 md:mb-4 uppercase">
                  {cat.number}
                </span>
                <h3 className="text-white text-base md:text-2xl font-extralight uppercase tracking-wider md:tracking-widest leading-tight drop-shadow-lg">
                  {cat.label.split(' ')[0]}
                  {cat.label.split(' ')[1] && (
                    <>
                      <br />
                      <span className="font-medium">{cat.label.split(' ').slice(1).join(' ')}</span>
                    </>
                  )}
                </h3>
              </div>

              {/* Gold border seam */}
              <div className="absolute inset-0 border-r border-amber-500/30 pointer-events-none" />

              {/* Hover effect - remove grayscale */}
              <style jsx>{`
                .group:hover > div:first-child {
                  filter: grayscale(0%) brightness(0.7) !important;
                }
              `}</style>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
