"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_CATEGORIES =  exports.PRODUCT_THEMES = void 0;

exports.PRODUCT_THEMES = [
    {
        label: 'Love',
        value: 'love',
      },
      {
        label: 'Romance',
        value: 'romance',
      },
      {
        label: 'Mystery',
        value: 'mystery',
      },
      {
        label: 'Nature',
        value: 'nature',
      },
      {
        label: 'Contemporary',
        value: 'contemporary',
      },
      {
        label: 'Historical',
        value: 'historical',
      },
      {
        label: 'Social Issues',
        value: 'social_issues',
      },
      {
        label: 'Fantasy',
        value: 'fantasy',
      },
      {
        label: 'Philosophy',
        value: 'philosophy',
      },
      {
        label: 'Personal Growth',
        value: 'personal_growth',
      },
      {
        label: 'Cultural',
        value: 'cultural',
      },
      {
        label: 'Monologue',
        value: 'monologue',
      },
      {
        label: 'Monotone',
        value: 'monotone',
      },
      {
        label: 'Self-Doubt',
        value: 'self_doubt',
      },
      {
        label: 'Mental Health',
        value: 'mental_health',
      },
      {
        label: 'Beauty',
        value: 'beauty',
      },
      {
        label: 'Elegance',
        value: 'elegance',
      },
      {
        label: 'Grace',
        value: 'grace',
      },
      {
        label: 'Exquisiteness',
        value: 'exquisiteness',
      },
      {
        label: 'Charm',
        value: 'charm',
      }
];

exports.PRODUCT_CATEGORIES = [
    {
        label: 'Poems',
        value: 'poems',
        featured: [
            {
                name: 'Editor Picks',
                href: "/products?category=poems",
            },
            {
                name: 'Recently Added',
                href: '/products?category=poems&sort=reverse-alphabetical',
            },
           
        ],
    },
    {
        label: 'Novels',
        value: 'novels',
        featured: [
            {
                name: 'Editor Picks',
                href: "/products?category=novels",
            },
            {
                name: 'Recently Added',
                href: '/products?category=novels&sort=reverse-alphabetical',
            },
            
        ],
    },
    {  
        label: 'Miscellaneous',
        value: 'miscellaneous' ,
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
];
