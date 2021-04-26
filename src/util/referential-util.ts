import StringUtil from './string-util.js';

export default class ReferentialUtil {
  public static getSpeciesMap(): { [key: string]: string } {
    return game.wfrp4e.config.species;
  }

  public static getSpeciesSkillsMap(): { [key: string]: string[] } {
    return game.wfrp4e.config.speciesSkills;
  }

  public static getSpeciesTalentsMap(): { [key: string]: any[] } {
    return game.wfrp4e.config.speciesTalents;
  }

  public static getRandomTalents(): string[] {
    return game.wfrp4e.tables.talents.rows.map((row: any) => row.name);
  }

  public static async getCareerIndexes(): Promise<Item[]> {
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getIndex();
    const worldCareers = game.items?.entities?.filter(
      (item) => item.type === 'career'
    );
    if (worldCareers != null && worldCareers.length > 0) {
      careers.push(...worldCareers);
    }
    return Promise.resolve(careers);
  }

  public static async getCareerEntities(): Promise<Item[]> {
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getContent();
    const worldCareers = game.items?.entities?.filter(
      (item) => item.type === 'career'
    );
    if (worldCareers != null && worldCareers.length > 0) {
      careers.push(...worldCareers);
    }
    return Promise.resolve(careers);
  }

  public static async getRandomSpeciesCareers(
    speciesKey: string
  ): Promise<string[]> {
    if (speciesKey == null) {
      return [];
    }
    const randomCareers: string[] = game.wfrp4e.tables.career.rows
      .filter((row: any) => row?.range[speciesKey]?.length > 0)
      .map((row: any) => row.name);

    const careers = await this.getCareerEntities();

    const result: string[] = [];

    randomCareers.forEach((rc) => {
      const cs = careers.filter((c) =>
        StringUtil.includesDeburrIgnoreCase(
          (<any>c.data?.data)?.careergroup?.value,
          rc
        )
      );
      if (cs.length === 4) {
        result.push(...cs.map((c) => c.name));
      }
    });

    return Promise.resolve(result);
  }

  public static getStatusTiers() {
    return game.wfrp4e.config.statusTiers;
  }

  public static async getAllBasicSkills() {
    return await game.wfrp4e.utility.allBasicSkills();
  }

  public static async findSkill(name: string) {
    return await game.wfrp4e.utility.findSkill(name);
  }

  public static async findTalent(name: string) {
    return await game.wfrp4e.utility.findTalent(name);
  }

  public static async getSpeciesCharacteristics(speciesKey: string) {
    return await game.wfrp4e.utility.speciesCharacteristics(speciesKey, true);
  }

  public static async getSpeciesMovement(speciesKey: string) {
    return await game.wfrp4e.utility.speciesMovement(speciesKey);
  }
}
