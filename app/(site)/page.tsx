import Link from "next/link";
import Image from "next/image";
import { getProjects } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";
import styles from "./page.module.css";

interface Project {
  _id: string;
  projectName: string;
  slug: string;
  coverImage: any;
}

export const revalidate = 10;

export default async function HomePage() {
  const projects: Project[] = (await getProjects()) ?? [];

  return (
    <section className={styles.projectGrid}>
      {projects.map((project) => (
        <div key={project._id} className={styles.projectCard}>
          <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
            {/* Project name — visible only on hover, 5px above image */}
            <span className={styles.projectName}>{project.projectName}</span>

            {/* Cover image — enforced 3:4 ratio via aspect-ratio on wrapper */}
            <div className={styles.imageWrapper}>
              {project.coverImage ? (
                <Image
                  src={urlFor(project.coverImage)
                    .width(800)
                    .height(1067)
                    .auto("format")
                    .url()}
                  alt={project.projectName}
                  fill
                  className={styles.coverImage}
                  sizes="(max-width: 768px) 50vw, 25vw"
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
