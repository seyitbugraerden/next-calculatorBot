"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getHamSiralama, getYtytSiralama } from "../action";

export default function TytHesaplayici() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      turkce_dogru: "0",
      turkce_yanlis: "0",
      sosyal_dogru: "0",
      sosyal_yanlis: "0",
      matematik_dogru: "0",
      matematik_yanlis: "0",
      fen_dogru: "0",
      fen_yanlis: "0",
      diploma_notu: "60",
    },
  });

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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
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
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        TYT Puan Hesaplayıcı (Spline Doğrulamalı)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {["Türkçe", "Sosyal Bilimler", "Temel Matematik", "Fen Bilimleri"].map(
          (label, idx) => {
            const key = ["turkce", "sosyal", "matematik", "fen"][idx];
            const d = `${key}_dogru`;
            const y = `${key}_yanlis`;
            const m = key === "sosyal" || key === "fen" ? 20 : 40;
            return (
              <div className="flex gap-4 items-center" key={key}>
                <span className="w-32">{label}</span>
                <input
                  type="number"
                  {...register(d as keyof Inputs)}
                  className="border px-2 py-1 w-20"
                />{" "}
                -
                <input
                  type="number"
                  {...register(y as keyof Inputs)}
                  className="border px-2 py-1 w-20"
                />
                <span>{m} Soru</span>
              </div>
            );
          }
        )}
        <div className="flex gap-4 items-center">
          <span className="w-32">Diploma Notu</span>
          <input
            type="number"
            {...register("diploma_notu")}
            className="border px-2 py-1 w-40"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Hesapla
        </button>
      </form>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sonuç</AlertDialogTitle>
            <AlertDialogDescription>
              {error ? (
                <p className="text-red-600 font-medium">{error}</p>
              ) : (
                results && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ham TYT Puanı:</span>
                      <span>{results.ham}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ham TYT Sıralaması:</span>
                      <span>{results.siralamaHam.toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Y-TYT Puanı:</span>
                      <span>{results.yerlestirme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Y-TYT Sıralaması:</span>
                      <span>
                        {results.siralamaYerlestirme.toLocaleString("tr-TR")}
                      </span>
                    </div>
                    <table className="w-full mt-4 text-center border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Ders</th>
                          <th className="border px-2 py-1">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(results.netler).map(([k, v]) => (
                          <tr key={k}>
                            <td className="border px-2 py-1 capitalize">{k}</td>
                            <td className="border px-2 py-1">{v.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
