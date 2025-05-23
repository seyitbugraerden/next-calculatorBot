import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="w-full lg:max-w-6xl mx-auto text-center py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {[
            {
              item: "LGS Puan Hesaplayıcı",
              link: "/lgs-puan-hesaplama",
              color: "36, 112, 38",
              calculator: true,
            },
            {
              item: "LGS Kaç Gün Kaldı ?",
              link: "/lgs-kac-gun-kaldi",
              color: "25, 80, 148",
            },
            {
              item: "TYT Puan Hesaplayıcı",
              link: "/tyt-puan-hesaplama",
              color: "14, 14, 181",
              calculator: true,
            },
            {
              item: "TYT Kaç Gün Kaldı ?",
              link: "/tyt-kac-gun-kaldi",
              color: "134, 14, 181",
            },
            {
              item: "AYT Puan Hesaplayıcı",
              link: "/ayt-puan-hesaplama",
              color: "199, 252, 5",
              calculator: true,
            },
            {
              item: "AYT Kaç Gün Kaldı ?",
              link: "/ayt-kac-gun-kaldi",
              color: "138, 51, 36",
            },
            {
              item: "YDT Puan Hesaplayıcı",
              link: "/ydt-puan-hesaplama",
              color: "199, 252, 5",
              calculator: true,
            },
            {
              item: "YDT Kaç Gün Kaldı ?",
              link: "/ydt-kac-gun-kaldi",
              color: "138, 51, 36",
            },
          ].map((x, idx) => (
            <Link
              href={x.link}
              key={idx}
              className={`flex flex-row gap-2 items-center justify-center sm:justify-start px-4 py-2 text-black bg-gray-200 sm:mx-6 rounded-md hover:bg-[#DF3639] hover:text-white  transition duration-300 text-nowrap whitespace-nowrap w-full text`}
            >
              {x.calculator && (
                <Image
                  src="/calculator.png"
                  alt="Calculator Png"
                  width={16}
                  height={16}
                  style={{ fill: `rgb(${x.color})` }}
                />
              )}
              {!x.calculator && (
                <Image
                  src="/clock.png"
                  alt="Book Png"
                  width={16}
                  height={16}
                  style={{ fill: `rgb(${x.color})` }}
                />
              )}
              <span className="text-sm font-medium">{x.item}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
