import { seoElements } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: seoElements.ydtPuan.title,
  description: seoElements.ydtPuan.description,
  alternates: {
    canonical: seoElements.ydtPuan.cannonical,
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
