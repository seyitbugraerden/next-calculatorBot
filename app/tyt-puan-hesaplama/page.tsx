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

  const downloadPDF = () => {
    if (!results) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("TYT Puan Hesaplama Sonuçlari (2025)", 14, 20);

    doc.setFontSize(12);
    doc.text(`Ham TYT Puani: ${results.ham.toFixed(5)}`, 14, 30);
    doc.text(
      `Yerlestirme TYT Puani: ${results.yerlestirme.toFixed(5)}`,
      14,
      38
    );

    const netEntries = Object.entries(results.netler).map(([ders, net]) => [
      ders.charAt(0).toUpperCase() + ders.slice(1),
      net.toFixed(2),
    ]);

    const totalNet = netEntries.reduce(
      (acc, [, net]) => acc + parseFloat(net),
      0
    );

    netEntries.push(["Toplam Net", totalNet.toFixed(2)]);

    autoTable(doc, {
      startY: 50,
      head: [["Ders", "Net"]],
      body: netEntries,
    });

    doc.save("tyt-sonuc.pdf");
  };

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
    const inputPairs = [
      { d: data.turkce_dogru, y: data.turkce_yanlis, max: 40, name: "Türkçe" },
      { d: data.sosyal_dogru, y: data.sosyal_yanlis, max: 20, name: "Sosyal" },
      {
        d: data.matematik_dogru,
        y: data.matematik_yanlis,
        max: 40,
        name: "Matematik",
      },
      { d: data.fen_dogru, y: data.fen_yanlis, max: 20, name: "Fen" },
    ];

    if (Object.values(data).every((val) => toNumber(val) === 0)) {
      setError("Lütfen veri giriniz.");
      setIsAlertOpen(true);
      return;
    }

    for (const { d, y, max, name } of inputPairs) {
      if (!validateMax(toNumber(d), toNumber(y), max)) {
        setError(
          `${name} alanında doğru ve yanlış toplamı en fazla ${max} olabilir.`
        );
        setIsAlertOpen(true);
        return;
      }
    }

    setError("");

    const turkceNet = calculateNet(
      clamp(toNumber(data.turkce_dogru), 40),
      clamp(toNumber(data.turkce_yanlis), 40)
    );
    const sosyalNet = calculateNet(
      clamp(toNumber(data.sosyal_dogru), 20),
      clamp(toNumber(data.sosyal_yanlis), 20)
    );
    const matematikNet = calculateNet(
      clamp(toNumber(data.matematik_dogru), 40),
      clamp(toNumber(data.matematik_yanlis), 40)
    );
    const fenNet = calculateNet(
      clamp(toNumber(data.fen_dogru), 20),
      clamp(toNumber(data.fen_yanlis), 20)
    );
    const obp = clamp(toNumber(data.diploma_notu), 100);

    const ham = getCalibratedTytScore({
      turkce: turkceNet,
      sosyal: sosyalNet,
      matematik: matematikNet,
      fen: fenNet,
    });
    const obpKatkisi = obp * 5 * 0.12;
    const yerlestirme = ham + obpKatkisi;

    setResults({
      ham,
      yerlestirme: parseFloat(yerlestirme.toFixed(5)),
      netler: {
        turkce: turkceNet,
        sosyal: sosyalNet,
        matematik: matematikNet,
        fen: fenNet,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto h-screen my-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">
        TYT Puan Hesaplayıcı (2024 Kalibrasyonlu)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          {
            label: "Türkçe",
            d: "turkce_dogru",
            y: "turkce_yanlis",
            m: 40,
          },
          {
            label: "Sosyal Bilimler",
            d: "sosyal_dogru",
            y: "sosyal_yanlis",
            m: 20,
          },
          {
            label: "Temel Matematik",
            d: "matematik_dogru",
            y: "matematik_yanlis",
            m: 40,
          },
          {
            label: "Fen Bilimleri",
            d: "fen_dogru",
            y: "fen_yanlis",
            m: 20,
          },
        ].map(({ label, d, y, m }) => (
          <div className="flex gap-4 items-center" key={label}>
            <span className="w-32">{label}</span>
            <input
              type="number"
              inputMode="decimal"
              {...register(d as keyof Inputs)}
              className="border px-2 py-1 w-20"
            />{" "}
            -
            <input
              type="number"
              inputMode="decimal"
              {...register(y as keyof Inputs)}
              className="border px-2 py-1 w-20"
            />
            <span>{m} Soru</span>
          </div>
        ))}
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

      {results && error === "" && (
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mt-6 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Hesaplama Sonuçları
            </h2>
            <button
              onClick={downloadPDF}
              className="text-xl font-semibold text-gray-800 border-b pb-2"
            >
              PDF Olarak İndir
            </button>
          </div>
          <div className="flex flex-col gap-2 text-lg text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Ham TYT Puanı:</span>
              <span className="font-bold text-blue-700 text-xl">
                {results.ham.toFixed(5)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">
                Yerleştirme TYT Puanı:
              </span>
              <span className="font-bold text-green-700 text-xl">
                {results.yerlestirme.toFixed(5)}
              </span>
            </div>
          </div>
          <table className="mt-4 w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Ders</th>
                <th className="border p-2">Net</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.netler).map(([key, value]) => (
                <tr key={key}>
                  <td className="border p-2 capitalize">{key}</td>
                  <td className="border p-2">{value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uyarı</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => setIsAlertOpen(false)}
            >
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
