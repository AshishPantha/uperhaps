import type { Where } from 'payload/types';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { QueryValidator } from '../lib/validators/query-validator';
import { getPayloadClient } from '../get-payload';
import { authRouter } from './auth-router';
import { CONTENT_ANALYTICS_EVENTS } from '../collections/ContentAnalytics';

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

  /** Recommend content by context: same author, shared themes, same category (genre). */
  getRecommendedProducts: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ input }) => {
      const { productId, limit } = input;
      const payload = await getPayloadClient();

      const { docs: sourceProducts } = await payload.find({
        collection: 'products',
        where: {
          id: { equals: productId },
          approvedForSale: { equals: 'approved' },
        },
        limit: 1,
        depth: 0,
      });
      const source = sourceProducts[0];
      if (!source) return { items: [] };

      const author = source.author as string;
      const category = source.category as string;
      const themes = (source.themes as string[]) || [];

      const orConditions: Where[] = [
        { author: { equals: author } },
        { category: { equals: category } },
      ];
      themes.forEach((theme) => {
        orConditions.push({ themes: { contains: theme } });
      });

      const { docs: candidates } = await payload.find({
        collection: 'products',
        where: {
          id: { not_equals: productId },
          approvedForSale: { equals: 'approved' },
          or: orConditions,
        },
        depth: 1,
        limit: 50,
        sort: '-publishedDate',
      });

      type ProductDoc = (typeof candidates)[number];
      const scored = candidates.map((doc: ProductDoc) => {
        const dAuthor = doc.author as string;
        const dCategory = doc.category as string;
        const dThemes = (doc.themes as string[]) || [];
        let score = 0;
        if (dAuthor === author) score += 3;
        if (dCategory === category) score += 2;
        const matchingThemes = dThemes.filter((t) => themes.includes(t));
        score += matchingThemes.length * 2;
        return { doc, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const items = scored.slice(0, limit).map(({ doc }) => doc);

      return { items };
    }),

  /** Record a content analytics event in the background (e.g. view). */
  recordContentEvent: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        eventType: z.enum([...CONTENT_ANALYTICS_EVENTS] as [string, ...string[]]),
      })
    )
    .mutation(async ({ input }) => {
      const payload = await getPayloadClient();
      await payload.create({
        collection: 'content_analytics',
        data: {
          product: input.productId,
          eventType: input.eventType as 'view',
        },
      });
      return { ok: true };
    }),
});


export type AppRouter = typeof appRouter