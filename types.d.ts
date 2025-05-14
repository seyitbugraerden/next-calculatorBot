// types/cubic-spline.d.ts
declare module "cubic-spline" {
  export default class Spline {
    constructor(x: number[], y: number[]);
    at(x: number): number;
  }
}
