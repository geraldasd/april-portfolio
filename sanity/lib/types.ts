// ── Sanity image asset types ─────────────────────────────────
// Used across queries and the <SanityImage /> component.

/** Metadata returned when projecting `asset->metadata` in GROQ. */
export interface SanityImageMetadata {
  lqip: string; // base-64 data URI ~20px wide
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

/** Asset reference — kept intact (not dereferenced) so urlFor() works. */
export interface SanityAssetRef {
  _ref: string;
  _type: "reference";
}

/**
 * Shape returned by the GROQ image projection.
 * `asset` is the raw reference (for urlFor()),
 * `metadata` is pulled from the dereferenced asset as a sibling field.
 */
export interface SanityImageField {
  _type: "image";
  _key?: string;
  asset: SanityAssetRef;
  metadata: SanityImageMetadata;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ── Document-level types ────────────────────────────────────

/** Homepage project card — only the fields the grid needs. */
export interface ProjectCard {
  _id: string;
  projectName: string;
  slug: string;
  coverImage: SanityImageField;
}

/** Full project document for the detail page. */
export interface ProjectDetail extends ProjectCard {
  forField?: string;
  location?: string;
  year?: string;
  images?: SanityImageField[];
}

/** Information singleton. */
export interface Information {
  name: string;
  email: string;
  description?: string;
}
