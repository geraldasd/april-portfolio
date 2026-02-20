'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ProjectDetail, SanityImageField } from '../../../../sanity/lib/types'
import { urlFor } from '../../../../sanity/lib/image'
import styles from './ProjectViewer.module.css'

interface Props {
  project: ProjectDetail
  siteName: string
}

/* ── Network-aware image quality ─────────────────────────── */
function getNetworkQuality(): { width: number; quality: number } {
  if (typeof navigator === 'undefined') return { width: 1600, quality: 80 }
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection
  if (!conn) return { width: 1600, quality: 80 }
  if (conn.saveData) return { width: 800, quality: 50 }
  switch (conn.effectiveType) {
    case 'slow-2g':
    case '2g':
      return { width: 800, quality: 50 }
    case '3g':
      return { width: 1200, quality: 65 }
    default:
      return { width: 1600, quality: 80 }
  }
}

function getImageUrl(image: SanityImageField, netWidth?: number, netQuality?: number) {
  if (!image?.asset) return ''
  const w = netWidth ?? 1600
  const q = netQuality ?? 80
  return urlFor(image).width(w).quality(q).auto('format').url()
}

export default function ProjectViewer({ project, siteName }: Props) {
  const router = useRouter()
  const images = project.images ?? []
  const total = images.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(true)
  const [headerHovered, setHeaderHovered] = useState(false)
  const preloadedRef = useRef<Set<number>>(new Set())
  const netRef = useRef(getNetworkQuality())

  /* Lock body scroll while viewer is mounted */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  /* Sync scrollbar width as CSS variable so headers align with home page */
  useEffect(() => {
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-w', `${scrollbarW}px`)
    return () => {
      document.documentElement.style.removeProperty('--scrollbar-w')
    }
  }, [])

  /* ── Preload adjacent images ────────────────────────────── */
  useEffect(() => {
    const { width, quality } = netRef.current
    const toPreload: number[] = []

    // Preload 2 ahead and 1 behind (adapt range to network)
    const ahead = quality >= 65 ? 2 : 1
    for (let offset = -1; offset <= ahead; offset++) {
      const idx = currentIndex + offset
      if (idx >= 0 && idx < total && idx !== currentIndex && !preloadedRef.current.has(idx)) {
        toPreload.push(idx)
      }
    }

    toPreload.forEach((idx) => {
      const img = images[idx]
      if (img?.asset) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = getImageUrl(img, width, quality)
        document.head.appendChild(link)
        preloadedRef.current.add(idx)
      }
    })
  }, [currentIndex, images, total])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const half = window.innerWidth / 2
      if (e.clientX >= half) {
        setCurrentIndex((i) => Math.min(i + 1, total - 1))
      } else {
        setCurrentIndex((i) => Math.max(i - 1, 0))
      }
    },
    [total]
  )

  const { width: netW, quality: netQ } = netRef.current
  const currentImage = images[currentIndex]

  return (
    <div
      className={styles.viewer}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      {/* ── Header zone ───────────────────────────────────── */}
      <div
        className={styles.headerZone}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        {/* Project header – default */}
        <div
          className={styles.headerRow}
          style={{
            opacity: headerHovered ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span className={styles.headerCol}>{project.projectName}</span>
          <span className={styles.headerCol}>{project.forField ?? ''}</span>
          <span className={styles.headerCol}>{project.location ?? ''}</span>
          <span className={styles.headerCol}>{project.year ?? ''}</span>
        </div>

        {/* Home header – revealed on hover */}
        <div
          className={`${styles.headerRow} ${styles.headerRowAlt}`}
          style={{
            opacity: headerHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span className={styles.headerCol}>
            <Link href="/">{siteName}</Link>
          </span>
          <span className={styles.headerCol} />
          <span className={styles.headerCol} />
          <span className={styles.headerCol}>
            <Link href="/info">Info</Link>
          </span>
        </div>
      </div>

      {/* ── X close – always visible ─────────────────────── */}
      <button
        className={styles.closeButton}
        onClick={() => router.push('/')}
        aria-label="Close project"
      >
        X
      </button>

      {/* ── Image area ───────────────────────────────────── */}
      <div className={styles.imageArea} onClick={handleClick}>
        {currentImage?.asset && (
          <img
            key={currentIndex}
            src={getImageUrl(currentImage, netW, netQ)}
            alt={`${project.projectName} — ${currentIndex + 1} of ${total}`}
            className={styles.mainImage}
          />
        )}
      </div>

      {/* ── Cursor follower ──────────────────────────────── */}
      {showCursor && !headerHovered && total > 0 && (
        <div
          className={styles.cursorFollower}
          style={{ left: cursorPos.x, top: cursorPos.y + 30 }}
        >
          {currentIndex + 1}/{total}
        </div>
      )}
    </div>
  )
}
