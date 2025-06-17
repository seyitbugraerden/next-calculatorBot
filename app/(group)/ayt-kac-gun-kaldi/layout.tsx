import { seoElements } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: seoElements.aytCountdown.title,
  description: seoElements.aytCountdown.description,
  alternates: {
    canonical: seoElements.aytCountdown.cannonical,
  },
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <section className="container">{children}</section>
    </html>
  );
}
