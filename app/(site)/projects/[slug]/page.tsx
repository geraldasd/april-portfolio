import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "../../../../sanity/lib/queries";
import SanityImage from "../../../components/SanityImage";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 10;

export async function generateStaticParams() {
  return getProjectSlugs();
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
        {project.images?.map((image, i) => (
          <div key={image._key ?? i} className={styles.galleryImage}>
            {image.asset ? (
              <SanityImage
                image={image}
                alt={`${project.projectName} — image ${i + 1}`}
                sizes="(max-width: 768px) 100vw, 80vw"
                className={styles.galleryImg}
                loading="lazy"
              />
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
