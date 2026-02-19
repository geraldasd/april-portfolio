import Link from "next/link";
import { getInformation } from "../sanity/lib/queries";

export default async function Header() {
  const info = await getInformation();
  const name = info?.name ?? "April Li";

  return (
    <header className="site-header">
      <div className="col-name">
        <Link href="/">{name}</Link>
      </div>
      {/* columns 2 & 3 — empty */}
      <div />
      <div />
      <div className="col-info">
        <Link href="/info">Info</Link>
      </div>
    </header>
  );
}
