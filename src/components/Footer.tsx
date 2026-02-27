'use client'

import { usePathname } from 'next/navigation'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'

import { Icons } from './Icons'


const Footer = () => {
  const pathname = usePathname()
  const pathsToMinimize = ['/verify-email', '/sign-up', '/sign-in']

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <MaxWidthWrapper>
        <div className="relative border-t border-gray-200 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Discover and share */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">UnwhisperedPerhaps</h3>
              <p className="text-md text-gray-600 mb-2">Contact us!</p>
              <Link
          href="https://x.com/FellowTravell20"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-gray-900 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          
        </Link>
            </div>

            {/* Empty Middle Column */}
            <div className="hidden md:block"></div>

            {/* Right Column - Join Our Community */}
            <div className="text-center md:text-right md:mr-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Join Our Community</h4>
              <p className="text-sm text-gray-600 mb-4">Ready to showcase your talent?</p>
              <Link 
                href="/sign-up" 
                className="inline-block bg-gray-800 text-white text-sm px-6 py-2 rounded hover:bg-gray-700 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Footer bottom section */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UnwhisperedPerhaps. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              {['Terms', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <Link 
                  key={item}
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer
