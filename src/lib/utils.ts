import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next/types"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadata({
  title = 'Uperhaps - Your Digital Library',
  description = 'Unleash your creativity and immerse yourself in the world of poetry and literature with UnwhisperedPerhaps... Sign up today and start your literary journey with us!',
  image = '/thumbnail.jpg',
  icons = '/favicon.ico',
  noIndex = false,
  type = 'website',
  siteName = 'Uperhaps',
  locale = 'en_US',
  url = 'https://uperhaps.up.railway.app',
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
  type?: 'website' | 'article' | 'book' | 'profile'
  siteName?: string
  locale?: string
  url?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      siteName,
      locale,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@Bhabuk',
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:site_name': siteName,
      'og:locale': locale,
      'og:url': url,
      'theme-color': '#ffffff', // Adjust this to match your site's theme color
    },
    icons,
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function getStructuredData(data: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  authorName: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: [{
      '@type': 'Person',
      name: data.authorName,
    }],
  }
}