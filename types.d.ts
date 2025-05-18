// types/cubic-spline.d.ts
declare module "cubic-spline" {
  export default class Spline {
    constructor(x: number[], y: number[]);
    at(x: number): number;
  }
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

type ContentProps = {
  title: string;
};
