import Image from "next/image";
import type { ComponentProps } from "react";

import { urlFor } from "../../sanity/lib/image";
import type { SanityImageField } from "../../sanity/lib/types";

// ── Props ───────────────────────────────────────────────────
type NextImageProps = Omit<
  ComponentProps<typeof Image>,
  "src" | "blurDataURL" | "placeholder"
>;

export interface SanityImageProps extends NextImageProps {
  /** Sanity image field — must include `asset->metadata{lqip, dimensions}`. */
  image: SanityImageField;
  /** Width to request from Sanity CDN (default: intrinsic width, capped at 1600). */
  requestWidth?: number;
}

// ── Component ───────────────────────────────────────────────
/**
 * Server Component wrapper around `next/image` that:
 *  1. Pre-computes the Sanity CDN URL on the server (auto=format, sized).
 *  2. Applies LQIP blur-up placeholder automatically.
 *
 * No loader function needed — `images.unoptimized: true` in next.config
 * means Next.js passes the `src` string through unchanged.
 */
export default function SanityImage({
  image,
  alt,
  requestWidth,
  ...rest
}: SanityImageProps) {
  const { lqip, dimensions } = image.metadata;

  // Cap request width to something sensible
  const w = requestWidth ?? Math.min(dimensions.width, 1600);

  const src = urlFor(image)
    .width(w)
    .quality(75)
    .auto("format")
    .url();

  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={lqip}
      width={dimensions.width}
      height={dimensions.height}
      {...rest}
    />
  );
}
