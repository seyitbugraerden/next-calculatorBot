import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Mulish } from "next/font/google";
import LogoDep from "@/components/logo";
import Link from "next/link";
import { MdLocalPhone } from "react-icons/md";
import { IoMailSharp } from "react-icons/io5";
import { PiMapPinFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";
import { TbWorldExclamation } from "react-icons/tb";
import { seoElements } from "@/lib/seo";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: seoElements.home.title,
  description: seoElements.home.description,
  alternates: {
    canonical: seoElements.home.cannonical,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={mulish.className}>
      <body className="overflow-x-hidden relative w-screen h-screen">
        <header className="w-screen bg-[#301A51] text-white px-4 py-2">
          <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-between">
            <div className="flex pt-4 lg:pt-0 flex-col lg:flex-row gap-5 items-center ">
              <Link
                href="tel:903124198494"
                target="_blank"
                className="text-xs flex flex-row gap-2 items-center hover:text-[#DF3639] duration-200"
              >
                <MdLocalPhone size={18} className="text-[#DF3639] " />
                +90 (312) 419 8494
              </Link>{" "}
              <Link
                href="mailto:info@odtunet.com"
                target="_blank"
                className="text-xs flex flex-row gap-2 items-center hover:text-[#DF3639] duration-200"
              >
                <IoMailSharp size={18} className="text-[#DF3639]" />
                info@odtunet.com
              </Link>{" "}
              <Link
                href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14d34fa9c0ff03e5:0x5a1ce5974c25277b?sa=X&ved=1t:8290&ictx=111"
                target="_blank"
                className="text-xs flex flex-row gap-2 items-center hover:text-[#DF3639] duration-200"
              >
                <PiMapPinFill size={18} className="text-[#DF3639]" />
                Bulvar Palas İş Merkezi, No:141 / 89 A Blok Kat: 8, Kızılay /
                Ankara
              </Link>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Link
                href="https://www.youtube.com/@odtunet"
                target="_blank"
                className="text-xs flex flex-row gap-2 items-center hover:text-[#DF3639] duration-200"
              >
                <FaYoutube
                  size={14}
                  className="text-white hover:text-[#DF3639] duration-200"
                />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/odtunet/?igsh=MWEyYWFjNDRxOWhmZw%3D%3D#"
                className="text-xs flex flex-row gap-2 items-centerhover:text-[#DF3639] duration-200"
              >
                <SiInstagram
                  size={14}
                  className="text-white hover:text-[#DF3639] duration-200"
                />
              </Link>
            </div>
          </div>
        </header>
        <main className="">{children}</main>
        <LogoDep />{" "}
        <footer className="w-screen bg-[#301A51] text-white px-4 py-3 fixed bottom-0">
          <div className="max-w-6xl mx-auto flex justify-center items-center">
            <Link
              href="https://odtunet.com/"
              target="_blank"
              className="text-xs flex flex-row gap-2 items-center hover:text-[#DF3639] duration-200"
            >
              <TbWorldExclamation size={18} className="text-[#DF3639]" />
              www.odtunet.com
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
