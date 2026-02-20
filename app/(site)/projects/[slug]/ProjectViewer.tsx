'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ProjectDetail, SanityImageField } from '../../../../sanity/lib/types'
import { urlFor } from '../../../../sanity/lib/image'
import styles from './ProjectViewer.module.css'

interface Props {
  project: ProjectDetail
  siteName: string
}

export default function ProjectViewer({ project, siteName }: Props) {
  const router = useRouter()
  const images = project.images ?? []
  const total = images.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [headerHovered, setHeaderHovered] = useState(false)

  /* Lock body scroll while viewer is mounted */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

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

  const getImageUrl = (image: SanityImageField) => {
    if (!image?.asset) return ''
    return urlFor(image).width(1600).quality(80).auto('format').url()
  }

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
            src={getImageUrl(currentImage)}
            alt={`${project.projectName} — ${currentIndex + 1} of ${total}`}
            className={styles.mainImage}
          />
        )}
      </div>

      {/* ── Cursor follower ──────────────────────────────── */}
      {showCursor && !headerHovered && total > 0 && (
        <div
          className={styles.cursorFollower}
          style={{ left: cursorPos.x, top: cursorPos.y + 20 }}
        >
          {currentIndex + 1}/{total}
        </div>
      )}
    </div>
  )
}
