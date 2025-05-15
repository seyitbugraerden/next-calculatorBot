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
import { CubicSpline } from "@/lib/spline";

const puanlar = [
  147.87084, 151.01899, 153.71602, 153.95574, 156.64729, 156.86417, 159.78965,
  165.64062, 178.23324, 187.22657, 191.89567, 198.22608, 216.67912, 226.78942,
  235.34718, 247.74693, 265.84334, 287.97114, 295.1732, 299.50259, 307.84527,
  308.34176, 311.25019, 314.15862, 317.06706, 318.99956, 322.94055, 332.38501,
  334.39149, 335.6464, 338.44708, 339.68904, 341.40026, 345.76268, 346.7666,
  357.88164, 360.36725, 360.58993, 374.45998, 386.68502, 397.39049, 400.27062,
  403.1961, 403.20736, 408.62972, 413.62545, 414.82984, 426.85809, 441.40026,
  441.68945, 444.47855, 450.21049, 450.38066, 459.10596, 464.89421, 469.47733,
  475.2942, 484.73866, 485.37259, 490.55553, 493.70369, 500.0,
];
const siralamalar = [
  2662849, 2633563, 2608473, 2606243, 2579188, 2551973, 2451955, 2233034,
  1978084, 1521755, 1198026, 752250, 518355, 457920, 371682, 368787, 351832,
  334878, 317923, 306657, 288436, 248645, 234905, 223105, 217873, 22491, 199159,
  196127, 162559, 155315, 154801, 122821, 98120, 79020, 73976, 69781, 69765,
  61989, 54826, 53099, 38099, 22491, 22269, 20131, 15737, 15607, 8919, 6460,
  4799, 2691, 752, 721, 466, 311, 1,
];
const ytytPuanlar = [
  2662849, 2633563, 2608473, 2606243, 2581205, 2579188, 2551973,
  2451955, 2233034, 2066098, 1978084, 1938563, 1521755, 1344838,
  1198026, 1003155, 752250, 518355, 457920, 421590, 371682, 368787,
  351832, 334878, 317923, 306657, 288436, 248645, 240192, 234905,
  223105, 217873, 22491, 199159, 196127, 162559, 155315, 154801,
  122821, 98120, 79020, 73976, 69781, 69765, 61989, 54826, 53099,
  38099, 22491, 22269, 20131, 15737, 15607, 8919, 6460, 4799,
  2691, 752, 721, 466, 311, 1
];
const ytytSiralamalar = [
  2715336, 2662813, 2633563, 2446139, 2439708, 2363233, 2297020, 2257009,
  2198106, 2190261, 2150785, 2144683, 2084055, 1985781, 1924311, 1835049,
  1828231, 1649774, 1530800, 1432715, 1405502, 1334630, 1244525, 1207207,
  1155971, 1075656, 1067587, 985147, 910424, 880264, 835702, 805254, 761135,
  702307, 639001, 575695, 525035, 501681, 454973, 392309, 358240, 321883,
  293656, 258148, 232771, 186626, 148058, 121231, 99711, 70883, 43556, 33402,
  22501, 8424, 5505, 3017, 2130, 1774, 1686, 1242, 177, 56, 47, 40, 1,
];

const spline = new CubicSpline(puanlar, siralamalar);
const ytytSpline = new CubicSpline(ytytPuanlar, ytytSiralamalar);

function getHamSiralama(puan: number): number {
  if (puan < puanlar[0]) return 2755277;
  if (puan > 500) return 1;
  return Math.round(spline.at(puan));
}

function getYtytSiralama(puan: number): number {
  if (puan >= 560) return 1;
  if (puan < ytytPuanlar[0]) return 2_755_277;
  return Math.round(ytytSpline.at(puan));
}

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
