import createImageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

// ── Shared builder ──────────────────────────────────────────
const builder = createImageUrlBuilder({ projectId, dataset });

/** Low-level helper – returns an ImageUrlBuilder for any Sanity image source. */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

