import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImageSlider from "../components/ui/image-slider";
import ContentAbout from "@/components/content-about";
import { CardDemo } from "@/components/ui/card-demo";
import ContentCard from "@/components/content-card";

const Page = () => {
  return (
    <>
      {/* <ImageSlider /> */}
      {/* <ContentAbout /> */}
      <ContentCard
        title="PUAN HESAPLAMA"
        content="KIZILAY DERSHANE"
        data={[
          {
            item: "LGS Puan Hesaplayıcı",
            link: "/lgs-puan-hesaplama",
            description: "",
            calculator: true,
          },
          {
            item: "TYT Puan Hesaplayıcı",
            link: "/tyt-puan-hesaplama",
            description: "",
            calculator: true,
          },
          {
            item: "AYT Puan Hesaplayıcı",
            link: "/ayt-puan-hesaplama",
            description: "",
            calculator: true,
          },
          {
            item: "YDT Puan Hesaplayıcı",
            link: "/ydt-puan-hesaplama",
            description: "",
            calculator: true,
          },
        ]}
      />
      <ContentCard
        title="KAÇ GÜN KALDI ?"
        content="KIZILAY DERSHANE"
        data={[
          {
            item: "LGS Kaç Gün Kaldı ?",
            link: "/lgs-kac-gun-kaldi",
            color: "25, 80, 148",
          },
          {
            item: "TYT Kaç Gün Kaldı ?",
            link: "/tyt-kac-gun-kaldi",
            color: "134, 14, 181",
          },
          {
            item: "AYT Kaç Gün Kaldı ?",
            link: "/ayt-kac-gun-kaldi",
            color: "138, 51, 36",
          },
          {
            item: "YDT Kaç Gün Kaldı ?",
            link: "/ydt-kac-gun-kaldi",
            color: "138, 51, 36",
          },
        ]}
      />

      <div className="w-full lg:max-w-6xl mx-auto text-center py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"></div>
      </div>
    </>
  );
};

export default Page;
