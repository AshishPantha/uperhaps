'use client'

import { Star, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from './ui/sheet'
import { Separator } from './ui/separator'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import Image from 'next/image'
import { ScrollArea } from './ui/scroll-area'
import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'

const CartItem = ({ 
  product, 
  className, 
  onClose 
}: { 
  product: any
  className?: string
  onClose: () => void 
}) => {
  const { removeItem } = useCart()

  return (
    <div className={cn(
      "flex items-center space-x-4 rounded-lg p-4 transition-all duration-200",
      "bg-white bg-opacity-10 backdrop-blur-lg shadow-lg hover:shadow-xl",
      "border border-gray-200 hover:border-gray-300",
      className
    )}>
      <SheetClose asChild>
        <Link 
          href={`/product/${product.id}`} 
          className="flex-grow flex items-center space-x-4"
          onClick={onClose}
        >
         <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
  {product.images && product.images[0] && product.images[0].image && product.images[0].image.url ? (
    <Image
      src={product.images[0].image.url}
      alt={product.name}
      fill
      className="object-cover"
    />
  ) : (
    <Image
      src="/placeholder-image.jpg" // Fallback image
      alt="Placeholder"
      fill
      className="object-cover"
    />
  )}
</div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
        </Link>
      </SheetClose>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          removeItem(product.id)
        }}
        className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

const Cart = () => {
  const { items } = useCart()
  const itemCount = items.length
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && itemCount > 0) {
      setIsGlowing(true)
      const timeout = setTimeout(() => setIsGlowing(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [itemCount, isMounted])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="group -m-2 flex items-center p-2 relative">
        <div className="relative">
          <Star
            aria-hidden="true"
            className={cn(
              "h-6 w-6 flex-shrink-0 transition-all duration-300",
              isGlowing 
                ? "text-green-600 animate-glow" 
                : "text-green-600 group-hover:text-green-700"
            )}
          />
          <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] font-bold text-black">
              {itemCount}
            </span>
          </span>
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs font-medium text-white bg-gray-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          Favourites
           {/* ({itemCount}) */}
        </span>
      </SheetTrigger>
      
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-gradient-to-r from-white to-[#abbaab] bg-opacity-50">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Favourites
            {/* this is inside cart lol */}
             ({itemCount}) 
             </SheetTitle>
        </SheetHeader>
       
        {itemCount > 0 ? (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow">
              <div className="space-y-4 pr-6 pt-8">
                {items.map(({ product }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
            <div className="mt-6 space-y-4 pr-6">
              <Separator />
              <SheetFooter>
                <SheetClose asChild>
                  <Link 
                    href="/favorites"
                    className={buttonVariants({
                      variant: 'outline',
                      className: "w-full bg-green-500 hover:bg-green-600 text-white",
                    })}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    View All Favorites
                  </Link>
                </SheetClose>
              </SheetFooter>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image 
                src="/hippo-empty-cart.png" 
                fill 
                alt="empty favorites hippo illustration" 
              />
            </div> 
            <div className="text-xl font-semibold">
              Your favourites list is empty
            </div>
            <SheetClose asChild>
              <Link 
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your favourites
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart