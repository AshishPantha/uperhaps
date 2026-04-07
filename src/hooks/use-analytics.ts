import { useEffect, useRef } from 'react'
import { trpc } from '@/trpc/client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AnalyticsState = {
  sessionId: string | null
  getSessionId: () => string
}

const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('analytics_session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('analytics_session', sessionId)
  }
  return sessionId
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      getSessionId: () => {
        const state = get()
        if (state.sessionId) return state.sessionId
        const newId = getOrCreateSessionId()
        set({ sessionId: newId })
        return newId
      },
    }),
    {
      name: 'analytics-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
)

export function useTrackView(productId: string) {
  const trackViewMutation = trpc.trackView.useMutation()
  const hasTracked = useRef(false)
  const getSessionId = useAnalyticsStore((state) => state.getSessionId)

  useEffect(() => {
    if (hasTracked.current || !productId) return

    hasTracked.current = true
    const sessionId = getSessionId()

    trackViewMutation.mutate({
      productId,
      sessionId,
      eventType: 'view',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    })
  }, [getSessionId, productId, trackViewMutation])
}

export function useTrackRead(productId: string) {
  const trackViewMutation = trpc.trackView.useMutation()
  const hasTracked = useRef(false)
  const getSessionId = useAnalyticsStore((state) => state.getSessionId)

  return () => {
    if (hasTracked.current || !productId) return

    hasTracked.current = true
    const sessionId = getSessionId()

    trackViewMutation.mutate({
      productId,
      sessionId,
      eventType: 'read',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    })
  }
}

export function useTrackComplete(productId: string) {
  const trackViewMutation = trpc.trackView.useMutation()
  const hasTracked = useRef(false)
  const getSessionId = useAnalyticsStore((state) => state.getSessionId)

  return () => {
    if (hasTracked.current || !productId) return

    hasTracked.current = true
    const sessionId = getSessionId()

    trackViewMutation.mutate({
      productId,
      sessionId,
      eventType: 'complete',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    })
  }
}
