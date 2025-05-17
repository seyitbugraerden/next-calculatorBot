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
import {
  calculateNet,
  clamp,
  getCalibratedTytScore,
  getDilScore,
  getDilSiralama,
  getDilYerlestirmeScore,
  getEAScore,
  getEaSiralama,
  getEAYerlestirmeScore,
  getHamSiralama,
  getSayisalScore,
  getSayisalYerlestirmeScore,
  getSaySiralama,
  getSozelScore,
  getYDilSiralama,
  getYEaSiralama,
  getYSaySiralama,
  getYtytSiralama,
  splineSayHam,
  splineSayYerlestirme,
  toNumber,
} from "../action";

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
    siralamaHam: number;
    siralamaYerlestirme: number;
    dilYerlestirme: number;
    siralamaDil: number;
    siralamaYDil: number;
    netler: {
      turkce: number;
      sosyal: number;
      matematik: number;
      fen: number;
    };
    dil: number;
    sozel: number;
    sayisal: number;
    sayisalYerlestirme: number;
    getSaySiralamaValue: number;
    getYSaySiralamaValue: number;
    ea: number;
    eaYerlestirme: number;
    getEASiralamaValue: number;
    getYEASiralamaValue: number;
  } | null>(null);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (Object.values(data).every((val) => toNumber(val) === 0)) {
      setError("Lütfen veri giriniz.");
      setIsAlertOpen(true);
      return;
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

    const obp = clamp(toNumber(data.diploma_notu), 100);
    const yerlestirme = ham + obp * 5 * 0.12;
    const siralamaHam = getHamSiralama(ham);
    const siralamaYerlestirme = getYtytSiralama(yerlestirme);

    // Yabancı Dil Hesapları
    const yabanciNet = calculateNet(
      toNumber(data.yabanci_dil_dogru),
      toNumber(data.yabanci_dil_yanlis)
    );
    const dil = getDilScore(ham, yabanciNet);
    const dilYerlestirme = getDilYerlestirmeScore(ham, yabanciNet, obp);
    const siralamaDil = getDilSiralama(dil);
    const siralamaYDil = getYDilSiralama(dilYerlestirme);

    // Sayısal Hesapları
    const sayisal = getSayisalScore(
      ham,
      matNet,
      fizikNet,
      kimyaNet,
      biyolojiNet
    );
    const sayisalYerlestirme = getSayisalYerlestirmeScore(
      ham,
      matNet,
      fizikNet,
      kimyaNet,
      biyolojiNet,
      obp
    );
    const getSaySiralamaValue = getSaySiralama(sayisal);
    const getYSaySiralamaValue = getYSaySiralama(sayisalYerlestirme);

    //EA Hesapları
    const ea = getEAScore(ham, matNet, edebiyatNet, tarih1Net, cografyaNet);
    const eaYerlestirme = getEAYerlestirmeScore(
      ham,
      matNet,
      edebiyatNet,
      tarih1Net,
      cografyaNet,
      obp
    );
    const getEASiralamaValue = getEaSiralama(ea);
    const getYEASiralamaValue = getYEaSiralama(eaYerlestirme);

    setResults({
      ham,
      yerlestirme: parseFloat(yerlestirme.toFixed(5)),
      netler,
      dil,
      dilYerlestirme,
      sozel,
      sayisal,
      sayisalYerlestirme,
      getSaySiralamaValue,
      getYSaySiralamaValue,
      ea,
      eaYerlestirme,
      getEASiralamaValue,
      getYEASiralamaValue,
      siralamaHam,
      siralamaYerlestirme,
      siralamaDil,
      siralamaYDil,
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
                  SÖZ : {results.sozel} <br />
                  <br />
                  SAY : {results.sayisal} || {results.getSaySiralamaValue}
                  <br />
                  YSAY : {results.sayisalYerlestirme} ||{" "}
                  {results.getYSaySiralamaValue}
                  <br /> <br />
                  EA : {results.ea} || {results.getEASiralamaValue}
                  <br />
                  YEA : {results.eaYerlestirme} || {results.getYEASiralamaValue}
                  <br /> <br />
                  Dil : {results.dil} || {results.siralamaDil} <br />
                  YDil : {results.dilYerlestirme} || {results.siralamaYDil}{" "}
                  <br /> <br />
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
