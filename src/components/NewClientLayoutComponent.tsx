'use client';

import { usePathname } from 'next/navigation';
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/sign-up' || pathname === '/sign-in';

  return (
    <>
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}