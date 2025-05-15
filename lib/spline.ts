export class CubicSpline {
  private xs: number[];
  private ys: number[];
  private ks: number[];

  constructor(xs: number[], ys: number[]) {
    if (xs.length !== ys.length) {
      throw new Error("X ve Y dizileri eşit uzunlukta olmalıdır.");
    }

    const n = xs.length;
    const a = new Array(n).fill(0);
    const b = new Array(n).fill(0);
    const d = new Array(n).fill(0);
    const h = new Array(n - 1);
    const alpha = new Array(n - 1);
    const l = new Array(n);
    const mu = new Array(n);
    const z = new Array(n);

    for (let i = 0; i < n - 1; i++) {
      h[i] = xs[i + 1] - xs[i];
      alpha[i] =
        (3 * (ys[i + 1] - ys[i])) / h[i] -
        (3 * (ys[i] - ys[i - 1] || 0)) / (h[i - 1] || h[i]);
    }

    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;

    for (let i = 1; i < n - 1; i++) {
      l[i] = 2 * (xs[i + 1] - xs[i - 1]) - h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    l[n - 1] = 1;
    z[n - 1] = 0;
    this.ks = new Array(n).fill(0);

    for (let j = n - 2; j >= 0; j--) {
      this.ks[j] = z[j] - mu[j] * this.ks[j + 1];
      b[j] =
        (ys[j + 1] - ys[j]) / h[j] -
        (h[j] * (this.ks[j + 1] + 2 * this.ks[j])) / 3;
      d[j] = (this.ks[j + 1] - this.ks[j]) / (3 * h[j]);
      a[j] = ys[j];
    }

    this.xs = xs;
    this.ys = ys;
    this.ks = this.ks;
  }

  at(x: number): number {
    const i = this.findInterval(x);
    const h = this.xs[i + 1] - this.xs[i];
    const a = this.ys[i];
    const b =
      (this.ys[i + 1] - this.ys[i]) / h -
      (h * (this.ks[i + 1] + 2 * this.ks[i])) / 3;
    const c = this.ks[i];
    const d = (this.ks[i + 1] - this.ks[i]) / (3 * h);
    const dx = x - this.xs[i];
    return a + b * dx + c * dx * dx + d * dx * dx * dx;
  }

  private findInterval(x: number): number {
    let low = 0;
    let high = this.xs.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.xs[mid] <= x && x < this.xs[mid + 1]) return mid;
      else if (x < this.xs[mid]) high = mid - 1;
      else low = mid + 1;
    }
    return this.xs.length - 2;
  }
}
