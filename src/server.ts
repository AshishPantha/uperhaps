import express from 'express'
import { getPayloadClient } from './get-payload'
import { nextApp, nextHandler } from './next-utils'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './trpc'
import { inferAsyncReturnType } from '@trpc/server'
import bodyParser from 'body-parser'
import { IncomingMessage } from 'http'
import nextBuild from 'next/dist/build'
import path from 'path'
import { PayloadRequest } from 'payload/types'
import { parse } from 'url'

const app = express()
const PORT = Number(process.env.PORT) || 3000

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
})

export type ExpressContext = inferAsyncReturnType<
  typeof createContext
>

export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer
}

const backfillContentAnalytics = async (payload: any) => {
  const [analyticsCount, contentCount] = await Promise.all([
    payload.find({ collection: 'analytics', limit: 0 }),
    payload.find({ collection: 'content-analytics', limit: 0, overrideAccess: true }),
  ])

  if (contentCount?.docs?.length > 0) {
    for (const doc of contentCount.docs as any[]) {
      if (!doc.product) continue
      const productDoc = await payload.find({
        collection: 'products',
        where: { id: { equals: doc.product } },
        limit: 1,
        overrideAccess: true,
      })
      if (productDoc.docs[0]?.name && productDoc.docs[0].name !== doc.product) {
        await payload.update({
          collection: 'content-analytics',
          id: doc.id,
          data: { product: productDoc.docs[0].name },
          overrideAccess: true,
        })
      }
    }
    return
  }

  if (analyticsCount?.docs?.length === 0) return

  const events = await payload.find({
    collection: 'analytics',
    limit: 0,
    overrideAccess: true,
  })

  const byProduct = new Map<
    string,
    {
      sessions: Set<string>
      totalViews: number
      readCount: number
      completionCount: number
      lastUpdated: string
    }
  >()

  for (const doc of events.docs as any[]) {
    const productId =
      typeof doc.product === 'string'
        ? doc.product
        : doc.product?.id || doc.product?.value

    if (!productId) continue

    const existing = byProduct.get(productId) ?? {
      sessions: new Set<string>(),
      totalViews: 0,
      readCount: 0,
      completionCount: 0,
      lastUpdated: doc.updatedAt || doc.createdAt || new Date().toISOString(),
    }

    if (doc.sessionId) existing.sessions.add(doc.sessionId)
    if (doc.eventType === 'view') existing.totalViews += 1
    if (doc.eventType === 'read') existing.readCount += 1
    if (doc.eventType === 'complete') existing.completionCount += 1

    const docUpdated = doc.updatedAt || doc.createdAt
    if (docUpdated && docUpdated > existing.lastUpdated) {
      existing.lastUpdated = docUpdated
    }

    byProduct.set(productId, existing)
  }

  for (const [productId, stats] of Array.from(byProduct.entries())) {
    const productDoc = await payload.find({
      collection: 'products',
      where: { id: { equals: productId } },
      limit: 1,
      overrideAccess: true,
    })
    const productName = productDoc.docs[0]?.name || productId

    await payload.create({
      collection: 'content-analytics',
      data: {
        product: productName,
        totalViews: stats.totalViews,
        uniqueViews: stats.sessions.size,
        readCount: stats.readCount,
        completionCount: stats.completionCount,
        lastUpdated: stats.lastUpdated,
      },
      overrideAccess: true,
    })
  }
}

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer
    },
  })

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`)
      },
    },
  })

  await backfillContentAnalytics(payload)

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info('Next.js is building for production')
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })
    return
  }

  const cartRouter = express.Router()
  cartRouter.use(payload.authenticate)

  cartRouter.get('/', (req, res) => {
    const request = req as PayloadRequest
    const parsedUrl = parse(req.url, true)
    const { query } = parsedUrl

    if (!request.user) {
      // Store the intended destination in the session or query parameter
      return res.redirect('/sign-in?origin=favorites')
    }

    // User is authenticated, render the favorites page
    return nextApp.render(req, res, '/favorites', query)
  })

  app.use('/favorites', cartRouter)

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )

  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info('Next.js started')
    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      )
    })
  })
}

start()
