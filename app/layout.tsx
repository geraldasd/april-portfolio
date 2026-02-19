import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import Header from "./Header";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "April Li — Portfolio",
  description: "Portfolio of April Li",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spectral.variable}>
      <body>
        {/*
          .page-wrapper: position:relative + 10px side padding.
          .site-header inside is position:absolute so it doesn't
          push any content down — main's padding-top:200px sets
          the exact distance from page top to the first image row.
        */}
        <div className="page-wrapper">
          <Header />
          <main style={{ paddingTop: "200px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
