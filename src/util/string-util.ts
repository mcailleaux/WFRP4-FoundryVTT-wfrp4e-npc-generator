export default class StringUtil {
  private static readonly local = 'en';

  public static isEqualsLocalEnIgnoreCase(s1: string, s2: string): boolean {
    if (s1 == null && s2 == null) {
      return true;
    } else if (s1 == null || s2 == null) {
      return false;
    }
    return (
      s1.toLocaleLowerCase(this.local) === s2.toLocaleLowerCase(this.local)
    );
  }

  public static includesLocalEnIgnoreCase(
    input: string,
    include: string
  ): boolean {
    if (input == null || input.length === 0 || include == null) {
      return false;
    }
    return input.toLocaleLowerCase(this.local).includes(include);
  }

  public static arrayIncludesLocalEnIgnoreCase(
    array: string[],
    include: string
  ): boolean {
    if (array == null || array.length === 0 || include == null) {
      return false;
    }
    return array.map((s) => s.toLocaleLowerCase(this.local)).includes(include);
  }
}
