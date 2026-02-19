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
 * Handles both `fill` mode (no width/height) and intrinsic mode
 * (width/height from Sanity metadata) automatically.
 */
export default function SanityImage({
  image,
  alt,
  requestWidth,
  fill,
  ...rest
}: SanityImageProps) {
  // Guard: if metadata is missing, fall back to a basic <img>
  if (!image.metadata?.dimensions) {
    const fallbackSrc = urlFor(image).width(800).auto("format").url();
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackSrc} alt={alt} {...(rest as Record<string, unknown>)} />;
  }

  const { lqip, dimensions } = image.metadata;
  const w = requestWidth ?? Math.min(dimensions.width, 1600);

  const src = urlFor(image)
    .width(w)
    .quality(75)
    .auto("format")
    .url();

  // When `fill` is used, next/image forbids width/height.
  // When `fill` is NOT used, we supply intrinsic dimensions.
  const sizeProps = fill
    ? { fill: true as const }
    : { width: dimensions.width, height: dimensions.height };

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip || undefined}
      {...sizeProps}
      {...rest}
    />
  );
}
