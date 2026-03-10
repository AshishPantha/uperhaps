'use client'

import { useTrackView, useTrackRead, useTrackComplete } from '@/hooks/use-analytics'
import { useEffect, useRef } from 'react'

interface AnalyticsTrackerProps {
  productId: string
}

export default function AnalyticsTracker({ productId }: AnalyticsTrackerProps) {
  useTrackView(productId)
  
  const trackRead = useTrackRead(productId)
  const trackComplete = useTrackComplete(productId)
  const hasTrackedRead = useRef(false)
  const hasTrackedComplete = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0

      // Track "read" when user scrolls past 50% of page
      if (scrollPercent > 0.5 && !hasTrackedRead.current) {
        hasTrackedRead.current = true
        trackRead()
      }

      // Track "complete" when user scrolls past 90% of page
      if (scrollPercent > 0.9 && !hasTrackedComplete.current) {
        hasTrackedComplete.current = true
        trackComplete()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackRead, trackComplete])

  return null
}
