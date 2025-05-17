import { CubicSpline } from "@/lib/spline";
import {
  dilPuanlar,
  dilSiralamalar,
  eaPuanlar,
  eaSiralamalar,
  puanlar,
  sayPuanlar,
  saySiralamalar,
  siralamalar,
  sozPuanlar,
  sozSiralamalar,
  yDilPuanlar,
  yDilSiralamalar,
  yEaPuanlar,
  yEaSiralamalar,
  ySayPuanlar,
  ySaySiralamalar,
  ySozPuanlar,
  ySozSiralamalar,
  ytytPuanlar,
  ytytSiralamalar,
} from "@/lib/spline-mock";

export const spline = new CubicSpline(puanlar, siralamalar);
export const ytytSpline = new CubicSpline(ytytPuanlar, ytytSiralamalar);
export const dilSpline = new CubicSpline(dilPuanlar, dilSiralamalar);
export const yDilSpline = new CubicSpline(yDilPuanlar, yDilSiralamalar);
export const splineSayHam = new CubicSpline(sayPuanlar, saySiralamalar);
export const splineSayYerlestirme = new CubicSpline(
  ySayPuanlar,
  ySaySiralamalar
);
const splineEa = new CubicSpline(eaPuanlar, eaSiralamalar);
const splineYEa = new CubicSpline(yEaPuanlar, yEaSiralamalar);
const sozSpline = new CubicSpline(sozPuanlar, sozSiralamalar);
const ySozSpline = new CubicSpline(ySozPuanlar, ySozSiralamalar);

export function getHamSiralama(puan: number): number {
  if (puan < puanlar[0]) return 2755277;
  if (puan > 500) return 1;
  return Math.round(spline.at(puan));
}
export function getYtytSiralama(puan: number): number {
  if (puan >= 560) return 1;
  if (puan <= ytytPuanlar[0]) return 2_755_277;

  const result = ytytSpline.at(puan);
  return Number.isFinite(result) ? Math.round(result) : 2_755_277;
}
export const toNumber = (val: any) =>
  parseFloat(String(val).replace(",", ".") || "0");
export const clamp = (value: number, max: number) =>
  Math.min(Math.max(value, 0), max);
export const calculateNet = (dogru: number, yanlis: number) =>
  Math.max(0, dogru - yanlis / 4);

