import { seoElements } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: seoElements.aytPuan.title,
  description: seoElements.aytPuan.description,
  alternates: {
    canonical: seoElements.aytPuan.cannonical,
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
