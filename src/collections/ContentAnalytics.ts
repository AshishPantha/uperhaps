import type { CollectionConfig } from 'payload/types';

export const CONTENT_ANALYTICS_EVENTS = ['view'] as const;
export type ContentAnalyticsEventType = (typeof CONTENT_ANALYTICS_EVENTS)[number];

export const ContentAnalytics: CollectionConfig = {
  slug: 'content_analytics',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'eventType', 'createdAt'],
    description: 'Background analytics for content (e.g. views). Created via API.',
  },
  labels: {
    singular: 'Content analytics event',
    plural: 'Content analytics',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => user?.role === 'admin',
    update: () => false,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: CONTENT_ANALYTICS_EVENTS.map((value) => ({ label: value, value })),
      index: true,
    },
  ],
};
