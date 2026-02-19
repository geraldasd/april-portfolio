import Image from "next/image";
import type { ComponentProps } from "react";

import { sanityLoader } from "../../sanity/lib/image";
import type { SanityImageField } from "../../sanity/lib/types";

// ── Props ───────────────────────────────────────────────────
// Omit keys that SanityImage handles automatically.
type NextImageProps = Omit<
  ComponentProps<typeof Image>,
  "src" | "loader" | "blurDataURL" | "placeholder"
>;

export interface SanityImageProps extends NextImageProps {
  /** Sanity image field — must include `asset->metadata{lqip, dimensions}`. */
  image: SanityImageField;
}

// ── Component ───────────────────────────────────────────────
/**
 * Reusable wrapper around `next/image` that:
 *  1. Uses Sanity's CDN as the image source (custom loader).
 *  2. Applies a blur-up LQIP placeholder automatically.
 *
 * This is a **Server Component** — no `'use client'` needed.
 */
export default function SanityImage({ image, alt, ...rest }: SanityImageProps) {
  const { lqip, dimensions } = image.asset.metadata;

  return (
    <Image
      loader={sanityLoader(image)}
      src={image.asset._ref} // opaque src — the loader builds the real URL
      alt={alt}
      placeholder="blur"
      blurDataURL={lqip}
      // Supply intrinsic dimensions so Next.js can compute aspect ratio
      // when `fill` is NOT used. When `fill` is passed via `...rest`,
      // Next.js ignores width/height automatically.
      width={dimensions.width}
      height={dimensions.height}
      {...rest}
    />
  );
}
