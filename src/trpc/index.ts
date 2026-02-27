import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { QueryValidator } from '../lib/validators/query-validator';
import { getPayloadClient } from '../get-payload';
import { authRouter } from './auth-router';

export const appRouter = router({
  auth: authRouter,

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
      const { sort, limit = 10, excludeId, ...queryOpts } = query; // Default limit to 10 if undefined

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string }> = {};
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

      const { docs: items, hasNextPage, nextPage } = await payload.find({
        collection: 'products',
        where: {
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
        },
        sort: sortOption,
        depth: 1,
        limit: limit * 2, // Fetch more items than needed
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