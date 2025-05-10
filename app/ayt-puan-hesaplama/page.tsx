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
  turk_dili_dogru: string;
  turk_dili_yanlis: string;
  tarih_bir_dogru: string;
  tarih_bir_yanlis: string;
  cografya_bir_dogru: string;
  cografya_bir_yanlis: string;
  tarih_iki_dogru: string;
  tarih_iki_yanlis: string;
  cografya_iki_dogru: string;
  cografya_iki_yanlis: string;
  felsefe_dogru: string;
  felsefe_yanlis: string;
  din_kulturu_dogru: string;
  din_kulturu_yanlis: string;
  matematik_ayt_dogru: string;
  matematik_ayt_yanlis: string;
  fizik_dogru: string;
  fizik_yanlis: string;
  kimya_dogru: string;
  kimya_yanlis: string;
  biyoloji_dogru: string;
  biyoloji_yanlis: string;
  yabanci_dil_dogru: string;
  yabanci_dil_yanlis: string;
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
      turk_dili_dogru: "0",
      turk_dili_yanlis: "0",
      tarih_bir_dogru: "0",
      tarih_bir_yanlis: "0",
      cografya_bir_dogru: "0",
      cografya_bir_yanlis: "0",
      tarih_iki_dogru: "0",
      tarih_iki_yanlis: "0",
      cografya_iki_dogru: "0",
      cografya_iki_yanlis: "0",
      felsefe_dogru: "0",
      felsefe_yanlis: "0",
      din_kulturu_dogru: "0",
      din_kulturu_yanlis: "0",
      matematik_ayt_dogru: "0",
      matematik_ayt_yanlis: "0",
      fizik_dogru: "0",
      fizik_yanlis: "0",
      kimya_dogru: "0",
      kimya_yanlis: "0",
      biyoloji_dogru: "0",
      biyoloji_yanlis: "0",
      yabanci_dil_dogru: "0",
      yabanci_dil_yanlis: "0",
      diploma_notu: "60",
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
    dil: number;
    sozel: number;
    sayisal: number;
    ea: number;
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
      144.98 +
      2.908 * turkce +
      2.937 * sosyal +
      2.925 * matematik +
      3.148 * fen;
    return parseFloat(ham.toFixed(5));
  };

  const getSozelScore = (
    tytPuan: number,
    edebiyatNet: number,
    tarih1Net: number,
    cografya1Net: number,
    tarih2Net: number,
    cografya2Net: number,
    felsefeNet: number,
    dinNet: number
  ): number => {
    const puan =
      0.4236 * tytPuan +
      3.0633 * edebiyatNet +
      2.5715 * tarih1Net +
      2.7439 * cografya1Net +
      3.16 * tarih2Net +
      2.8204 * cografya2Net +
      3.8504 * felsefeNet +
      3.131 * dinNet +
      68.9585;

    return parseFloat(puan.toFixed(5));
  };

  const getSayisalScore = (
    tytPuan: number,
    aytMatNet: number,
    fizikNet: number,
    kimyaNet: number,
    biyolojiNet: number
  ): number => {
    return parseFloat(
      (
        0.38051 * tytPuan +
        3.18937 * aytMatNet +
        2.4264 * fizikNet +
        3.07407 * kimyaNet +
        2.50925 * biyolojiNet +
        78.13008
      ).toFixed(5)
    );
  };

  const getDilScore = (tytPuan: number, dilNet: number): number => {
    console.log("dilNet", dilNet);
    return parseFloat(
      (0.38051 * tytPuan + 2.60942 * dilNet + 78.96082).toFixed(5)
    );
  };

  const getEAScore = (
    tytPuan: number,
    aytMatNet: number,
    edebiyatNet: number
  ): number => {
    return parseFloat(
      (
        0.39159 * tytPuan +
        3.28219 * aytMatNet +
        2.83178 * edebiyatNet +
        75.52294
      ).toFixed(5)
    );
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
      {
        key: "turk_dili",
        name: "Türk Dili ve Edebiyatı",
        d: data.turk_dili_dogru,
        y: data.turk_dili_yanlis,
        max: 20,
      },
      {
        key: "tarih_bir",
        name: "Tarih-1",
        d: data.tarih_bir_dogru,
        y: data.tarih_bir_yanlis,
        max: 20,
      },
      {
        key: "cografya_bir",
        name: "Coğrafya-1",
        d: data.cografya_bir_dogru,
        y: data.cografya_bir_yanlis,
        max: 20,
      },
      {
        key: "tarih_iki",
        name: "Tarih-2",
        d: data.tarih_iki_dogru,
        y: data.tarih_iki_yanlis,
        max: 20,
      },
      {
        key: "cografya_iki",
        name: "Coğrafya-2",
        d: data.cografya_iki_dogru,
        y: data.cografya_iki_yanlis,
        max: 20,
      },
      {
        key: "felsefe",
        name: "Felsefe",
        d: data.felsefe_dogru,
        y: data.felsefe_yanlis,
        max: 20,
      },
      {
        key: "din_kulturu",
        name: "Din Külterü ve Ahlak Bilgisi",
        d: data.din_kulturu_dogru,
        y: data.din_kulturu_yanlis,
        max: 20,
      },
      {
        key: "matematik",
        name: "Matematik AYT",
        d: data.matematik_ayt_dogru,
        y: data.matematik_ayt_yanlis,
        max: 40,
      },
      {
        key: "fizik",
        name: "Fizik",
        d: data.fizik_dogru,
        y: data.fizik_yanlis,
        max: 20,
      },
      {
        key: "kimya",
        name: "Kimya",
        d: data.kimya_dogru,
        y: data.kimya_yanlis,
        max: 20,
      },
      {
        key: "biyoloji",
        name: "biyoloji",
        d: data.biyoloji_dogru,
        y: data.biyoloji_yanlis,
        max: 20,
      },
      {
        key: "yabanci_dil",
        name: "Yabancı Dil",
        d: data.yabanci_dil_dogru,
        y: data.yabanci_dil_yanlis,
        max: 80,
      },
    ];
    if (Object.values(data).every((val) => toNumber(val) === 0)) {
      setError("Lütfen veri giriniz.");
      setIsAlertOpen(true);
      return;
    }

    for (const { d, y, max, name } of dersler) {
      if (!validateMax(toNumber(d), toNumber(y), max + 1)) {
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

    const ham = getCalibratedTytScore(netler);

    const edebiyatNet = calculateNet(
      toNumber(data.turk_dili_dogru),
      toNumber(data.turk_dili_yanlis)
    );

    const tarih1Net = calculateNet(
      toNumber(data.tarih_bir_dogru),
      toNumber(data.tarih_bir_yanlis)
    );

    const cografyaNet = calculateNet(
      toNumber(data.cografya_bir_dogru),
      toNumber(data.cografya_bir_yanlis)
    );

    const tarih2Net = calculateNet(
      toNumber(data.tarih_iki_dogru),
      toNumber(data.tarih_iki_yanlis)
    );

    const cografya2Net = calculateNet(
      toNumber(data.cografya_iki_dogru),
      toNumber(data.cografya_iki_yanlis)
    );

    const felsefeNet = calculateNet(
      toNumber(data.felsefe_dogru),
      toNumber(data.felsefe_yanlis)
    );

    const dinNet = calculateNet(
      toNumber(data.din_kulturu_dogru),
      toNumber(data.din_kulturu_yanlis)
    );

    const matNet = calculateNet(
      toNumber(data.matematik_ayt_dogru),
      toNumber(data.matematik_ayt_yanlis)
    );

    const fizikNet = calculateNet(
      toNumber(data.fizik_dogru),
      toNumber(data.fizik_yanlis)
    );

    const kimyaNet = calculateNet(
      toNumber(data.kimya_dogru),
      toNumber(data.kimya_yanlis)
    );

    const biyolojiNet = calculateNet(
      toNumber(data.biyoloji_dogru),
      toNumber(data.biyoloji_yanlis)
    );

    const yabanciNet = calculateNet(
      toNumber(data.yabanci_dil_dogru),
      toNumber(data.yabanci_dil_yanlis)
    );

    const sozel = getSozelScore(
      ham,
      edebiyatNet,
      tarih1Net,
      cografyaNet,
      tarih2Net,
      cografya2Net,
      felsefeNet,
      dinNet
    );

    const sayisal = getSayisalScore(
      ham,
      matNet,
      fizikNet,
      kimyaNet,
      biyolojiNet
    );

    const dil = getDilScore(ham, yabanciNet);

    const ea = getEAScore(ham, matNet, edebiyatNet);

    const obp = clamp(toNumber(data.diploma_notu), 100);
    const yerlestirme = ham + obp * 5 * 0.12;

    setResults({
      ham,
      yerlestirme: parseFloat(yerlestirme.toFixed(5)),
      netler,
      dil,
      sozel,
      sayisal,
      ea,
    });
    setIsAlertOpen(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        TYT Puan Hesaplayıcı (2024 Kalibrasyonlu)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          "Türkçe",
          "Sosyal Bilimler",
          "Temel Matematik",
          "Fen Bilimleri",
          "Türk Dili ve Edebiyatı",
          "Tarih-1",
          "Coğrafya-1",
          "Tarih-2",
          "Coğrafya-2",
          "Felsefe",
          "Din Kültürü / Felsefe",
          "Matematik",
          "Fizik",
          "Kimya",
          "Biyoloji",
          "Yabancı Dil",
        ].map((label, idx) => {
          const key = [
            { ders: "turkce", max: 40 },
            { ders: "sosyal", max: 20 },
            { ders: "matematik", max: 40 },
            { ders: "fen", max: 20 },
            { ders: "turk_dili", max: 24 },
            { ders: "tarih_bir", max: 10 },
            { ders: "cografya_bir", max: 6 },
            { ders: "tarih_iki", max: 11 },
            { ders: "cografya_iki", max: 11 },
            { ders: "felsefe", max: 12 },
            { ders: "din_kulturu", max: 6 },
            { ders: "matematik_ayt", max: 40 },
            { ders: "fizik", max: 14 },
            { ders: "kimya", max: 13 },
            { ders: "biyoloji", max: 13 },
            { ders: "yabanci_dil", max: 80 },
          ][idx];
          const d = `${key.ders}_dogru`;
          const y = `${key.ders}_yanlis`;
          const m = key.max;
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
        })}
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
                  Sözel : {results.sozel} <br />
                  Sayısal : {results.sayisal} <br />
                  EA : {results.ea}
                  <br />
                  Dil : {results.dil}
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
