import { defineType, defineField } from "sanity";

export const information = defineType({
  name: "information",
  title: "Information",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Used in the header logo and Info page (e.g. 'April Li').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Displayed on the Info page.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Short bio or title shown on the Info page (e.g. 'Student of Architecture').",
      rows: 3,
    }),
  ],
  // Singleton behavior is enforced via the custom structure (sanity/structure.ts):
  // the document is always opened by a fixed ID "information" with no "create new" option.
});
