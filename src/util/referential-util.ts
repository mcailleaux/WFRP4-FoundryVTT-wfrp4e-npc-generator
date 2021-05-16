import StringUtil from './string-util.js';
import CompendiumUtil from './compendium-util.js';

export default class ReferentialUtil {
  public static readonly sortedSize = [
    'tiny',
    'ltl',
    'sml',
    'avg',
    'lrg',
    'enor',
    'mnst',
  ];

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

  public static async getCareerEntities(withWorld = true): Promise<Item[]> {
    const careers: Item[] = await CompendiumUtil.getCompendiumCareers();
    if (withWorld) {
      const worldCareers = await this.getWorldCareers();
      if (worldCareers != null && worldCareers.length > 0) {
        careers.push(...worldCareers);
      }
    }
    return Promise.resolve(careers);
  }

  public static async getWorldCareers(): Promise<Item[]> {
    const careersGroups = await CompendiumUtil.getCompendiumCareersGroups();
    const worldCareers = game.items?.entities?.filter((item) => {
      const group = (<any>item?.data?.data)?.careergroup?.value;
      return item.type === 'career' && !careersGroups.includes(group);
    });
    return Promise.resolve(worldCareers);
  }

  public static async getWorldEntities(type: string): Promise<Item[]> {
    const worldEntities = game.items?.entities?.filter((item) => {
      return item.type === type;
    });
    return Promise.resolve(worldEntities);
  }

  public static async getWorldActorEntities(type?: string): Promise<Actor[]> {
    const worldEntities = game.actors?.filter((actor) => {
      return type != null ? actor.data?.type === type : true;
    });
    return Promise.resolve(worldEntities);
  }

