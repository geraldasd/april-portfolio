import { getInformation } from "../../../sanity/lib/queries";
import styles from "./page.module.css";

export const revalidate = 60;

export default async function InfoPage() {
  const info = await getInformation();

  return (
    <section className={styles.infoPage}>
      <div className={styles.content}>
        <h1 className={styles.name}>{info?.name ?? "April Li"}</h1>
        {info?.email && (
          <p className={styles.email}>
            <a href={`mailto:${info.email}`}>{info.email}</a>
          </p>
        )}
      </div>
    </section>
  );
}
