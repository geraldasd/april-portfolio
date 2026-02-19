import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "projectName",
      title: "Project Name",
      type: "string",
      description: "The name of the project.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier (auto-generated from Project Name).",
      options: {
        source: "projectName",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "forField",
      title: "For",
      type: "string",
      description: "Client or purpose of the project.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Location associated with the project.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "Year the project was completed.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description:
        "Cover image for the homepage grid. Must be 3:4 aspect ratio (e.g. 750×1000, 1500×2000).",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Gallery images. Portrait: 3:4 ratio, max 1500×2000px. Landscape: 16:9 ratio, max 2000×1125px.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which the project appears on the homepage (lower = first).",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "projectName",
      subtitle: "year",
      media: "coverImage",
    },
  },
});
