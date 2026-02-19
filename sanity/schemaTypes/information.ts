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
  ],
  // Prevent creating multiple information documents
  __experimental_actions: [/* "create", */ "update", "delete", "publish"],
});
