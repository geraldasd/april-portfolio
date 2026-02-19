'use client'

import { useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

/**
 * Suppress known React console warnings from Sanity UI internals.
 * These are harmless: @sanity/ui passes custom boolean attributes
 * (showCheckerboard, picked, updating) to native DOM elements.
 */
function useSuppressSanityWarnings() {
  useEffect(() => {
    const orig = console.error
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (
        msg.includes('showCheckerboard') ||
        msg.includes('`picked`') ||
        msg.includes('`updating`')
      ) {
        return // swallow known Sanity UI warnings
      }
      orig.apply(console, args)
    }
    return () => {
      console.error = orig
    }
  }, [])
}

export default function StudioClient() {
  useSuppressSanityWarnings()
  return <NextStudio config={config} />
}
