"use client";

import React, { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/config';
import { Menu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the nav when the pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle clicking outside of the mobile nav
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const nav = document.getElementById('mobile-nav');
      const menuButton = document.getElementById('menu-button');
      if (
        nav && !nav.contains(event.target as Node) &&
        menuButton && !menuButton.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const toggleNav = () => setIsOpen((prev) => !prev);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-center px-4 py-2">
        <div className="hidden lg:block">
          <Link href='/'>
            <p className='font-semibold text-gray-800'>
              Unwhispered<span className="text-green-600">Perhaps..</span>
            </p>
          </Link>
        </div>
        <button
          id="menu-button"
          type='button'
          onClick={toggleNav}
          className={cn(
            'inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500',
            isOpen && 'bg-gray-100'
          )}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <Menu className='h-6 w-6' aria-hidden='true' />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-full shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ maxWidth: '100%', top: '3.5rem', background: 'linear-gradient(to right, #ffffff, #abbaab)' }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6">
            <nav className="mt-0">
              {PRODUCT_CATEGORIES.map((category) => (
                <div key={category.label} className="mb-6">
                  {/* Conditionally render the category */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.label}
                    </h3>
                  </div>
                  <ul className="mt-2 space-y-2">
                    {category.featured.map((item) => (
                      <li key={item.name} className="flex justify-between items-center">
                        <Link
                          href={item.href}
                          className="block py-2 text-base text-gray-500 hover:text-green-600 transition duration-150 ease-in-out"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </li>
                    ))}
                  </ul>
                 {/* horizontal line after each category */}
                    <div className="my-4">
                      <hr className="border-t border-gray-300" />
                    </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="absolute bottom-5 left-0 right-0 p-4 bg-transparent border-t border-gray-200"> {/* Moved buttons up */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/sign-in"
              className="w-full px-4 py-3 text-center font-medium text-white bg-green-600 rounded-md hover:bg-green-700 hover:shadow-lg transition duration-150 ease-in-out"
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="w-full px-4 py-3 text-center font-medium text-white bg-green-600 border border-green-700 rounded-md hover:bg-green-700 hover:shadow-lg transition duration-150 ease-in-out"
              onClick={() => setIsOpen(false)}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