  public static async getTrappingEntities(withWorld = true): Promise<Item[]> {
    const trappings: Item[] = await CompendiumUtil.getCompendiumTrappings();
    if (withWorld) {
      const trappingCategories = CompendiumUtil.getTrappingCategories();
      const worldTrappings = game.items?.entities?.filter(
        (item) =>
          trappingCategories.includes(item.type) ||
          trappingCategories.includes(
            (<any>item?.data?.data)?.trappingType?.value
          )
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
        .replace(StringUtil.toDeburrLowerCase(trapping.name.trim()), '')
        .replace('(', '')
        .replace(')', '')
        .trim();
      if (searchName === lastSearch) {
        const simpleName =
          searchName.includes('(') && searchName.includes(')')
            ? searchName.substring(0, searchName.indexOf('(')).trim()
            : searchName;
        if (simpleName !== searchName) {
          searchName = searchName
            .replace(StringUtil.toDeburrLowerCase(simpleName), '')
            .replace('(', '')
            .replace(')', '')
            .trim();
        }
      }
      if (searchName === lastSearch) {
        const words = trapping.name
          .trim()
          .split(' ')
          .map((word) => word.trim())
          .filter((word) => word.length > 3);
        for (let word of words) {
          searchName = searchName
            .replace(StringUtil.toDeburrLowerCase(word), '')
            .trim();
        }
      }
      if (searchName.length > 3 && lastSearch !== searchName) {
        trapping = await this.findTrapping(searchName, referentialTrappings);
      } else {
        trapping = null;
      }
    }
    if (searchName.trim().includes(' ')) {
      trappings.push(
        ...(await this.findTrappingsByWords(searchName, referentialTrappings))
      );
    }
    return Promise.resolve(trappings);
  }

  public static async findTrappingsByWords(
    name: string,
    referentialTrappings?: Item[]
  ) {
    const trappings = [];
    if (name != null && name.length > 0) {
      const words = name
        .split(' ')
        .map((word) => word.trim())
        .map((word) => word.replace('(', '').replace(')', ''))
        .filter((word) => word.length > 3);
      for (let word of words) {
        const trapping = await this.findTrapping(
          word,
          referentialTrappings,
          true
        );
        if (trapping != null) {
          trappings.push(trapping);
        }
      }
    }
    return trappings;
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

  public static async getActorsEntities(
    withWorld = true
  ): Promise<{
    [pack: string]: Actor[];
  }> {
    const actors: {
      [pack: string]: Actor[];
    } = await CompendiumUtil.getCompendiumActors();
    if (withWorld) {
      const worldActors = await this.getWorldActorEntities();
      if (worldActors != null && worldActors.length > 0) {
        actors[game.world.title] = worldActors;
      }
    }
    return Promise.resolve(actors);
  }

  public static async getBestiaryEntities(
    withWorld = true
  ): Promise<{
    [pack: string]: Actor[];
  }> {
    const bestiary: {
      [pack: string]: Actor[];
    } = await CompendiumUtil.getCompendiumBestiary();
    if (withWorld) {
      const worldActors = await this.getWorldActorEntities('creature');
      if (worldActors != null && worldActors.length > 0) {
        bestiary[game.world.title] = worldActors;
      }
    }
    return Promise.resolve(bestiary);
  }

  public static async getSkillEntities(withWorld = true): Promise<Item[]> {
    const skills: Item[] = await CompendiumUtil.getCompendiumSkills();
    if (withWorld) {
      const worldSkills = await this.getWorldEntities('skill');
      if (worldSkills != null && worldSkills.length > 0) {
        skills.push(...worldSkills);
      }
    }
    return Promise.resolve(skills);
  }

  public static async getTalentEntities(withWorld = true): Promise<Item[]> {
    const talents: Item[] = await CompendiumUtil.getCompendiumTalents();
    if (withWorld) {
      const worldTalents = await this.getWorldEntities('talent');
      if (worldTalents != null && worldTalents.length > 0) {
        talents.push(...worldTalents);
      }
    }
    return Promise.resolve(talents);
  }

  public static async getTraitEntities(withWorld = true): Promise<Item[]> {
    const traits: Item[] = await CompendiumUtil.getCompendiumTraits();
    if (withWorld) {
      const worldTraits = await this.getWorldEntities('trait');
      if (worldTraits != null && worldTraits.length > 0) {
        traits.push(...worldTraits);
      }
    }
    return Promise.resolve(traits);
  }

  public static async getSpellEntities(withWorld = true): Promise<Item[]> {
    const spells: Item[] = await CompendiumUtil.getCompendiumSpells();
    if (withWorld) {
      const worldSpells = await this.getWorldEntities('spell');
      if (worldSpells != null && worldSpells.length > 0) {
        spells.push(...worldSpells);
      }
    }
    return Promise.resolve(spells);
  }

  public static async getPrayerEntities(withWorld = true): Promise<Item[]> {
    const prayers: Item[] = await CompendiumUtil.getCompendiumPrayers();
    if (withWorld) {
      const worldPrayers = await this.getWorldEntities('prayer');
      if (worldPrayers != null && worldPrayers.length > 0) {
        prayers.push(...worldPrayers);
      }
    }
    return Promise.resolve(prayers);
  }

  public static async getPhysicalMutationEntities(
    withWorld = true
  ): Promise<Item[]> {
    const physicalMutations: Item[] = await CompendiumUtil.getCompendiumPhysicalMutations();
    if (withWorld) {
      const worldPrayers = await this.getWorldEntities('mutation');
      if (worldPrayers != null && worldPrayers.length > 0) {
        physicalMutations.push(
          ...worldPrayers.filter(
            (m) => (<any>m.data.data).mutationType.value === 'physical'
          )
        );
      }
    }
    return Promise.resolve(physicalMutations);
  }

  public static async getMentalMutationEntities(
    withWorld = true
  ): Promise<Item[]> {
    const mentalMutations: Item[] = await CompendiumUtil.getCompendiumMentalMutations();
    if (withWorld) {
      const worldPrayers = await this.getWorldEntities('mutation');
      if (worldPrayers != null && worldPrayers.length > 0) {
        mentalMutations.push(
          ...worldPrayers.filter(
            (m) => (<any>m.data.data).mutationType.value === 'mental'
          )
        );
      }
    }
    return Promise.resolve(mentalMutations);
  }

  public static async getCompendiumActorTraits() {
    const compendiumActorTraits: Item.Data[] = [];
    const traits = await CompendiumUtil.getCompendiumTraits();
    const traitsNames = traits.map((t) => t.name);
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newTraits: Item.Data[] = data?.traits?.filter(
          (t: Item.Data) => !traitsNames.includes(t.name)
        );
        if (newTraits != null && newTraits.length > 0) {
          traitsNames.push(...newTraits.map((t) => t.name));
          compendiumActorTraits.push(...newTraits);
        }
      }
    }

    return Promise.resolve(compendiumActorTraits);
  }

  public static async getCompendiumActorSkills() {
    const compendiumActorSkills: Item.Data[] = [];
    const skills = await CompendiumUtil.getCompendiumSkills();
    const skillsNames = skills.map((t) => t.name);
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newSkills: Item.Data[] = data?.skills?.filter(
          (t: Item.Data) =>
            !skillsNames.includes(t.name) && !t.name.trim().startsWith('(')
        );
        if (newSkills != null && newSkills.length > 0) {
          skillsNames.push(...newSkills.map((t) => t.name));
          compendiumActorSkills.push(...newSkills);
        }
      }
    }

    return Promise.resolve(compendiumActorSkills);
  }

  public static async getCompendiumActorTalents() {
    const compendiumActorTalents: Item.Data[] = [];
    const talents = await CompendiumUtil.getCompendiumTalents();
    const talentsNames = talents.map((t) => t.name);
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newTalents: Item.Data[] = data?.talents?.filter(
          (t: Item.Data) => !talentsNames.includes(t.name)
        );
        if (newTalents != null && newTalents.length > 0) {
          talentsNames.push(...newTalents.map((t) => t.name));
          compendiumActorTalents.push(...newTalents);
        }
      }
    }

    return Promise.resolve(compendiumActorTalents);
  }
}
