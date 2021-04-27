import StringUtil from './string-util.js';
import CompendiumUtil from './compendium-util.js';

export default class ReferentialUtil {
  public static getClassTrappings(): { [key: string]: string } {
    const voClassTraping: { [key: string]: string } =
      game.wfrp4e.config.classTrappings;
    const resolvedClassTrapping: { [key: string]: string } = {};
    Object.entries(voClassTraping).forEach(([key]) => {
      const localKey = game.i18n.localize(key);
      resolvedClassTrapping[localKey] = game.i18n.localize(
        `WFRP4NPCGEN.trappings.class.${key}`
      );
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
    const skillName = name?.trim();
    const worldItem = game.items.entities.find(
      (i) => i.type === 'skill' && i.name === skillName
    );
    if (worldItem != null) {
      return Promise.resolve(worldItem);
    }

    const skillList = await CompendiumUtil.getCompendiumSkillIndexes();

    let searchResult = skillList.find((s) => s.name === skillName);
    if (searchResult == null) {
      searchResult = skillList.find(
        (s) => s.name.split('(')[0].trim() === skillName.split('(')[0].trim()
      );
    }

    if (searchResult != null) {
      const dbSkill = (await CompendiumUtil.getCompendiumSkills()).find(
        (s) => s._id === searchResult?._id
      );
      if (dbSkill != null) {
        dbSkill.data.name = skillName;
        return Promise.resolve(dbSkill);
      }
    }

    throw (
      'Could not find skill (or specialization of) ' +
      skillName +
      ' in compendum or world'
    );
  }

  public static async findTalent(name: string) {
    const talentName = name.trim();

    const worldItem = game.items.entities.find(
      (i) => i.type === 'talent' && i.name === talentName
    );
    if (worldItem != null) {
      return Promise.resolve(worldItem);
    }

    const talentList = await CompendiumUtil.getCompendiumTalentIndexes();
    // Search for specific talent (won't find unlisted specializations)
    let searchResult = talentList.find((t) => t.name === talentName);
    if (searchResult == null) {
      searchResult = talentList.find(
        (t) => t.name.split('(')[0].trim() === talentName.split('(')[0].trim()
      );
    }

    if (searchResult != null) {
      const dbTalent = (await CompendiumUtil.getCompendiumTalents()).find(
        (t) => t._id === searchResult?._id
      );
      if (dbTalent != null) {
        dbTalent.data.name = talentName;
        return Promise.resolve(dbTalent);
      }
    }
    throw (
      'Could not find talent (or specialization of) ' +
      talentName +
      ' in compendium or world'
    );
  }

  public static async findTrapping(
    name: string,
    referentialTrappings?: Item[]
  ): Promise<Item.Data | null> {
    const searchTrappings =
      referentialTrappings ?? (await this.getTrappingEntities(true));
    const simpleName =
      name.includes('(') && name.includes(')')
        ? name.substring(0, name.indexOf('(')).trim()
        : name;
    const trapping =
      searchTrappings.find((t) =>
        StringUtil.equalsDeburrIgnoreCase(name, t.name)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.equalsDeburrIgnoreCase(t.name, simpleName)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(t.name, name)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(t.name, simpleName)
      ) ??
      searchTrappings
        .sort((t1, t2) => {
          return StringUtil.localCompareDeburrIgnoreCase(
            t1.name,
            t2.name,
            false
          );
        })
        .find((t) => StringUtil.includesDeburrIgnoreCase(name, t.name));
    if (trapping == null) {
      console.warn(
        `Can't find trapping ${name}${
          simpleName !== name ? `or ${simpleName}` : ''
        }`
      );
    } else if (!StringUtil.equalsDeburrIgnoreCase(trapping.name, name)) {
      console.warn(`Trapping ${name} is resolved by ${trapping.name}`);
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
