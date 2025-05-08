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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Inputs = {
  turkce_dogru: string;
  turkce_yanlis: string;
  sosyal_dogru: string;
  sosyal_yanlis: string;
  matematik_dogru: string;
  matematik_yanlis: string;
  fen_dogru: string;
  fen_yanlis: string;
  diploma_notu: string;
};

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
      diploma_notu: "0",
    },
  });
  const [error, setError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [results, setResults] = useState<{
    ham: number;
    yerlestirme: number;
    netler: {
      turkce: number;
      sosyal: number;
      matematik: number;
      fen: number;
    };
  } | null>(null);

  const toNumber = (val: any) =>
    parseFloat(String(val).replace(",", ".") || "0");
  const clamp = (value: number, max: number) =>
    Math.min(Math.max(value, 0), max);
  const calculateNet = (dogru: number, yanlis: number) =>
    Math.max(0, dogru - yanlis / 4);

  const getCalibratedTytScore = ({
    turkce,
    sosyal,
    matematik,
    fen,
  }: {
    turkce: number;
    sosyal: number;
    matematik: number;
    fen: number;
  }) => {
    const ham =
      144.945 +
      2.908 * turkce +
      2.937 * sosyal +
      2.925 * matematik +
      3.148 * fen;
    return parseFloat(ham.toFixed(5));
  };

  const validateMax = (dogru: number, yanlis: number, max: number) =>
    clamp(dogru + yanlis, max) === dogru + yanlis;

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

    if (Object.values(data).every((val) => toNumber(val) === 0)) {
      setError("Lütfen veri giriniz.");
      setIsAlertOpen(true);
      return;
    }

    for (const { d, y, max, name } of dersler) {
      if (!validateMax(toNumber(d), toNumber(y), max)) {
        setError(
          `${name} alanında doğru ve yanlış toplamı en fazla ${max} olabilir.`
        );
        setIsAlertOpen(true);
        return;
      }
    }

    const netler = {
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
    const yerlestirme = ham + obp * 5 * 0.12;

    setResults({
      ham,
      yerlestirme: parseFloat(yerlestirme.toFixed(5)),
      netler,
    });
    setIsAlertOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        TYT Puan Hesaplayıcı (2024 Kalibrasyonlu)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {["Türkçe", "Sosyal Bilimler", "Temel Matematik", "Fen Bilimleri"].map(
          (label, idx) => {
            const key = ["turkce", "sosyal", "matematik", "fen"][idx];
            const d = `${key}_dogru`;
            const y = `${key}_yanlis`;
            const m = key === "sosyal" || key === "fen" ? 20 : 40;
            return (
              <div className="flex gap-4 items-center" key={label}>
                <span className="w-32">{label}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  {...register(d as keyof Inputs)}
                  className="border px-2 py-1 w-20"
                />
                -
                <input
                  type="number"
                  inputMode="decimal"
                  {...register(y as keyof Inputs)}
                  className="border px-2 py-1 w-20"
                />
                <span>{m} Soru</span>
              </div>
            );
          }
        )}
        <div className="flex items-center gap-4">
          <span className="w-32">Diploma Notu</span>
          <input
            type="number"
            inputMode="decimal"
            {...register("diploma_notu")}
            className="border px-2 py-1 w-40"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Hesapla
        </button>
      </form>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {error ? "Uyarı" : "Hesaplama Sonuçları"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error ? (
                error
              ) : results ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ham TYT Puanı:</span>
                    <span className="font-bold text-blue-700">
                      {results.ham}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yerleştirme TYT Puanı:</span>
                    <span className="font-bold text-green-700">
                      {results.yerlestirme}
                    </span>
                  </div>
                  <table className="mt-4 w-full text-center border">
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
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsAlertOpen(false)}
              className="cursor-pointer"
            >
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
