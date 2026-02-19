import type { Metadata } from "next";
import { Spectral } from "next/font/google";
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
      <body>{children}</body>
    </html>
  );
}
