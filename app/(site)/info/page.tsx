import { getInformation } from "../../../sanity/lib/queries";
import styles from "./page.module.css";

export const revalidate = 10;

export default async function InfoPage() {
  const info = await getInformation();

  return (
    <section className={styles.infoPage}>
      <div className={styles.content}>
        {info?.description && (
          <p className={styles.description}>{info.description}</p>
        )}
        {info?.email && (
          <p className={styles.email}>
            <a href={`mailto:${info.email}`}>{info.email}</a>
          </p>
        )}
      </div>
    </section>
  );
}
