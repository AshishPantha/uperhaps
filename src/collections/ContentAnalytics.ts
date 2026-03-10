import { CollectionConfig } from 'payload/types'

export const ContentAnalytics: CollectionConfig = {
  slug: 'content-analytics',
  labels: {
    singular: 'Analytics',
    plural: 'Analytics',
  },
  admin: {
    useAsTitle: 'product',
    defaultColumns: [
      'product',
      'totalViews',
      'uniqueViews',
      'readCount',
      'completionCount',
      'lastUpdated',
    ],
    hidden: ({ user }) => user.role !== 'admin',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'product',
      type: 'text',
      required: true,
    },
    {
      name: 'totalViews',
      type: 'number',
      label: 'Total Views',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'uniqueViews',
      type: 'number',
      label: 'Unique Visitors',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'readCount',
      type: 'number',
      label: 'Times Read',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'completionCount',
      type: 'number',
      label: 'Completions',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last Updated',
    },
  ],
}
