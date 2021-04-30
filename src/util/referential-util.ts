import StringUtil from './string-util.js';
import CompendiumUtil from './compendium-util.js';

export default class ReferentialUtil {
  public static getClassTrappings(): { [key: string]: string } {
    const voClassTraping: { [key: string]: string } =
      game.wfrp4e.config.classTrappings;
    const resolvedClassTrapping: { [key: string]: string } = {};
    Object.entries(voClassTraping).forEach(([key]) => {
      let useKey = key;
      if (
        (<any>game.i18n.translations)[useKey] == null &&
        useKey.endsWith('s')
      ) {
        useKey = useKey.substring(0, useKey.length - 1);
      }
      const localKey = game.i18n.localize(useKey);
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

  public static getWeaponTypes(): { melee: string; ranged: string } {
    return {
      melee: game.i18n.localize('WFRP4NPCGEN.trappings.weapon.skill.melee'),
      ranged: game.i18n.localize('WFRP4NPCGEN.trappings.weapon.skill.ranged'),
    };
  }

  public static getWeaponGroups(): string[] {
    return Object.values(game.wfrp4e.config.weaponGroups);
  }

  public static getWeaponGroupsKey(group: string): string {
    for (let key of Object.keys(game.wfrp4e.config.weaponGroups)) {
      if (
        StringUtil.equalsDeburrIgnoreCase(
          game.wfrp4e.config.weaponGroups[key],
          group
        )
      ) {
        return key;
      }
    }
    return '';
  }

  public static getMeleeWeaponGroups(): string[] {
    const groups = game.wfrp4e.config.weaponGroups;
    return [
      groups.basic,
      groups.brawling,
      groups.cavalry,
      groups.fencing,
      groups.flail,
      groups.parry,
      groups.polearm,
      groups.twohanded,
    ];
  }

  public static getRangedWeaponGroups(): string[] {
    const groups = game.wfrp4e.config.weaponGroups;
    return [
      groups.blackpowder,
      groups.bow,
      groups.crossbow,
      groups.engineering,
      groups.entangling,
      groups.explosives,
      groups.sling,
      groups.throwing,
    ];
  }

  public static getBasicWeaponGroups(): string {
    return game.wfrp4e.config.weaponGroups.basic;
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
  ): Promise<Item.Data[]> {
    let searchName = StringUtil.toDeburrLowerCase(name);
    const trappings: Item.Data[] = [];
    let trapping = await this.findTrapping(searchName, referentialTrappings);
    while (trapping != null) {
      trappings.push(trapping);
      const lastSearch = searchName;
      searchName = searchName
        .replace(StringUtil.toDeburrLowerCase(trapping.name), '')
        .trim();
      if (searchName === lastSearch) {
        const simpleName =
          name.includes('(') && name.includes(')')
            ? name.substring(0, name.indexOf('(')).trim()
            : name;
        searchName = searchName
          .replace(StringUtil.toDeburrLowerCase(simpleName), '')
          .trim();
      }
      if (searchName === lastSearch) {
        const words = trapping.name
          .split(' ')
          .map((word) => word.trim())
          .filter((word) => word.length > 2);
        for (let word of words) {
          searchName = searchName
            .replace(StringUtil.toDeburrLowerCase(word), '')
            .trim();
        }
      }
      if (searchName.length > 0 && lastSearch !== searchName) {
        trapping = await this.findTrapping(searchName, referentialTrappings);
      } else {
        trapping = null;
      }
    }
    if (searchName.length > 0) {
      const words = searchName
        .split(' ')
        .map((word) => word.trim())
        .map((word) => word.replace('(', '').replace(')', ''))
        .filter((word) => word.length > 2);
      for (let word of words) {
        trapping = await this.findTrapping(word, referentialTrappings);
        if (trapping != null) {
          trappings.push(trapping);
        }
      }
    }
    return Promise.resolve(trappings);
  }

  public static async findTrapping(
    name: string,
    referentialTrappings?: Item[],
    fromWord = false
  ): Promise<Item.Data | null> {
    const searchTrappings =
      referentialTrappings ?? (await this.getTrappingEntities(true));
    const simpleName =
      name.includes('(') && name.includes(')')
        ? name.substring(0, name.indexOf('(')).trim()
        : name;
    let trapping =
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
      );

    if (trapping == null && !fromWord) {
      trapping = searchTrappings
        .sort((t1, t2) => {
          return t2.name.length - t1.name.length;
        })
        .find((t) => StringUtil.includesDeburrIgnoreCase(name, t.name));
    }

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
