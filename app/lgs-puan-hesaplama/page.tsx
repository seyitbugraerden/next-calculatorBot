// Bu bileşen, LGS puan hesaplamasını YKS Robotu'ndaki gibi kart yapılı, sade ve net UI formu ile oluşturur
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Spline from "cubic-spline";
import Image from "next/image";
import Link from "next/link";

const BASE = 196.617;
const COEFFICIENTS = {
  turkce: 4.1075,
  inkilap: 1.7293,
  din: 1.8182,
  yabanci: 1.5308,
  matematik: 4.6325,
  fen: 3.89,
};

const PUAN_SIRA = [
  [196.6174, 887559],
  [210.9958, 810608],
  [214.8858, 788467],
  [237.2207, 661077],
  [241.334, 638439],
  [243.6234, 626027],
  [254.9289, 567148],
  [271.6723, 488708],
  [292.0985, 407290],
  [302.0105, 372836],
  [308.0536, 353177],
  [327.7163, 295092],
  [337.8649, 267886],
  [358.0546, 217744],
  [391.3255, 144666],
  [396.2414, 134837],
  [405.1304, 117659],
  [412.1421, 104652],
  [419.674, 91149],
  [478.2454, 9135],
  [488.6003, 2681],
  [500.0, 1],
];

const x = PUAN_SIRA.map(([puan]) => puan);
const y = PUAN_SIRA.map(([, sira]) => sira);
const spline = new Spline(x, y);

const getSiralamaFromPuan = (puan: number): number => {
  const minPuan = x[0];
  const maxPuan = x[x.length - 1];
  if (puan >= maxPuan) return 1;
  if (puan <= minPuan) return 887559;
  return Math.round(spline.at(puan));
};

const getYuzdelikFromSira = (sira: number): string => {
  const toplam = 992_906;
  const yuzde = (sira / toplam) * 100;
  return `%${yuzde.toFixed(2)}`;
};

export default function LgsHeroForm() {
  const { register, handleSubmit, watch } = useForm();
  const watchAllFields = watch();
  const [puan, setPuan] = useState<number | null>(null);
  const [sira, setSira] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toNet = (d: number, y: number) => Math.max(0, d - y / 3);

  const onSubmit: SubmitHandler<any> = (data) => {
    try {
      const dersler = [
        { key: "turkce", max: 20 },
        { key: "inkilap", max: 10 },
        { key: "din", max: 10 },
        { key: "yabanci", max: 10 },
        { key: "matematik", max: 20 },
        { key: "fen", max: 20 },
      ];
      let toplamPuan = BASE;
      for (const ders of dersler) {
        const d = parseFloat(data[`${ders.key}_d`] || "0");
        const y = parseFloat(data[`${ders.key}_y`] || "0");
        if (d + y > ders.max) throw new Error(`${ders.key} net toplamı fazla.`);
        toplamPuan +=
          toNet(d, y) * COEFFICIENTS[ders.key as keyof typeof COEFFICIENTS];
      }
      setPuan(parseFloat(toplamPuan.toFixed(4)));
      setSira(getSiralamaFromPuan(toplamPuan));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center py-10">
      <div className="flex flex-row justify-center items-center gap-3">
        <Image
          src="/book.png"
          alt="LGS Puan Hesaplayıcı"
          width={32}
          height={32}
        />
        <h1 className="text-3xl font-bold mb-2">LGS Puan Hesaplayıcı</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-200 p-6 rounded-xl shadow space-y-6 mt-12"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "turkce", label: "Türkçe", max: 20 },
            { key: "matematik", label: "Matematik", max: 20 },
            { key: "fen", label: "Fen", max: 20 },
            { key: "inkilap", label: "İnkılap", max: 10 },
            { key: "din", label: "Din", max: 10 },
            { key: "yabanci", label: "Yabancı", max: 10 },
          ].map((ders, idx) => {
            const dogruKey = `${ders.key}_d`;
            const yanlisKey = `${ders.key}_y`;
            const dogru = parseFloat(watchAllFields[dogruKey] || "0");
            const yanlis = parseFloat(watchAllFields[yanlisKey] || "0");
            const dogruMax = Math.max(0, ders.max - yanlis);
            const yanlisMax = Math.max(0, ders.max - dogru);
            const toplamHatalı = dogru + yanlis > ders.max;

            return (
              <div key={idx} className="text-left">
                <label className="block text-sm font-medium mb-1 capitalize">
                  {ders.label}
                </label>
                <div className="flex flex-row items-stretch gap-0">
                  <input
                    type="number"
                    {...register(dogruKey)}
                    placeholder="Doğru"
                    min={0}
                    max={dogruMax}
                    className="w-full sm:w-1/3 border rounded px-2 py-1 text-sm bg-white"
                  />
                  <div className="mx-2">-</div>
                  <input
                    type="number"
                    {...register(yanlisKey)}
                    min={0}
                    max={yanlisMax}
                    placeholder="Yanlış"
                    className="w-full sm:w-1/3 border rounded-l-sm px-2 py-1 text-sm bg-white"
                  />
                  <div>
                    <div className="bg-gray-50 rounded-r-sm text-sm h-full px-2 flex items-center justify-center">
                      {ders.max}
                    </div>
                  </div>
                </div>
                {toplamHatalı && (
                  <p className="text-xs text-red-600 mt-1">
                    Soru sayısından fazla değer girilemez.
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 cursor-pointer"
        >
          Hesapla
        </button>
        {puan !== null && sira !== null && (
          <div className="mt-6 text-left space-y-1">
            <p className="text-lg font-semibold">
              LGS Puanı: <span className="text-green-600">{puan}</span>
            </p>
            <p className="text-lg font-semibold">
              Tahmini Sıralama:{" "}
              <span className="text-blue-600">
                {sira.toLocaleString("tr-TR")}
              </span>
            </p>
            <p className="text-lg font-semibold">
              Yüzdelik Dilim:{" "}
              <span className="text-blue-600">{getYuzdelikFromSira(sira)}</span>
            </p>
          </div>
        )}
        {error && (
          <p className="text-red-600 font-medium mt-2">Hata: {error}</p>
        )}
      </form>
      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        {[
          {
            item: "TYT Puan Hesaplayıcı",
            link: "/tyt-puan-hesaplama",
            color: "36, 112, 38",
          },
          {
            item: "Tyt Kaç Gün Kaldı?",
            link: "/tyt-kac-gun-kaldi",
            color: "25, 80, 148",
          },
          {
            item: "AYT Puan Hesaplayıcı",
            link: "/ayt-puan-hesaplama",
            color: "179, 87, 27",
          },
          {
            item: "AYT Kaç Gün Kaldı?",
            link: "/ayt-kac-gun-kaldi",
            color: "138, 51, 36",
          },
        ].map((x, idx) => (
          <Link
            href={x.link}
            target="_blank"
            key={idx}
            style={{ backgroundColor: `rgba(${x.color},0.2)` }}
            className={`flex flex-row gap-2 items-center px-4 py-2 text-black sm:mx-6 rounded hover:opacity-50 transition duration-300`}
          >
            <Image
              src="/book.svg"
              alt="Book Png"
              width={24}
              height={24}
              style={{ fill: `rgb(${x.color})` }}
            />
            <span className="text-sm font-medium">{x.item}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
