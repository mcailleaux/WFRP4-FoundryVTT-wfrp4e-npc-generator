import StringUtil from './string-util.js';

export default class ReferentialUtil {
  public static getTrappingCategories(): string[] {
    return Object.keys(game.wfrp4e.config.trappingCategories);
  }

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

  public static async getCareerEntities(withWorld = true): Promise<Item[]> {
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getContent();
    if (withWorld) {
      const worldCareers = game.items?.entities?.filter(
        (item) => item.type === 'career'
      );
      if (worldCareers != null && worldCareers.length > 0) {
        careers.push(...worldCareers);
      }
    }
    return Promise.resolve(careers);
  }

  public static async getTrappingEntities(withWorld = true): Promise<Item[]> {
    const trappingsPack = game.packs.get('wfrp4e-core.trappings');
    const trappings: Item[] = await trappingsPack.getContent();
    if (withWorld) {
      const trappingCategories = this.getTrappingCategories();
      const worldTrappings = game.items?.entities?.filter((item) =>
        trappingCategories.includes(item.type)
      );
      if (worldTrappings != null && worldTrappings.length > 0) {
        trappings.push(...worldTrappings);
      }
    }
    return Promise.resolve(trappings);
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

    const careers = await this.getCareerEntities(false);

    const result: string[] = [];

    randomCareers.forEach((rc) => {
      let cs = careers.filter((c) =>
        StringUtil.includesDeburrIgnoreCase(
          (<any>c.data?.data)?.careergroup?.value,
          rc
        )
      );

      if (cs.length !== 4) {
        const strictCareer = careers.find((c) =>
          StringUtil.equalsDeburrIgnoreCase(c.name, rc)
        );
        if (strictCareer != null) {
          cs = careers.filter((c) =>
            StringUtil.equalsDeburrIgnoreCase(
              (<any>c.data?.data)?.careergroup?.value,
              (<any>strictCareer.data?.data)?.careergroup?.value
            )
          );
        }
      }

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
