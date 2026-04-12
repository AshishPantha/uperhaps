import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { QueryValidator } from '../lib/validators/query-validator';
import { getPayloadClient } from '../get-payload';
import { authRouter } from './auth-router';

export const appRouter = router({
  auth: authRouter,

  trackView: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        sessionId: z.string(),
        eventType: z.enum(['view', 'read', 'complete']).default('view'),
        referrer: z.string().optional(),
        userAgent: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const payload = await getPayloadClient();
        
        const headers = ctx?.req?.headers as Record<string, string | string[] | undefined> | undefined
        const userAgent =
          (typeof headers?.['user-agent'] === 'string'
            ? headers?.['user-agent']
            : Array.isArray(headers?.['user-agent'])
              ? headers?.['user-agent'][0]
              : undefined) || input.userAgent
        
        await payload.create({
          collection: 'analytics',
          data: {
            product: input.productId,
            sessionId: input.sessionId,
            eventType: input.eventType,
            referrer: input.referrer,
            userAgent,
          },
        });

        return { success: true };
      } catch (error) {
        console.error('Analytics trackView error:', error);
        throw error;
      }
    }),

  getProductAnalytics: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const payload = await getPayloadClient();
      
      const [totalViews, uniqueViews, readEvents, completeEvents] = await Promise.all([
        payload.count({
          collection: 'analytics',
          where: {
            product: {
              equals: input.productId,
            },
            eventType: {
              equals: 'view',
            },
          },
        }),
        payload.find({
          collection: 'analytics',
          where: {
            product: {
              equals: input.productId,
            },
          },
          limit: 0,
        }).then((res) => new Set(res.docs.map((d: any) => d.sessionId)).size),
        payload.count({
          collection: 'analytics',
          where: {
            product: {
              equals: input.productId,
            },
            eventType: {
              equals: 'read',
            },
          },
        }),
        payload.count({
          collection: 'analytics',
          where: {
            product: {
              equals: input.productId,
            },
            eventType: {
              equals: 'complete',
            },
          },
        }),
      ]);

      const recentViews = await payload.find({
        collection: 'analytics',
        where: {
          product: {
            equals: input.productId,
          },
          eventType: {
            equals: 'view',
          },
        },
        sort: '-createdAt',
        limit: 10,
      });

      return {
        totalViews,
        uniqueViews,
        readEvents,
        completeEvents,
        recentViews: recentViews.docs,
      };
    }),

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator.extend({
          excludeId: z.string().optional(),
        }),
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit = 10, excludeId, author, theme, ...queryOpts } = query; // Default limit to 10 if undefined

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string } | { contains: string }> = {};
      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      let sortOption: string = '-createdAt'; // Default sort
      switch (sort) {
        case 'recent':
          sortOption = '-createdAt';
          break;
        case 'oldest':
          sortOption = 'createdAt';
          break;
        case 'alphabetical':
          sortOption = 'name';
          break;
        case 'reverse-alphabetical':
          sortOption = '-name';
          break;
      }

      const whereClause: Record<string, any> = {
        approvedForSale: {
          equals: 'approved',
        },
        ...parsedQueryOpts,
        ...(excludeId
          ? {
              id: {
                not_equals: excludeId,
              },
            }
          : {}),
        ...(author
          ? {
              author: {
                equals: author,
              },
            }
          : {}),
        ...(theme
          ? {
              themes: {
                contains: theme,
              },
            }
          : {}),
      };

      const { docs: items, hasNextPage, nextPage } = await payload.find({
        collection: 'products',
        where: whereClause,
        sort: sortOption,
        depth: 1,
        limit: limit * 4, // Fetch more items than needed
        page,
      });

      let selectedItems = items;

      // If it's a recommendation query (i.e., excludeId is present), randomize the results
      if (excludeId) {
        const shuffledItems = items.sort(() => 0.5 - Math.random());
        selectedItems = shuffledItems.slice(0, limit);
      } else {
        // For normal queries, just use the sorted results
        selectedItems = items.slice(0, limit);
      }

      return {
        items: selectedItems,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});


export type AppRouter = typeof appRouter
