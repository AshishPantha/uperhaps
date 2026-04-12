"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'

type CategoryValue = 'poems' | 'novels' | 'miscellaneous'
type SortOption = 'recent' | 'oldest' | 'alphabetical' | 'reverse-alphabetical' | 'random' | undefined

const parseCategory = (param: string | null): CategoryValue | undefined => {
  if (param === null) return undefined;
  const value = param;
  const validCategories: CategoryValue[] = ['poems', 'novels', 'miscellaneous'];
  if (value && validCategories.includes(value as CategoryValue)) {
    return value as CategoryValue;
  }
  return undefined;
}

const parseSort = (param: string | null): SortOption => {
  if (param === null) return undefined;
  const value = param;
  const validSorts: SortOption[] = ['recent', 'oldest', 'alphabetical', 'reverse-alphabetical', 'random'];
  if (value && validSorts.includes(value as SortOption)) {
    return value as SortOption;
  }
  return undefined;
}

const ProductsPage = () => {
  const searchParams = useSearchParams()
  const [key, setKey] = useState(Date.now())

  const sort = parseSort(searchParams.get('sort'))
  const category = parseCategory(searchParams.get('category'))
  const author = searchParams.get('author') ?? undefined
  const theme = searchParams.get('theme') ?? undefined

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label

  const getTitle = () => {
    if (author) return `Works by ${author}`
    if (theme) return `Contents about "${theme}"`
    return label ?? 'Browse digital collections'
  }

  useEffect(() => {
    // Force re-render of ProductReel when searchParams change
    setKey(Date.now())
  }, [searchParams])

  return (
    <MaxWidthWrapper>
      <ProductReel
        key={key}
        title={getTitle()}
        query={{
          category,
          author,
          theme,
          limit: 40,
          sort,
        }}
      />
    </MaxWidthWrapper>
  )
}

export default ProductsPage