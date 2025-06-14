"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
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
  getSozelSiralama,
  getSozelYerlestirmeScore,
  getYDilSiralama,
  getYEaSiralama,
  getYSaySiralama,
  getYSozelSiralama,
  getYtytSiralama,
  toNumber,
} from "../../action";
import ContentTitle from "@/components/content-title";
import FooterLinks from "@/components/footer-links";

export default function TytHesaplayici() {
  const { register, handleSubmit, watch } = useForm();
  const watchAllFields = watch();
  const obpWatch = watch("diploma_notu");
  const [noData, setNoData] = useState<string>();
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
    sozelYerlestirme: number;
    sozelSiralama: number;
    sozelYerlestirmeSiralama: number;
    sayisal: number;
    sayisalYerlestirme: number;
    getSaySiralamaValue: number;
    getYSaySiralamaValue: number;
    ea: number;
    eaYerlestirme: number;
    getEASiralamaValue: number;
    getYEASiralamaValue: number;
  } | null>(null);

  const onSubmit: SubmitHandler<any> = (data) => {
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

    const toplamNet = Object.values(netler).reduce((a, b) => a + b, 0);
    if (toplamNet === 0) {
      setNoData("Değer");
      return;
    } else {
      setNoData("");
    }

    const ham = getCalibratedTytScore(netler);
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

    //Sözel Hesapları
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
    const sozelYerlestirme = getSozelYerlestirmeScore(
      ham,
      edebiyatNet,
      tarih1Net,
      cografyaNet,
      tarih2Net,
      cografya2Net,
      felsefeNet,
      dinNet,
      obp
    );
    const sozelSiralama = getSozelSiralama(sozel);
    const sozelYerlestirmeSiralama = getYSozelSiralama(sozelYerlestirme);
    setResults({
      ham,
      yerlestirme: parseFloat(yerlestirme.toFixed(5)),
      netler,
      dil,
      dilYerlestirme,
      sozel,
      sozelYerlestirme,
      sozelSiralama,
      sozelYerlestirmeSiralama,
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
  };

  return (
    <div>
      <div className="w-full lg:max-w-2xl mx-auto text-center py-10">
        <ContentTitle title="AYT Puan Hesaplayıcı" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200 p-6 rounded-xl shadow space-y-6 mt-12"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "turkce", label: "Türkçe", max: 40 },
              { key: "sosyal", label: "Sosyal Bilimler", max: 20 },
              { key: "matematik", label: "Temel Matematik", max: 40 },
              { key: "fen", label: "Fen Bilgisi", max: 40 },
              { key: "turk_dili", label: "Türk Dili ve Edebiyatı", max: 24 },
              { key: "tarih_bir", label: "Tarih-1", max: 10 },
              { key: "cografya_bir", label: "Coğrafya", max: 6 },
              { key: "tarih_iki", label: "Tarih-2", max: 11 },
              { key: "cografya_iki", label: "Coğrafya-2", max: 11 },
              { key: "felsefe", label: "Felsefe", max: 12 },
              { key: "din_kulturu", label: "Din Kültürü", max: 6 },
              { key: "matematik_ayt", label: "Matematik", max: 40 },
              { key: "fizik", label: "Fizik", max: 14 },
              { key: "kimya", label: "Kimya", max: 13 },
              { key: "biyoloji", label: "Biyoloji", max: 13 },
              { key: "yabanci_dil", label: "Yabancı Dil", max: 80 },
            ].map((ders, idx) => {
              const dogruKey = `${ders.key}_dogru`;
              const yanlisKey = `${ders.key}_yanlis`;
              const dogru = parseFloat(watchAllFields[dogruKey] || "0");
              const yanlis = parseFloat(watchAllFields[yanlisKey] || "0");
              const dogruMax = Math.max(0, ders.max - yanlis);
              const yanlisMax = Math.max(0, ders.max - dogru);
              const toplamHatalı = dogru + yanlis > ders.max;

              return (
                <>
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
                        <div className="bg-gray-50 rounded-r-sm text-sm h-full px-2 flex items-center justify-center w-8">
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
                  {ders.label === "Din Kültürü" && (
                    <>
                      <div></div>
                      <div className="w-full my-6 h-[1px] bg-black sm:col-span-2"></div>
                    </>
                  )}
                  {ders.label === "Fen Bilgisi" && (
                    <>
                      <div className="w-full my-6 h-[1px] bg-black sm:col-span-2"></div>
                    </>
                  )}{" "}
                  {ders.label === "Biyoloji" && (
                    <>
                      <div className="w-full my-6 h-[1px] bg-black sm:col-span-2"></div>
                    </>
                  )}{" "}
                  {ders.label === "Yabancı Dil" && (
                    <>
                      <div className="w-full my-6 h-[1px] bg-black sm:col-span-2"></div>
                    </>
                  )}
                </>
              );
            })}
          </div>
          <div className="flex flex-col items-start mt-6">
            <label className="block text-sm font-medium mb-1 capitalize">
              Diploma Notu
            </label>
            <input
              type="number"
              {...register("diploma_notu")}
              className="w-full border rounded-l-sm px-2 py-1 text-sm bg-white"
              defaultValue={50}
              max={100}
            />
            {obpWatch > 100 && (
              <p className="text-xs text-red-600 mt-1">
                Diploma Notu 100'den fazla olamaz.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#DF3639] text-white font-semibold rounded hover:bg-[#DF3639]/70 cursor-pointer"
          >
            Hesapla
          </button>
          {noData && (
            <p className="text-xs text-red-600 mt-1">
              Herhangi bir TYT değeri girilmedi.
            </p>
          )}
          {results && (
            <div className="mt-6 text-left space-y-1">
              <p className="text-lg font-semibold">
                2024 - TYT Yerleştirme Puanı:{" "}
                <span className="text-green-600">{results.yerlestirme}</span>
              </p>
              <p className="text-lg font-semibold">
                2024 - TYT Yerleştirme Sıralama:{" "}
                <span className="text-blue-600">
                  {results.siralamaYerlestirme.toLocaleString("tr-TR")}
                </span>
              </p>
              <div className="w-full my-6 h-[1px] bg-black"></div>
              <p className="text-lg font-semibold">
                2024 - SAY Yerleştirme Puanı:{" "}
                <span className="text-green-600">
                  {results.sayisalYerlestirme}
                </span>
              </p>
              <p className="text-lg font-semibold">
                2024 - SAY Yerleştirme Tahmini Sıralama:{" "}
                <span className="text-blue-600">
                  {results.getYSaySiralamaValue.toLocaleString("tr-TR")}
                </span>
              </p>
              <div className="w-full my-6 h-[1px] bg-black"></div>
              <p className="text-lg font-semibold">
                2024 - SÖZ Yerleştirme Puanı:{" "}
                <span className="text-green-600">
                  {results.sozelYerlestirme}
                </span>
              </p>
              <p className="text-lg font-semibold">
                2024 - SÖZ Yerleştirme Tahmini Sıralama:{" "}
                <span className="text-blue-600">
                  {results.sozelYerlestirmeSiralama.toLocaleString("tr-TR")}
                </span>
              </p>
              <div className="w-full my-6 h-[1px] bg-black"></div>
              <p className="text-lg font-semibold">
                2024 - EA Yerleştirme Puanı:{" "}
                <span className="text-green-600">{results.eaYerlestirme}</span>
              </p>
              <p className="text-lg font-semibold">
                2024 - EA Yerleştirme Tahmini Sıralama:{" "}
                <span className="text-blue-600">
                  {results.getYEASiralamaValue.toLocaleString("tr-TR")}
                </span>
              </p>{" "}
              <div className="w-full my-6 h-[1px] bg-black"></div>
              <p className="text-lg font-semibold">
                2024 - YDT Yerleştirme Puanı:{" "}
                <span className="text-green-600">{results.dilYerlestirme}</span>
              </p>
              <p className="text-lg font-semibold">
                2024 - YDT Yerleştirme Tahmini Sıralama:{" "}
                <span className="text-blue-600">
                  {results.siralamaYDil.toLocaleString("tr-TR")}
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
