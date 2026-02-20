import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, getProjectSlugs } from '../../../../../sanity/lib/queries'
import { urlFor } from '../../../../../sanity/lib/image'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 10

export async function generateStaticParams() {
  return getProjectSlugs()
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const images = project.images ?? []

  /* Square icon — single filled square */
  const SquareIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <rect x="0" y="0" width="13" height="13" />
    </svg>
  )

  return (
    <div className={styles.gallery}>
      {/* Header */}
      <div className={styles.galleryHeader}>
        <span className={styles.galleryName}>{project.projectName}</span>
        <Link href="/" className={styles.galleryClose} aria-label="Close">
          X
        </Link>
      </div>

      {/* Image grid */}
      <div className={styles.galleryGrid}>
        {images.map((img, i) => (
          <Link
            key={img._key ?? i}
            href={`/projects/${slug}?image=${i}`}
            className={styles.galleryItem}
          >
            {img.asset && (
              <img
                src={urlFor(img).width(400).quality(70).auto('format').url()}
                alt={`${project.projectName} — image ${i + 1}`}
                className={styles.galleryImage}
                loading="lazy"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Footer — square icon links back to viewer */}
      <div className={styles.galleryFooter}>
        <Link
          href={`/projects/${slug}`}
          className={styles.galleryBackBtn}
          aria-label="Back to viewer"
        >
          <SquareIcon />
        </Link>
      </div>
    </div>
  )
}
