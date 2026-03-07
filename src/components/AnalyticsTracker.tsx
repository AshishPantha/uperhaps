'use client'

import { useTrackView } from '@/hooks/use-analytics'

interface AnalyticsTrackerProps {
  productId: string
}

export default function AnalyticsTracker({ productId }: AnalyticsTrackerProps) {
  useTrackView(productId)
  return null
}
