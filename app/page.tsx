import Link from "next/link";
import { getProjects } from "../sanity/lib/queries";
import { urlFor } from "../sanity/lib/image";
import styles from "./page.module.css";

interface Project {
  _id: string;
  projectName: string;
  slug: string;
  coverImage: any;
}

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const projects: Project[] = (await getProjects()) ?? [];

  return (
    <section className={styles.projectGrid}>
      {projects.map((project) => (
        <div key={project._id} className={styles.projectCard}>
          <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
            <span className={styles.projectName}>{project.projectName}</span>
            <div className={styles.imageWrapper}>
              {project.coverImage && (
                <img
                  src={urlFor(project.coverImage)
                    .width(800)
                    .height(1067)
                    .auto("format")
                    .url()}
                  alt={project.projectName}
                  className={styles.coverImage}
                  loading="lazy"
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}
