import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Generate static paths for all projects
export async function generateStaticParams() {
  const projects = await getProjects();
  return (projects ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className={styles.projectPage}>
      <header className={styles.projectHeader}>
        <h1 className={styles.title}>{project.projectName}</h1>
        <div className={styles.meta}>
          {project.forField && <p>For: {project.forField}</p>}
          {project.location && <p>Location: {project.location}</p>}
          {project.year && <p>Year: {project.year}</p>}
        </div>
      </header>

      <div className={styles.gallery}>
        {project.images?.map((image: any, i: number) => (
          <div key={image._key ?? i} className={styles.galleryImage}>
            <img
              src={urlFor(image).width(1600).auto("format").url()}
              alt={`${project.projectName} — image ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
