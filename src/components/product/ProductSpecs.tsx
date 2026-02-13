"use client";

import { ReactNode } from "react";

export interface ProductSpec {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface ProductSpecsProps {
  specs: ProductSpec[];
}

/**
 * Product specifications display component
 * Shows technical details in a clean, scannable grid layout
 *
 * Layout:
 * - 2-column grid on mobile
 * - 3-column grid on desktop
 */
export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {specs.map((spec, index) => (
        <div
          key={index}
          className="bg-background-secondary/30 border border-border rounded-lg p-4 hover:bg-background-secondary/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            {spec.icon && (
              <div className="text-accent flex-shrink-0 mt-0.5">
                {spec.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <dt className="text-xs text-muted uppercase tracking-wider mb-1">
                {spec.label}
              </dt>
              <dd className="text-sm font-medium text-primary truncate">
                {spec.value}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
