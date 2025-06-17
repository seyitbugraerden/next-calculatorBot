import { seoElements } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: seoElements.lgsPuan.title,
  description: seoElements.lgsPuan.description,
  alternates: {
    canonical: seoElements.lgsPuan.cannonical,
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
