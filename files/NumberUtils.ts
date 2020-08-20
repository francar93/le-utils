export class NumberUtils {

  static round(value: number, decimalDigits: number = 0): number {
    let digitController = Math.pow(10, decimalDigits);
    return Math.round(value * digitController) / digitController;
  }

  static addIva(netValue: number, iva: number): number {
    return Math.round(netValue * (1 + iva));
  }

  static removeIva(valueWithIva: number, iva: number): number {
    return Math.round(valueWithIva / (1 + iva));
  }


}
