'use client'

type AnalyticsPayload = Record<string, unknown>

class Analytics {
  track(event: string, payload: AnalyticsPayload = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[analytics]', event, payload)
    }
    // Placeholder for real analytics integration
    try {
      ;(window as any)?.analytics?.track?.(event, payload)
    } catch (error) {
      console.warn('Analytics track failed', error)
    }
  }
}

export const analytics = new Analytics()


