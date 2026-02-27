'use client'

import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react' 
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import StyledProductDescription from '@/components/ui/styledPD'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ReadingRecommendations from '@/components/ReadingR'
import EnhancedHeading from '@/components/EnhancedHeading'

const Page = () => {
  const { items, removeItem, validateItems } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validate = async () => {
      setIsLoading(true)
      await validateItems()
      setIsLoading(false)
    }
    validate()
  }, [validateItems])

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`)
  }

  const handleAuthorClick = (author: string) => {
    router.push(`/products?author=${encodeURIComponent(author)}`)
  }

  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      </MaxWidthWrapper>
    )
  }

  return (
    <MaxWidthWrapper>
      <div className='bg-transparent'>
        <EnhancedHeading />
        <div className='px-4 py-16 sm:px-6 lg:px-8'>
          <div className='flex flex-col'>
            <br />
            {/* Main content area */}
            <div className='flex-grow'>
              {items.length === 0 ? (
                <div className='bg-gray-50 flex h-64 flex-col items-center justify-center space-y-1 rounded-lg border-2 border-dashed border-zinc-200 p-12'>
                  <div aria-hidden='true' className='relative mb-4 h-40 w-40 text-muted-foreground'>
                    <Image
                      src='/hippo-empty-cart.png'
                      fill
                      loading='eager'
                      alt='empty shopping cart hippo'
                    />
                  </div>
                  <h3 className='font-semibold text-2xl'>You have no favorites yet 😢</h3>
                  <p className='text-muted-foreground text-center'>
                    Whoops! Nothing to show here yet.
                  </p>
                </div>
              ) : (
                <ul className='space-y-8'>
                  {items.map(({ product }) => {
                    const label = PRODUCT_CATEGORIES.find(
                      (c) => c.value === product.category
                    )?.label

                    const { image } = product.images[0]

                    return (
                      <li key={product.id} className='bg-white bg-opacity-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'>
                        <div className='p-6'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0'>
                              <Link href={`/product/${product.id}`} className='block relative h-24 w-24 sm:h-32 sm:w-32'>
                                {typeof image !== 'string' && image.url ? (
                                  <Image
                                    fill
                                    src={image.url}
                                    alt='product image'
                                    className='rounded-md object-cover object-center'
                                  />
                                ) : null}
                              </Link>
                            </div>
                            <div className='ml-6 flex-grow'>
                              <h3 className="text-xl font-semibold">
                                <Link
                                  href={`/product/${product.id}`}
                                  className="text-gray-700 hover:text-gray-900 transition-colors duration-150 ease-in-out flex items-center group"
                                >
                                  {product.name}
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </Link>
                              </h3>
                              <div className='mt-1 flex items-center'>
                                <button
                                  onClick={() => handleCategoryClick(product.category)}
                                  className='text-sm text-muted-foreground hover:text-gray-700 transition-colors duration-150 ease-in-out mr-4'
                                >
                                  {label}
                                </button>
                                <button
                              //  @ts-ignore
                                  onClick={() => handleAuthorClick(product.author)}
                                  className='text-sm text-muted-foreground hover:text-gray-700 transition-colors duration-150 ease-in-out flex items-center group'
                                >
                                  
                                  { //@ts-ignore
                                  product.author}
                                  
                                </button>
                              </div>
                            </div>
                            <Button
                              aria-label='remove product'
                              onClick={() => removeItem(product.id)}
                              variant='ghost'
                              className='ml-4'
                            >
                              <X className='h-5 w-5' aria-hidden='true' />
                            </Button>
                          </div>
                          
                          {/* Product Description */}
                          <div className='mt-4'>
                            
                            <StyledProductDescription descriptionHtml={ 
                              //@ts-ignore
                               product.description_html as string}  />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Donation Section */}
            <div className='mt-8'>
             <ReadingRecommendations/>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Page