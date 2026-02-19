import Link from "next/link";
import { getInformation } from "../sanity/lib/queries";
import styles from "./Header.module.css";

export default async function Header() {
  const info = await getInformation();
  const name = info?.name ?? "April Li";

  return (
    <header className={`${styles.header} grid-4`}>
      <div className={styles.logo}>
        <Link href="/">{name}</Link>
      </div>
      {/* Empty columns 2 & 3 */}
      <div />
      <div />
      <div className={styles.info}>
        <Link href="/info">Info</Link>
      </div>
    </header>
  );
}
