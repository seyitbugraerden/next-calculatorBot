"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { getHamSiralama, getYtytSiralama } from "../action";
import Image from "next/image";
import Link from "next/link";
import ContentTitle from "@/components/content-title";
import FooterLinks from "@/components/footer-links";

export default function TytHesaplayici() {
  const { register, handleSubmit, watch } = useForm();
  const watchAllFields = watch();

  const [error, setError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [results, setResults] = useState<{
    ham: number;
    yerlestirme: number;
    siralamaHam: number;
    siralamaYerlestirme: number;
    netler: Record<string, number>;
  } | null>(null);

  const toNumber = (val: any) =>
    parseFloat(String(val).replace(",", ".") || "0");
  const clamp = (value: number, max: number) =>
    Math.min(Math.max(value, 0), max);
  const calculateNet = (d: number, y: number) => Math.max(0, d - y / 4);

  const getCalibratedTytScore = ({
    turkce,
    sosyal,
    matematik,
    fen,
  }: Record<string, number>) => {
    const ham =
      144.98 +
      2.908 * turkce +
      2.937 * sosyal +
      2.925 * matematik +
      3.148 * fen;
    return parseFloat(ham.toFixed(5));
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    const dersler = [
      {
        key: "turkce",
        name: "Türkçe",
        d: data.turkce_dogru,
        y: data.turkce_yanlis,
        max: 40,
      },
      {
        key: "sosyal",
        name: "Sosyal",
        d: data.sosyal_dogru,
        y: data.sosyal_yanlis,
        max: 20,
      },
      {
        key: "matematik",
        name: "Matematik",
        d: data.matematik_dogru,
        y: data.matematik_yanlis,
        max: 40,
      },
      {
        key: "fen",
        name: "Fen",
        d: data.fen_dogru,
        y: data.fen_yanlis,
        max: 20,
      },
    ];

    for (const { d, y, max, name } of dersler) {
      if (toNumber(d) + toNumber(y) > max) {
        setError(`${name} dersi için doğru + yanlış toplamı ${max} geçemez.`);
        setIsAlertOpen(true);
        return;
      }
    }

    const netler: Record<string, number> = {
      turkce: calculateNet(
        toNumber(data.turkce_dogru),
        toNumber(data.turkce_yanlis)
      ),
      sosyal: calculateNet(
        toNumber(data.sosyal_dogru),
        toNumber(data.sosyal_yanlis)
      ),
      matematik: calculateNet(
        toNumber(data.matematik_dogru),
        toNumber(data.matematik_yanlis)
      ),
      fen: calculateNet(toNumber(data.fen_dogru), toNumber(data.fen_yanlis)),
    };

    const obp = clamp(toNumber(data.diploma_notu), 100);
    const ham = getCalibratedTytScore(netler);
    const yerlestirme = parseFloat((ham + obp * 5 * 0.12).toFixed(5));

    const siralamaHam = getHamSiralama(ham);
    const siralamaYerlestirme = getYtytSiralama(yerlestirme);

    setResults({ ham, yerlestirme, siralamaHam, siralamaYerlestirme, netler });
    setError("");
    setIsAlertOpen(true);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-full max-w-xl mx-auto text-center py-10">
        <ContentTitle title="TYT Puan Hesaplayıcı" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200 p-6 rounded-xl shadow space-y-6 mt-12"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "turkce", label: "Türkçe", max: 40 },
              { key: "matematik", label: "Matematik", max: 40 },
              { key: "sosyal", label: "Sosyal", max: 20 },
              { key: "fen", label: "Fen", max: 20 },
            ].map((ders, idx) => {
              const dogruKey = `${ders.key}_dogru`;
              const yanlisKey = `${ders.key}_yanlis`;
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
                      className="w-full sm:w-1/3 border rounded px-2 py-1 text-sm bg-white"
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
          <div className="flex flex-col items-start">
            <label className="block text-sm font-medium mb-1 capitalize">
              Diploma Notu
            </label>
            <input
              type="number"
              {...register("diploma_notu")}
              className="w-full border rounded-l-sm px-2 py-1 text-sm bg-white"
              defaultValue={50}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#DF3639] text-white font-semibold rounded hover:bg-[#DF3639]/70 cursor-pointer"
          >
            Hesapla
          </button>
          {results !== null && (
            <div className="mt-6 text-left space-y-1">
              <p className="text-lg font-semibold">
                TYT Puanı: <span className="text-green-600">{results.ham}</span>
              </p>
              <p className="text-lg font-semibold">
                Tahmini Sıralama:{" "}
                <span className="text-blue-600">
                  {results.siralamaHam.toLocaleString("tr-TR")}
                </span>
              </p>
              <p className="text-lg font-semibold">
                TYT Yerleştirme Puanı:{" "}
                <span className="text-green-600">{results.yerlestirme}</span>
              </p>
              <p className="text-lg font-semibold">
                Tahmini Yerleştirme Sıralama:{" "}
                <span className="text-blue-600">
                  {results.siralamaYerlestirme.toLocaleString("tr-TR")}
                </span>
              </p>
            </div>
          )}
        </form>
        <FooterLinks />
      </div>
    </div>
  );
}
