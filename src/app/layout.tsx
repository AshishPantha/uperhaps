import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/NewClientLayoutComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.className
        )}>
        <Providers>
          <ClientLayout>
            <main className='relative flex flex-col min-h-screen'>
              <Navbar />
              <div className='flex-grow flex-1'>
                {children}
              </div>
            </main>
          </ClientLayout>
        </Providers>

        <Toaster position='top-center' richColors />
      </body>
    </html>
  )
}