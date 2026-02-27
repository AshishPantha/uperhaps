"use client"
import { ChevronDown, BookOpen, Feather, Heart, Quote, PenSquare } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import AddToCartButton from '@/components/AddToCartButton'

interface ContentContextButtonProps {
  name?: string;
  category?: string;
  author?: string;
  themes?: string[];
  excerpt?: string;
  context?: string;
  publishedDate?: string;
  descriptionWordCount?: number;
  product?: any;

}

interface Product {
  id: string;
  name: string;
  description?: string;
  description_html?: string;
  category: string;
  author: string;
  images?: Array<{ image: string | { url: string } }>;
  context?: string;
  themes?: string[];
  excerpt?: string;
  publishedDate?: string;
}

const ContentContextButton = ({ 
  name = 'Untitled', 
  category = 'Uncategorized', 
  author = 'Unknown Author',
  themes = [],
  excerpt = 'No excerpt available',
  context = '',
  publishedDate = '',
  descriptionWordCount = 0,
  product
}: ContentContextButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayWordCount = descriptionWordCount || 0;  // Ensure we always have a number

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 500)
        return () => clearTimeout(timer)
      } else {
        setIsOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formattedDate = publishedDate ? new Date(publishedDate).toLocaleDateString() : 'Date not available'

  return (
    <div className="relative flex justify-end w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group rounded-full shadow-md border border-white/20
                   transition-all duration-300 hover:shadow-lg hover:scale-105
                   flex items-center backdrop-blur-sm
                   hover:border-green-400/20
                   md:px-6 md:py-3 
                   px-3 py-2 
                   ${isOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/30'}`}
      >
        <span className="text-sm font-semibold text-gray-400 transition-colors duration-300 
                       group-hover:text-green-800 hidden md:block">
          Context
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-all duration-300
                    group-hover:text-green-800 md:ml-2
                    ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 rounded-2xl bg-white/30 backdrop-blur-md
                       border border-white/20 shadow-xl transition-all duration-300
                       animate-in slide-in-from-top-5 fade-in-20 z-50
                       sm:w-120 w-80 md:w-96">
          <div className="p-4 space-y-4 max-h-[80vh]">
            <div className="space-y-1">
              <h3 className="text-lg font-serif text-gray-700">{name}</h3>
              <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 max-h-[60vh] 
                          [&::-webkit-scrollbar]:w-1.5
                          [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:bg-white/20
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar]:hover:w-1.5
                          [&::-webkit-scrollbar-thumb]:hover:bg-white/30
                          hover:[&::-webkit-scrollbar-thumb]:bg-white/40
                          transition-all duration-300">
              
              <div className="flex items-center gap-4">
                <div className="group relative">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40
                                text-gray-600 hover:text-green-800 hover:bg-white/50 
                                transition-all duration-200 shadow-sm
                                hover:shadow-md hover:scale-105">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{category}</span>
                  </div>
                  {/* <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                whitespace-nowrap pointer-events-none">
                    Category
                  </div> */}
                </div>

                <div className="group relative">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40
                                text-gray-600 hover:text-green-800 hover:bg-white/50 
                                transition-all duration-200 shadow-sm
                                hover:shadow-md hover:scale-105">
                    {/* <Heart className="h-4 w-4" /> */}
                    <span className="text-sm"> ©{author}</span>
                  </div>
                  {/* <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                whitespace-nowrap pointer-events-none">
                    Author
                  </div> */}
                </div>

                {displayWordCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 text-gray-600 hover:text-green-800 hover:bg-white/50 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105">
                  <PenSquare className="h-4 w-4" />
                  <span className="text-sm">{displayWordCount} words</span>
                </div>
              )}
            </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Feather className="h-4 w-4" />
                  <span className="text-sm">Themes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, index) => (
                    <span
                      key={`${theme}-${index}`}
                      className="px-3 py-1.5 text-sm rounded-full bg-white/40 text-gray-600
                               hover:text-green-800 hover:bg-white/50 transition-all duration-200 
                               cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {excerpt && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Quote className="h-4 w-4 text-gray-600" />
                    <h4 className="text-sm font-medium text-gray-600">Excerpt</h4>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 leading-relaxed italic">
                      &ldquo;{excerpt}&rdquo;
                    </div>
                  </div>
                </div>
              )}
                
                {/* {displayWordCount > 0 && (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PenSquare className="h-4 w-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-600">
            Word Count
          </h4>
        </div>
        <div className="text-sm text-gray-600 bg-white/10 p-2 rounded">
          {displayWordCount.toLocaleString()} words
        </div>
      </div>
    )} */}
              {context && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4 text-gray-600" />
                    <h4 className="text-sm font-medium text-gray-600">Context</h4>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {context}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentContextButton