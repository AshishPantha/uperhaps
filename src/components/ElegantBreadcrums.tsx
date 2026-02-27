import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

const ElegantBreadcrumbs = () => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 mt-8 flex justify-left">
      <div 
        className="bg-white/30 px-6 py-3 rounded-full shadow-md max-w-screen-lg border border-white/20 transition-transform duration-300 hover:shadow-md hover:scale-105"
      >
        <ol className="flex items-center space-x-4">
          {BREADCRUMBS.map((breadcrumb, index) => (
            <li key={breadcrumb.id} className="flex items-center">
              <Link
                href={breadcrumb.href}
                className="text-sm font-semibold text-gray-400 hover:text-green-600 duration-300 ease-in-out"
              >
                {breadcrumb.name}
              </Link>
              {index < BREADCRUMBS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-400 ml-5 flex-shrink-0 my-auto" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default ElegantBreadcrumbs;
