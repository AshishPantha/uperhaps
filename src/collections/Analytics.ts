import { CollectionConfig } from 'payload/types';
import { AfterChangeHook } from 'payload/dist/collections/config/types';

const updateProductStats: AfterChangeHook = async ({ req, doc, operation }) => {
  if (operation !== 'create' || !doc.product) return

  const payload = req.payload

  let productId: string
  if (typeof doc.product === 'string') {
    productId = doc.product
  } else if (doc.product && typeof doc.product === 'object' && 'value' in doc.product) {
    productId = (doc.product as { value: string }).value
  } else {
    return
  }

  const allEvents = await payload.find({
    collection: 'analytics',
    where: {
      product: { equals: productId },
    },
    limit: 0,
  })

  const uniqueSessions = new Set(allEvents.docs.map((d: any) => d.sessionId)).size
  const totalViews = allEvents.docs.filter((d: any) => d.eventType === 'view').length
  const readCount = allEvents.docs.filter((d: any) => d.eventType === 'read').length
  const completionCount = allEvents.docs.filter((d: any) => d.eventType === 'complete').length
  const lastUpdated = new Date().toISOString()

  try {
    const existing = await payload.find({
      collection: 'content-analytics',
      where: {
        product: { equals: productId },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'content-analytics',
        id: existing.docs[0].id,
        data: {
          product: productId,
          totalViews,
          uniqueViews: uniqueSessions,
          readCount,
          completionCount,
          lastUpdated,
        },
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'content-analytics',
        data: {
          product: productId,
          totalViews,
          uniqueViews: uniqueSessions,
          readCount,
          completionCount,
          lastUpdated,
        },
        overrideAccess: true,
      })
    }
  } catch (err) {
    console.error('Failed to update content analytics:', err)
  }
}

export const Analytics: CollectionConfig = {
  slug: 'analytics',
  admin: {
    useAsTitle: 'product',
    hidden: true,
  },
  hooks: {
    afterChange: [updateProductStats],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'View', value: 'view' },
        { label: 'Read', value: 'read' },
        { label: 'Complete', value: 'complete' },
      ],
      defaultValue: 'view',
    },
    {
      name: 'referrer',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'country',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
};
