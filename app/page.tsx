import FooterLinks from "@/components/footer-links";
import Link from "next/link";
import React from "react";

const links = [
  { href: "/tyt-kac-gun-kaldi", label: "TYT Kaç Gün Kaldı" },
  { href: "/ayt-kac-gun-kaldi", label: "AYT Kaç Gün Kaldı" },
  { href: "/lgs-kac-gun-kaldi", label: "LGS Kaç Gün Kaldı" },
  { href: "/ayt-puan-hesaplama", label: "AYT Puan Hesaplama" },
  { href: "/tyt-puan-hesaplama", label: "TYT Puan Hesaplama" },
  { href: "/lgs-puan-hesaplama", label: "LGS Puan Hesaplama" },
];

const Page = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center space-y-4">
      <FooterLinks />
    </div>
  );
};

export default Page;
