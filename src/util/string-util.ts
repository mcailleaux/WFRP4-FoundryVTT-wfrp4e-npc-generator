// @ts-ignore
import deburr from './lodash/deburr.js';

export default class StringUtil {
  public static includesDeburrIgnoreCase(
    input: string,
    include: string
  ): boolean {
    if (input == null || input.length === 0 || include == null) {
      return false;
    }
    return deburr(input).toLowerCase().includes(deburr(include).toLowerCase());
  }

  public static equalsDeburrIgnoreCase(
    input: string,
    include: string
  ): boolean {
    if (input == null || input.length === 0 || include == null) {
      return false;
    }
    return deburr(input).toLowerCase() === deburr(include).toLowerCase();
  }

  public static arrayIncludesDeburrIgnoreCase(
    array: string[],
    include: string
  ): boolean {
    if (array == null || array.length === 0 || include == null) {
      return false;
    }
    return array
      .map((s) => deburr(s).toLowerCase())
      .includes(deburr(include).toLowerCase());
  }

  public static localCompareDeburrIgnoreCase(
    c1: string,
    c2: string,
    asc = true
  ) {
    const fc1 = deburr(c1 ?? '')
      .toLowerCase()
      .trim();
    const fc2 = deburr(c2 ?? '')
      .toLowerCase()
      .trim();
    return asc ? fc1.localeCompare(fc2) : fc2.localeCompare(fc1);
  }

  public static toDeburrLowerCase(value: string): string {
    return deburr(value).toLowerCase();
  }
}
