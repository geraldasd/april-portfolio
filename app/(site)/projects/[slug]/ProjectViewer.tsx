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
  initialIndex?: number
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

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

export default function ProjectViewer({ project, siteName, initialIndex = 0 }: Props) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const images = project.images ?? []
  const total = images.length
  const [currentIndex, setCurrentIndex] = useState(Math.min(initialIndex, Math.max(total - 1, 0)))
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(true)
  const [headerHovered, setHeaderHovered] = useState(false)
  const preloadedRef = useRef<Set<number>>(new Set())
  const netRef = useRef(getNetworkQuality())

  /* Touch / swipe tracking */
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

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
      if (isMobile) return
      const half = window.innerWidth / 2
      if (e.clientX >= half) {
        setCurrentIndex((i) => (i + 1) % total)
      } else {
        setCurrentIndex((i) => (i - 1 + total) % total)
      }
    },
    [total, isMobile]
  )

  /* ── Mobile touch handling ─────────────────────────────── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return
      const touch = e.changedTouches[0]
      if (!touch) return
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = Math.abs(touch.clientY - touchStartY.current)
      // Horizontal swipe: must be >50px and more horizontal than vertical
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX < 0) {
          setCurrentIndex((i) => (i + 1) % total)
        } else {
          setCurrentIndex((i) => (i - 1 + total) % total)
        }
      } else {
        // Tap — left half = prev, right half = next
        const tapDeltaX = Math.abs(touch.clientX - touchStartX.current)
        const tapDeltaY = Math.abs(touch.clientY - touchStartY.current)
        if (tapDeltaX < 20 && tapDeltaY < 20) {
          const half = window.innerWidth / 2
          if (touch.clientX >= half) {
            setCurrentIndex((i) => (i + 1) % total)
          } else {
            setCurrentIndex((i) => (i - 1 + total) % total)
          }
        }
      }
    },
    [total, isMobile]
  )

  const { width: netW, quality: netQ } = netRef.current
  const currentImage = images[currentIndex]

  /* ── Gallery icon (2×2 squares) ─────────────────────────── */
  const GalleryIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <rect x="0" y="0" width="5" height="5" />
      <rect x="8" y="0" width="5" height="5" />
      <rect x="0" y="8" width="5" height="5" />
      <rect x="8" y="8" width="5" height="5" />
    </svg>
  )

  return (
    <div
      className={styles.viewer}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseEnter={!isMobile ? () => setShowCursor(true) : undefined}
      onMouseLeave={!isMobile ? () => setShowCursor(false) : undefined}
    >
      {/* ── DESKTOP header zone ───────────────────────────── */}
      {!isMobile && (
        <>
          <div
            className={styles.headerZone}
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
          >
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
          <button
            className={styles.closeButton}
            onClick={() => router.push('/')}
            aria-label="Close project"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="0" x2="13" y2="13" /><line x1="13" y1="0" x2="0" y2="13" /></svg>
          </button>
        </>
      )}

      {/* ── MOBILE header ─────────────────────────────────── */}
      {isMobile && (
        <div className={styles.mobileHeader}>
          <span className={styles.mobileHeaderName}>{project.projectName}</span>
          <button
            className={styles.mobileCloseBtn}
            onClick={() => router.push('/')}
            aria-label="Close project"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="0" x2="13" y2="13" /><line x1="13" y1="0" x2="0" y2="13" /></svg>
          </button>
        </div>
      )}

      {/* ── Image area ───────────────────────────────────── */}
      <div
        className={styles.imageArea}
        onClick={!isMobile ? handleClick : undefined}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        {currentImage?.asset && (
          <img
            key={currentIndex}
            src={getImageUrl(currentImage, netW, netQ)}
            alt={`${project.projectName} — ${currentIndex + 1} of ${total}`}
            className={styles.mainImage}
            draggable={false}
          />
        )}
      </div>

      {/* ── MOBILE footer ─────────────────────────────────── */}
      {isMobile && (
        <div className={styles.mobileFooter}>
          <span className={styles.mobileCounter}>
            {currentIndex + 1}/{total}
          </span>
          <Link
            href={`/projects/${project.slug}/gallery`}
            className={styles.mobileGalleryBtn}
            aria-label="View gallery"
          >
            <GalleryIcon />
          </Link>
        </div>
      )}

      {/* ── DESKTOP cursor follower ──────────────────────── */}
      {!isMobile && showCursor && !headerHovered && total > 0 && (
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
