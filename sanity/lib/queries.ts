import { groq } from "next-sanity";
import { client } from "./client";
import type { Information, ProjectCard, ProjectDetail, SiteSettings } from "./types";

// ── Reusable GROQ fragment for image fields with LQIP ──────
// Keep `asset` as-is (preserves _ref for urlFor()) and pull
// metadata from the dereferenced asset document as a sibling.
const imageProjection = `{
  _type,
  _key,
  asset,
  "metadata": asset->metadata { lqip, dimensions },
  hotspot,
  crop
}`;

// ── Information (singleton) ─────────────────────────────────
export async function getInformation(): Promise<Information | null> {
  return client.fetch(
    groq`*[_type == "information"][0]{
      name,
      email,
      description
    }`
  );
}

// ── Homepage cards — minimal payload ────────────────────────
export async function getProjects(): Promise<ProjectCard[]> {
  return client.fetch(
    groq`*[_type == "project"] | order(order asc) {
      _id,
      projectName,
      "slug": slug.current,
      "coverImage": coverImage ${imageProjection}
    }`
  );
}

// ── Project detail ──────────────────────────────────────────
export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  return client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      projectName,
      "slug": slug.current,
      forField,
      location,
      year,
      "coverImage": coverImage ${imageProjection},
      "images": images[] ${imageProjection}
    }`,
    { slug }
  );
}

// ── Static-param helper (lightweight) ───────────────────────
export async function getProjectSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    groq`*[_type == "project"]{ "slug": slug.current }`
  );
}

// ── SEO settings (singleton) ────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    groq`*[_type == "siteSettings"][0]{
      seoTitle,
      seoDescription,
      ogTitle,
      ogDescription,
      "ogImageUrl": ogImage.asset->url,
      siteUrl
    }`
  );
}
