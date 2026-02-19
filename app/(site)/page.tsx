import Link from "next/link";
import { getProjects } from "../../sanity/lib/queries";
import SanityImage from "../components/SanityImage";
import styles from "./page.module.css";

export const revalidate = 10;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <section className={styles.projectGrid}>
      {projects.map((project) => (
        <div key={project._id} className={styles.projectCard}>
          <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
            <span className={styles.projectName}>{project.projectName}</span>

            <div className={styles.imageWrapper}>
              {project.coverImage?.asset ? (
                <SanityImage
                  image={project.coverImage}
                  alt={project.projectName}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={styles.coverImage}
                />
              ) : (
                <div className={styles.coverImage} />
              )}
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}
