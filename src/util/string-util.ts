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
}
