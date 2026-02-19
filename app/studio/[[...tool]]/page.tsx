/**
 * Embedded Sanity Studio — client-only, no SSR.
 * Uses next/dynamic with ssr:false to avoid server-rendering
 * styled-components / Sanity UI which require browser APIs.
 */
'use client'

import dynamic from 'next/dynamic'

const Studio = dynamic(() => import('./StudioClient'), { ssr: false })

export default function StudioPage() {
  return <Studio />
}
