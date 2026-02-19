import Header from "./Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <Header />
      <main>{children}</main>
    </div>
  );
}
