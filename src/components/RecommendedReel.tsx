"use client";

import React from "react";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

interface RecommendedReelProps {
  productId: string;
  limit?: number;
  title?: string;
  subtitle?: string;
}

const RecommendedReel = ({
  productId,
  limit = 8,
  title = "More like this",
  subtitle = "Recommended based on author, themes, and genre",
}: RecommendedReelProps) => {
  const { data, isLoading } = trpc.getRecommendedProducts.useQuery({
    productId,
    limit,
  });

  const products = (data?.items ?? []) as unknown as Product[];

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {products.length > 0 && (
          <Link
            href="/products"
            className="hidden text-sm font-medium text-green-600 hover:text-green-700 md:block px-4 py-2 ml-4 transition duration-300 ease-in-out hover:underline"
          >
            Browse the collection
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200" />
                  <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
                  <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <ProductListing
                  key={`product-${product.id}`}
                  product={product}
                  index={index}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No recommended content right now. Browse the collection for more.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedReel;
