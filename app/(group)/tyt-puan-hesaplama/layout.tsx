import { seoElements } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: seoElements.tytPuan.title,
  description: seoElements.tytPuan.description,
  alternates: {
    canonical: seoElements.tytPuan.cannonical,
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
