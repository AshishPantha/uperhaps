export const PRODUCT_CATEGORIES = [
  {
    label: 'Poems',
    value: 'poems' as const,
    featured: [
      {
        name: 'Editor Picks',
        href: `/products?category=poems`,
      },
      {
        name: 'Recently Added',
        href: '/products?category=poems&sort=reverse-alphabetical',
      },
      
    ],
  },
  {
    label: 'Novels',
    value: 'novels' as const,
    featured: [
      {
        name: 'Editor Picks',
        href: `/products?category=novels`,
      },
      {
        name: 'Recently Added',
        href: '/products?category=novels&sort=reverse-alphabetical',
      },
      
    ],
  },
  {  
    label: 'Miscellaneous',
    value: 'miscellaneous' as const,
    featured: [
      {
        name: 'Editor Picks',
        href: `/products?category=miscellaneous`,
      },
      {
        name: 'Recently Added',
        href: '/products?category=miscellaneous&sort=reverse-alphabetical',
      },
      
    ],
  },
]

export const PRODUCT_THEMES = [
  {
    label: 'Love',
    value: 'love' as const,
  },
  {
    label: 'Romance',
    value: 'romance' as const,
  },
  {
    label: 'Mystery',
    value: 'mystery' as const,
  },
  {
    label: 'Nature',
    value: 'nature' as const,
  },
  {
    label: 'Contemporary',
    value: 'contemporary' as const,
  },
  {
    label: 'Historical',
    value: 'historical' as const,
  },
  {
    label: 'Social Issues',
    value: 'social_issues' as const,
  },
  {
    label: 'Fantasy',
    value: 'fantasy' as const,
  },
  {
    label: 'Philosophy',
    value: 'philosophy' as const,
  },
  {
    label: 'Personal Growth',
    value: 'personal_growth' as const,
  },
  {
    label: 'Cultural',
    value: 'cultural' as const,
  },
  {
    label: 'Monologue',
    value: 'monologue' as const,
  },
  {
    label: 'Monotone',
    value: 'monotone' as const,
  },
  {
    label: 'Self-Doubt',
    value: 'self_doubt' as const,
  },
  {
    label: 'Mental Health',
    value: 'mental_health' as const,
  },
  {
    label: 'Beauty',
    value: 'beauty' as const,
  },
  {
    label: 'Elegance',
    value: 'elegance' as const,
  },
  {
    label: 'Grace',
    value: 'grace' as const,
  },
  {
    label: 'Exquisiteness',
    value: 'exquisiteness' as const,
  },
  {
    label: 'Charm',
    value: 'charm' as const,
  }
] as const;
