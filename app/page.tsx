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
      <div className="w-1/6 flex flex-col text-center gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-2 rounded-xl bg-blue-400 hover:bg-blue-500 transition duration-300 text-white w-full"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
