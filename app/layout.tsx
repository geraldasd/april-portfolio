import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import { getSiteSettings } from "../sanity/lib/queries";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-spectral",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSettings();

  const title = seo?.seoTitle || "April Li — Portfolio";
  const description = seo?.seoDescription || "Portfolio of April Li";
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const siteUrl = seo?.siteUrl || "https://april-portfolio-sigma.vercel.app";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteUrl,
      siteName: title,
      type: "website",
      ...(seo?.ogImageUrl
        ? {
            images: [
              {
                url: seo.ogImageUrl,
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(seo?.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spectral.variable}>
      <body>{children}</body>
    </html>
  );
}
