import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "SEO & Social Sharing",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Page title shown in browser tabs and search results (e.g. 'April Li — Portfolio').",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      description: "Short description for search engines and social media previews (max 160 characters).",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "ogTitle",
      title: "Social Share Title",
      type: "string",
      description: "Title shown when the site is shared on social media. Falls back to SEO Title if empty.",
    }),
    defineField({
      name: "ogDescription",
      title: "Social Share Description",
      type: "text",
      description: "Description shown when the site is shared on social media. Falls back to SEO Description if empty.",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Image shown when the site is shared (recommended: 1200×630px).",
      options: { hotspot: true },
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "The canonical URL of the site (e.g. https://april-portfolio-sigma.vercel.app).",
    }),
  ],
});
