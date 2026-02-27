"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'

type Param = string | string[] | undefined

const parse = (param: string | null): string | undefined => {
  return param ?? undefined
}

const ProductsPage = () => {
  const searchParams = useSearchParams()
  const [key, setKey] = useState(Date.now())

  const sort = parse(searchParams.get('sort'))
  const category = parse(searchParams.get('category'))

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label

  useEffect(() => {
    // Force re-render of ProductReel when searchParams change
    setKey(Date.now())
  }, [searchParams])

  return (
    <MaxWidthWrapper>
      <ProductReel
        key={key}
        title={label ?? 'Browse digital collections'}
        query={{
          category,
          limit: 40,
          sort:
            sort === 'recent' || sort === 'oldest'
              ? sort
              : undefined,
        }}
      />
    </MaxWidthWrapper>
  )
}

export default ProductsPage