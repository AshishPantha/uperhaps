import { CollectionConfig } from 'payload/types';
import { PRODUCT_CATEGORIES, PRODUCT_THEMES } from '../../config';
import { Product } from '../../payload-types';
import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { lexicalEditor, HTMLConverterFeature, AlignFeature } from '@payloadcms/richtext-lexical';

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;
  return { ...data, user: user.id };
};

const updateFieldsBeforeChange: BeforeChangeHook<Product> = async ({ data, operation }) => {
  if (operation === 'create' || !data.publishedDate) {
    data.publishedDate = new Date().toISOString();
  }
  return data;
};


export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  labels: {
    singular: 'Content',
    plural: 'Contents',
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
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
  },
  hooks: {
    beforeChange: [addUser,updateFieldsBeforeChange],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    
    {
      name: 'description',
      label: 'Content Description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
          AlignFeature(),
        ],
      }),
    },
    {
      name: 'description_html',
      type: 'textarea', //changed
      admin: {
        hidden: true,
      },
    },
    {
      name: 'author',
      label: 'Author',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Content Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: 'context',
      label: 'Written Context',
      type: 'text',
      
    },
    {
      name: 'themes',
      label: 'Content Themes',
      type: 'select',
      hasMany: true,
      options: PRODUCT_THEMES.map(({ label, value }) => ({ label, value })),
      required: true,
      admin: {
        description: 'Select one or more themes that best describe your content'
      }
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200
  },
  {
    name: 'publishedDate',
    type: 'date',
    admin: {
      readOnly: true,
      description: 'Automatically set on creation and updates'
    }
  },
    {
      name: 'approvedForSale',
      label: 'Content Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: () => true,
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Content Images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: '📊 Analytics',
      admin: {
        description: 'View how your content is performing',
      },
      fields: [
        {
          name: 'totalViews',
          type: 'number',
          label: 'Total Views',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'uniqueViews',
          type: 'number',
          label: 'Unique Visitors',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'readCount',
          type: 'number',
          label: 'Times Read',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'completionCount',
          type: 'number',
          label: 'Completions',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastUpdated',
          type: 'date',
          label: 'Last Updated',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
};