export default class RandomUtil {
  public static getRandomBoolean(): boolean {
    return this.getRandomPositiveNumber(2) === 0;
  }

  public static getRandomPositiveNumber(max: number): number {
    return Math.floor(this.random() * max);
  }

  public static getRandomValue<T>(array: T[], exclude?: T[]): T {
    if (array == null || array.length === 0) {
      return null as any;
    }
    if (exclude != null && exclude.length > 0) {
      return this.getRandomValue(array.filter((elm) => !exclude.includes(elm)));
    }
    return array[Math.floor(this.random() * array.length)];
  }

  public static getRandomValues<T>(array: T[], nbr: number): T[] {
    if (array == null || nbr < 1 || array.length < nbr) {
      return null as any;
    }
    const indexes: number[] = [];
    while (indexes.length < nbr) {
      const idx = Math.floor(this.random() * array.length);
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
             let random = 0;
             for (let i = 0; i < 10; i++) {
                 random = Math.random();
             }
             return array[Math.floor(random * array.length)];
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
                let random = 0;
                for (let i = 0; i < 10; i++) {
                   random = Math.random();
                }
                const idx = Math.floor(random * array.length);
                if (!indexes.includes(idx)) {
                  indexes.push(idx);
                }
              }
              return indexes.map((idx) => array[idx]);
         }
    `;
  }

  private static random(): number {
    let random = 0;
    for (let i = 0; i < 10; i++) {
      random = Math.random();
    }
    return random;
  }
}
