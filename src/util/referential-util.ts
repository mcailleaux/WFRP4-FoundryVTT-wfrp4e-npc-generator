import StringUtil from './string-util.js';
import CompendiumUtil from './compendium-util.js';

export default class ReferentialUtil {
  public static getClassTrappings(): { [key: string]: string } {
    const voClassTraping: { [key: string]: string } =
      game.wfrp4e.config.classTrappings;
    const resolvedClassTrapping: { [key: string]: string } = {};
    Object.entries(voClassTraping).forEach(([key, value]) => {
      const localKey = game.i18n.localize(key);
      resolvedClassTrapping[localKey] = value;
    });
    return resolvedClassTrapping;
  }

  public static getClassKeyFromCareer(career: Item.Data) {
    const careerClass = (<any>career.data)?.class?.value;
    const keys = Object.keys(this.getClassTrappings());
    return keys.find((k) =>
      StringUtil.includesDeburrIgnoreCase(k.trim(), careerClass?.trim())
    );
  }

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
    const careers: Item[] = await CompendiumUtil.getCompendiumCareerIndexes();
    const worldCareers = game.items?.entities?.filter(
      (item) => item.type === 'career'
    );
    if (worldCareers != null && worldCareers.length > 0) {
      careers.push(...worldCareers);
    }
    return Promise.resolve(careers);
  }

  public static async getCareerEntities(withWorld = true): Promise<Item[]> {
    const careers: Item[] = await CompendiumUtil.getCompendiumCareers();
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
    const trappings: Item[] = await CompendiumUtil.getCompendiumTrappings();
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

  public static async findTrappings(
    name: string,
    referentialTrappings?: Item[]
  ): Promise<Item.Data | null> {
    const searchTrappings =
      referentialTrappings ?? (await this.getTrappingEntities(true));
    const trapping =
      searchTrappings.find((t) =>
        StringUtil.equalsDeburrIgnoreCase(name, t.name)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(t.name, name)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(name, t.name)
      );
    if (trapping == null) {
      console.warn(`Can't find trapping ${name}`);
    }
    return Promise.resolve(trapping?.data ?? null);
  }

  public static async getSpeciesCharacteristics(speciesKey: string) {
    return await game.wfrp4e.utility.speciesCharacteristics(speciesKey, true);
  }

  public static async getSpeciesMovement(speciesKey: string) {
    return await game.wfrp4e.utility.speciesMovement(speciesKey);
  }

  public static async getAllMoneyItems(): Promise<Item.Data[]> {
    let moneyItems: Item.Data[] =
      (await game.wfrp4e.utility.allMoneyItems()) ?? [];
    moneyItems = moneyItems
      .map((mi) => {
        (<any>mi.data).quantity.value = 0;
        return mi;
      })
      .sort((a, b) => {
        const aData: any = a.data;
        const bData: any = b.data;
        return aData.coinValue.value > bData.coinValue.value ? -1 : 1;
      });
    return Promise.resolve(moneyItems);
  }
}
