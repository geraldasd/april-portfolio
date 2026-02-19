import createImageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { ImageLoaderProps } from "next/image";

import { dataset, projectId } from "../env";
import type { SanityImageField } from "./types";

// ── Shared builder ──────────────────────────────────────────
const builder = createImageUrlBuilder({ projectId, dataset });

/** Low-level helper – returns an ImageUrlBuilder for any Sanity image source. */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

// ── Next.js custom loader ───────────────────────────────────
// Passed to <Image loader={…}> so Next.js never runs its own
// image optimiser — every request goes straight to Sanity's CDN.

/**
 * Build a `loader` function scoped to a specific Sanity image.
 * The returned function satisfies Next.js `ImageLoaderProps`.
 */
export function sanityLoader(image: SanityImageField) {
  return ({ width, quality }: ImageLoaderProps): string =>
    urlFor(image)
      .width(width)
      .quality(quality ?? 75)
      .auto("format") // webp / avif when supported
      .url();
}