export const getCalibratedTytScore = ({
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
    144.98 + 2.908 * turkce + 2.937 * sosyal + 2.925 * matematik + 3.148 * fen;
  return parseFloat(ham.toFixed(5));
};

// Yabancı Dil Hesapları
export const getDilScore = (tytHam: number, dilNet: number) => {
  const puan = tytHam * 0.51415 + dilNet * 2.60942 + 36.05689;
  return parseFloat(Math.min(puan, 500).toFixed(5));
};
export const getDilYerlestirmeScore = (
  tytHam: number,
  dilNet: number,
  obp: number
): number => {
  const hamPuan = Math.min(tytHam * 0.51415 + dilNet * 2.60942 + 36.05689, 500);

  const yerlestirmePuan = hamPuan + Math.min(obp, 100) * 0.6;

  return parseFloat(Math.min(yerlestirmePuan, 560).toFixed(5));
};
export const getDilSiralama = (puan: number): number => {
  if (puan <= dilPuanlar[0]) return 153648;
  if (puan >= dilPuanlar[dilPuanlar.length - 1]) return 1;

  const tahmin = dilSpline.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 153648;
};
export const getYDilSiralama = (puan: number): number => {
  if (puan <= yDilPuanlar[0]) return 153648;
  if (puan >= 560) return 1;

  const tahmin = yDilSpline.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 153648;
};

// Sözel Hesapları

export const getSozelScore = (
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

  return parseFloat(Math.min(puan, 500).toFixed(5));
};

export const getSozelYerlestirmeScore = (
  tytPuan: number,
  edebiyatNet: number,
  tarih1Net: number,
  cografya1Net: number,
  tarih2Net: number,
  cografya2Net: number,
  felsefeNet: number,
  dinNet: number,
  obp: number
): number => {
  // Ham SÖZ puanı (obp hariç)
  const hamPuan = Math.min(
    0.4236 * tytPuan +
      3.0633 * edebiyatNet +
      2.5715 * tarih1Net +
      2.7439 * cografya1Net +
      3.16 * tarih2Net +
      2.8204 * cografya2Net +
      3.8504 * felsefeNet +
      3.131 * dinNet +
      68.9585,
    500
  );

  // Yerleştirme puanı
  const yerlestirmePuan = hamPuan + Math.min(obp, 100) * 0.6;

  return parseFloat(Math.min(yerlestirmePuan, 560).toFixed(5));
};

export function getSozelSiralama(puan: number): number {
  const minPuan = sozPuanlar[0];
  const maxPuan = 500;
  const maxSiralama = 1_423_849;

  if (puan <= minPuan) return maxSiralama;
  if (puan >= maxPuan) return 1;

  const result = sozSpline.at(puan);
  return Number.isFinite(result) ? Math.round(result) : maxSiralama;
}
export function getYSozelSiralama(puan: number): number {
  const minPuan = ySozPuanlar[0];
  const maxPuan = 560;
  const maxSiralama = 1_423_849;

  if (puan <= minPuan) return maxSiralama;
  if (puan >= maxPuan) return 1;

  const result = ySozSpline.at(puan);
  return Number.isFinite(result) ? Math.round(result) : maxSiralama;
}
// Sayısal Hesapları

export const getSayisalScore = (
  tytPuan: number,
  aytMatNet: number,
  fizikNet: number,
  kimyaNet: number,
  biyolojiNet: number
): number => {
  const hamPuan =
    0.38051 * tytPuan +
    3.18937 * aytMatNet +
    2.4264 * fizikNet +
    3.07407 * kimyaNet +
    2.50925 * biyolojiNet +
    78.13008;

  return parseFloat(Math.min(hamPuan, 500).toFixed(5));
};
export const getSayisalYerlestirmeScore = (
  tytPuan: number,
  aytMatNet: number,
  fizikNet: number,
  kimyaNet: number,
  biyolojiNet: number,
  obp: number
): number => {
  const hamPuan = Math.min(
    0.38051 * tytPuan +
      3.18937 * aytMatNet +
      2.4264 * fizikNet +
      3.07407 * kimyaNet +
      2.50925 * biyolojiNet +
      78.13008,
    500
  );

  const yerlestirmePuan = hamPuan + Math.min(obp, 100) * 0.6;

  return parseFloat(Math.min(yerlestirmePuan, 560).toFixed(5));
};
export const getSaySiralama = (puan: number): number => {
  if (puan <= sayPuanlar[0]) return 1_307_007;
  if (puan >= sayPuanlar[sayPuanlar.length - 1]) return 1;

  const tahmin = splineSayHam.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 1_307_007;
};
export const getYSaySiralama = (puan: number): number => {
  if (puan <= ySayPuanlar[0]) return 1_307_007;
  if (puan >= 560) return 1;

  const tahmin = splineSayYerlestirme.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 1_307_007;
};

// EA Hesapları

export const getEAScore = (
  tytPuan: number,
  aytMatNet: number,
  edebiyatNet: number,
  tarih1Net: number,
  cografya1Net: number
): number => {
  const score =
    0.39159 * tytPuan +
    3.28219 * aytMatNet +
    2.83178 * edebiyatNet +
    2.37709 * tarih1Net +
    2.53652 * cografya1Net +
    75.52396;

  return Math.min(500, parseFloat(score.toFixed(5)));
};
export const getEAYerlestirmeScore = (
  tytPuan: number,
  aytMatNet: number,
  edebiyatNet: number,
  tarih1Net: number,
  cografya1Net: number,
  obp: number
): number => {
  const hamPuan = Math.min(
    0.39159 * tytPuan +
      3.28219 * aytMatNet +
      2.83178 * edebiyatNet +
      2.37709 * tarih1Net +
      2.53652 * cografya1Net +
      75.52396,
    500
  );

  const yerlestirmePuan = hamPuan + Math.min(obp, 100) * 0.6;

  return parseFloat(Math.min(yerlestirmePuan, 560).toFixed(5));
};

export const getEaSiralama = (puan: number): number => {
  if (puan <= eaPuanlar[0]) return 1_703_833;
  if (puan >= eaPuanlar[eaPuanlar.length - 1]) return 1;

  const tahmin = splineEa.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 1_703_833;
};
export const getYEaSiralama = (puan: number): number => {
  if (puan <= yEaPuanlar[0]) return 1_703_833;
  if (puan >= 560) return 1;

  const tahmin = splineYEa.at(puan);
  return Number.isFinite(tahmin) ? Math.round(tahmin) : 1_703_833;
};
