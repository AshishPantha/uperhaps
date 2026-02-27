"use client"
import React, { useState } from 'react';
import { TQueryValidator } from '@/lib/validators/query-validator'
import { Product } from '@/payload-types'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import ProductListing from './ProductListing'
import { ChevronDown } from 'lucide-react'

interface ProductReelProps {
  query: TQueryValidator;
  href?: string;
  title?: string;
  subtitle?: string;
  showSorting?: boolean;
  excludeId?: string; // Add this line
}

const FALLBACK_LIMIT = 4;

const ProductReel = ({ 
  query: initialQuery, 
  href, 
  title, 
  subtitle,
  showSorting = true
}: ProductReelProps) => {
  const [query, setQuery] = useState<TQueryValidator>(initialQuery);
  const [isOpen, setIsOpen] = useState(false);

  const { data: queryResults, isLoading } = trpc.getInfiniteProducts.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const products = queryResults?.pages.flatMap((page) => page.items as unknown as Product[]) || [];

  const handleSortChange = (newSort: string) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      sort: newSort as TQueryValidator['sort']
    }));
    setIsOpen(false);
  };

// see here for adding 
  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'reverse-alphabetical', label: 'Z-A' },
    // { value: 'random', label: 'random' },
  ];

  return (
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title && (
            <h2 className='text-2xl font-bold text-gray-900 sm:text-3xl'>{title}</h2>
          )}
          {subtitle && (
            <p className='mt-2 text-sm text-muted-foreground'>{subtitle}</p>
          )}
        </div>
        
        <div className='flex items-center justify-between mt-4 md:mt-0 px-4 md:px-0'>
          {showSorting && (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full md:w-48 px-4 py-2 text-sm font-medium text-green-600 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-green-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 ease-in-out hover:bg-opacity-30 shadow-md"
              >
                {sortOptions.find(option => option.value === query.sort)?.label || 'Sort by'}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border border-green-600 rounded-lg shadow-lg overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-green-100 transition duration-200"
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {href && (
            <Link
              href={href}
              className='hidden text-sm font-medium text-green-600 hover:text-green-700 md:block px-4 py-2 ml-4 transition duration-300 ease-in-out hover:underline'
            >
              Browse the collection
              <span aria-hidden='true'> &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      <div className='relative'>
        <div className='mt-6 flex items-center w-full'>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
            {isLoading ? (
              Array.from({ length: query.limit ?? FALLBACK_LIMIT }).map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200'></div>
                  <div className='mt-4 h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='mt-1 h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              ))
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <ProductListing
                  key={`product-${product.id}`}
                  product={product}
                  index={products.indexOf(product)}
                />
              ))
            ) : (
              <p className='col-span-full text-center text-muted-foreground'>
                No products found
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;