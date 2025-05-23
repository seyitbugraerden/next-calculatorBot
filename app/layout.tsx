import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterLinks from "@/components/footer-links";
import LogoDep from "@/components/logo";
import Link from "next/link";
import { MdLocalPhone } from "react-icons/md";
import { IoMailSharp } from "react-icons/io5";
import { PiMapPinFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";
import { TbWorldExclamation } from "react-icons/tb";

export const metadata: Metadata = {
  title: "Odtünet | LGS, TYT, AYT, YDT  Puan Hesaplama ve Sınav Geri Sayım",
  description:
    "LGS, TYT, AYT, YDT için doğru ve güncel puan hesaplama araçları, sınav geri sayım sayaçları ve sınava hazırlık kaynakları ODTÜNet Dershanesi'nde sizi bekliyor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="overflow-x-hidden relative w-screen h-screen">
        <header className="w-screen bg-[#301A51] text-white px-4 py-2">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-between">
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
              <div className="text-xs flex flex-row gap-2 items-center">
                <PiMapPinFill size={18} className="text-[#DF3639]" />
                Bulvar Palas İş Merkezi, No:141 / 89 A Blok Kat: 8, Kızılay /
                Ankara
              </div>
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
        <main className="min-[2000px]:scale-120 min-[2500px]:scale-120 min-[2000px]:origin-top max-w-[90%] mx-auto pb-12">
          {children}
        </main>
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
