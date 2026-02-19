import { groq } from "next-sanity";
import { client } from "./client";

// Fetch the singleton "information" document
export async function getInformation() {
  return client.fetch(
    groq`*[_type == "information"][0]{
      name,
      email,
      description
    }`
  );
}

// Fetch all projects ordered by their order field
export async function getProjects() {
  return client.fetch(
    groq`*[_type == "project"] | order(order asc) {
      _id,
      projectName,
      "slug": slug.current,
      forField,
      location,
      year,
      coverImage,
      images
    }`
  );
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string) {
  return client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      projectName,
      "slug": slug.current,
      forField,
      location,
      year,
      coverImage,
      images
    }`,
    { slug }
  );
}
