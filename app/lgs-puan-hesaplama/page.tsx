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

const BASE = 196.617;
const COEFFICIENTS = {
  turkce: 4.1075,
  inkilap: 1.7293,
  din: 1.8182,
  yabanci: 1.5308,
  matematik: 4.6325,
  fen: 3.89,
};

type Inputs = {
  turkce_dogru: string;
  turkce_yanlis: string;
  inkilap_dogru: string;
  inkilap_yanlis: string;
  din_dogru: string;
  din_yanlis: string;
  yabanci_dogru: string;
  yabanci_yanlis: string;
  matematik_dogru: string;
  matematik_yanlis: string;
  fen_dogru: string;
  fen_yanlis: string;
};

export default function LgsHesaplayici() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      turkce_dogru: "0",
      turkce_yanlis: "0",
      inkilap_dogru: "0",
      inkilap_yanlis: "0",
      din_dogru: "0",
      din_yanlis: "0",
      yabanci_dogru: "0",
      yabanci_yanlis: "0",
      matematik_dogru: "0",
      matematik_yanlis: "0",
      fen_dogru: "0",
      fen_yanlis: "0",
    },
  });

  const [error, setError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [lgsPuan, setLgsPuan] = useState<number | null>(null);
  const [netler, setNetler] = useState<Record<string, number> | null>(null);

  const toNumber = (val: any) =>
    parseFloat(String(val).replace(",", ".") || "0");
  const clamp = (value: number, max: number) =>
    Math.min(Math.max(value, 0), max);
  const calculateNet = (dogru: number, yanlis: number) =>
    Math.max(0, dogru - yanlis / 3);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dersler = [
      {
        key: "turkce",
        name: "Türkçe",
        d: "turkce_dogru",
        y: "turkce_yanlis",
        max: 20,
      },
      {
        key: "inkilap",
        name: "İnkılap",
        d: "inkilap_dogru",
        y: "inkilap_yanlis",
        max: 10,
      },
      { key: "din", name: "Din", d: "din_dogru", y: "din_yanlis", max: 10 },
      {
        key: "yabanci",
        name: "Yabancı",
        d: "yabanci_dogru",
        y: "yabanci_yanlis",
        max: 10,
      },
      {
        key: "matematik",
        name: "Matematik",
        d: "matematik_dogru",
        y: "matematik_yanlis",
        max: 20,
      },
      { key: "fen", name: "Fen", d: "fen_dogru", y: "fen_yanlis", max: 20 },
    ];

    const calculated: Record<string, number> = {};

    for (const ders of dersler) {
      const dogru = toNumber(data[ders.d as keyof Inputs]);
      const yanlis = toNumber(data[ders.y as keyof Inputs]);
      if (clamp(dogru + yanlis, ders.max) !== dogru + yanlis) {
        setError(
          `${ders.name} dersi için doğru + yanlış toplamı ${ders.max} geçemez.`
        );
        setIsAlertOpen(true);
        return;
      }
      calculated[ders.key] = calculateNet(dogru, yanlis);
    }

    if (Object.values(calculated).every((n) => n === 0)) {
      setError("Lütfen en az bir net giriniz.");
      setIsAlertOpen(true);
      return;
    }

    let puan = BASE;
    for (const key in calculated) {
      puan += calculated[key] * COEFFICIENTS[key as keyof typeof COEFFICIENTS];
    }

    setNetler(calculated);
    setLgsPuan(parseFloat(puan.toFixed(4)));
    setError("");
    setIsAlertOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        LGS Puan Hesaplayıcı (Dialog Göstergeli)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {["turkce", "inkilap", "din", "yabanci", "matematik", "fen"].map(
          (label) => {
            const key = label.toLowerCase();
            const d = key + "_dogru";
            const y = key + "_yanlis";
            const m =
              label === "turkce" || label === "matematik" || label === "fen"
                ? 20
                : 10;
            return (
              <div className="flex gap-4 items-center" key={label}>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
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
                <div className="space-y-4">
                  <p className="text-lg">
                    <strong>LGS Puanı:</strong>{" "}
                    <span className="text-green-700 font-bold">{lgsPuan}</span>
                  </p>
                  <table className="w-full text-center border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Ders</th>
                        <th className="border px-2 py-1">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {netler &&
                        Object.entries(netler).map(([k, v]) => (
                          <tr key={k}>
                            <td className="border px-2 py-1 capitalize">{k}</td>
                            <td className="border px-2 py-1">{v.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
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
