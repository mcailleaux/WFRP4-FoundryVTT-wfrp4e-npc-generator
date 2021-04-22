export default class RandomUtil {
  public static getRandomValue<T>(array: T[]): T {
    if (array == null || array.length === 0) {
      return null as any;
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  public static getRandomValues<T>(array: T[], nbr: number): T[] {
    if (array == null || nbr < 1 || array.length < nbr) {
      return null as any;
    }
    const indexes: number[] = [];
    while (indexes.length < nbr) {
      const idx = Math.floor(Math.random() * array.length);
      if (!indexes.includes(idx)) {
        indexes.push(idx);
      }
    }
    return indexes.map((idx) => array[idx]);
  }

  public static getRandomValueScript(): string {
    return `
         function getRandomValue(array) {
             if (array == null || array.length === 0) {
                return null;
             }
             return array[Math.floor(Math.random() * array.length)];
         }
    `;
  }

  public static getRandomValuesScript(): string {
    return `
         function getRandomValues(array, nbr) {
              if (array == null || nbr < 1 || array.length < nbr) {
                return null;
              }
              const indexes = [];
              while (indexes.length < nbr) {
                const idx = Math.floor(Math.random() * array.length);
                if (!indexes.includes(idx)) {
                  indexes.push(idx);
                }
              }
              return indexes.map((idx) => array[idx]);
         }
    `;
  }
}
