import StringUtil from './string-util.js';
import CompendiumUtil from './compendium-util.js';
import EntityUtil from './entity-util.js';
import { actors, i18n, items, wfrp4e, world } from '../constant.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import {
  speciesPsychologies,
  speciesSkills,
  speciesTalents,
  speciesTraits,
} from '../referential/species-referential.js';
import WaiterUtil from './waiter-util.js';

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

  private static speciesSkillsMap: { [key: string]: string[] };
  private static speciesTalentsMap: { [key: string]: any[] };
  private static speciesTraitsMap: { [key: string]: any[] };
  private static speciesPsychologiesMap: { [key: string]: any[] };

  private static referentialLoaded = false;
  private static creatureReferentialLoaded = false;

  public static async initReferential(
    callback: () => void,
    forCreatures = false
  ) {
    await CompendiumUtil.initCompendium(async () => {
      if (!this.referentialLoaded || !this.creatureReferentialLoaded) {
        await WaiterUtil.show(
          'WFRP4NPCGEN.compendium.load.title',
          'WFRP4NPCGEN.compendium.load.hint',
          async () => {
            if (forCreatures) {
            } else {
              await Promise.all([
                this.getSpeciesSkillsMap(),
                this.getSpeciesTalentsMap(),
                this.getSpeciesTraitsMap(),
                this.getSpeciesPsychologiesMap(),
              ]);
            }

            if (!this.referentialLoaded || !this.creatureReferentialLoaded) {
              await WaiterUtil.hide();
            }
            if (forCreatures) {
              this.creatureReferentialLoaded = true;
            } else {
              this.referentialLoaded = true;
            }

            callback();
          }
        );
      } else {
        callback();
      }
    }, forCreatures);
  }

  public static getClassTrappings(): { [key: string]: string } {
    const voClassTraping: { [key: string]: string } = wfrp4e().config
      .classTrappings;
    const resolvedClassTrapping: { [key: string]: string } = {};
    Object.entries(voClassTraping).forEach(([key]) => {
      let useKey = key;
      if ((<any>i18n().translations)[useKey] == null && useKey.endsWith('s')) {
        useKey = useKey.substring(0, useKey.length - 1);
      }
      const localKey = i18n().localize(useKey);
      resolvedClassTrapping[localKey] = i18n().localize(
        `WFRP4NPCGEN.trappings.class.${key}`
      );
    });
    return resolvedClassTrapping;
  }

  public static getClassKeyFromCareer(career: ItemData) {
    const careerClass = (<any>career.data)?.class?.value;
    const keys = Object.keys(this.getClassTrappings());
    return keys.find((k) =>
      StringUtil.includesDeburrIgnoreCase(k.trim(), careerClass?.trim())
    );
  }

  public static getSpeciesMap(): { [key: string]: string } {
    return wfrp4e().config.species;
  }

  public static getSubSpeciesMap(): {
    [key: string]: {
      [subKey: string]: {
        name: string;
        skills: string[];
        talents: any[];
      };
    };
  } {
    const result: {
      [key: string]: {
        [subKey: string]: {
          name: string;
          skills: string[];
          talents: any[];
        };
      };
    } = {};
    for (let [key, value] of Object.entries(wfrp4e().config.subspecies)) {
      for (let [subKey, subValue] of Object.entries(
        <
          {
            [subKey: string]: {
              name: string;
              skills: string[];
              talents: any[];
            };
          }
        >value
      )) {
        const content = {
          name: subValue.name,
          skills:
            subValue.skills != null
              ? subValue.skills
              : this.getOldSpeciesSkillsMap()[key],
          talents:
            subValue.talents != null
              ? subValue.talents
              : this.getOldSpeciesTalentsMap()[key],
        };
        if (result[key] == null) {
          result[key] = {};
        }
        result[key][subKey] = content;
      }
    }
    return result;
  }

  public static getSpeciesSubSpeciesMap(
    speciesKey: string
  ): {
    [key: string]: {
      name: string;
      skills: string[];
      talents: any[];
    };
  } | null {
    const subSpecies = this.getSubSpeciesMap();
    return subSpecies != null ? subSpecies[speciesKey] : null;
  }

  public static getOldSpeciesSkillsMap(): { [key: string]: string[] } {
    return wfrp4e().config.speciesSkills;
  }

  public static getOldSpeciesTalentsMap(): { [key: string]: any[] } {
    return wfrp4e().config.speciesTalents;
  }

  public static getRandomTalents(): string[] {
    return wfrp4e().tables.talents.rows.map((row: any) => row.name);
  }

  public static getWeaponTypes(): { melee: string; ranged: string } {
    return {
      melee: i18n().localize('WFRP4NPCGEN.trappings.weapon.skill.melee'),
      ranged: i18n().localize('WFRP4NPCGEN.trappings.weapon.skill.ranged'),
    };
  }

  public static getWeaponGroups(): string[] {
    return Object.values(wfrp4e().config.weaponGroups);
  }

  public static getWeaponGroupsKey(group: string): string {
    for (let key of Object.keys(wfrp4e().config.weaponGroups)) {
      if (
        StringUtil.equalsDeburrIgnoreCase(
          wfrp4e().config.weaponGroups[key],
          group
        )
      ) {
        return key;
      }
    }
    return '';
  }

  public static getMeleeWeaponGroups(): string[] {
    const groups = wfrp4e().config.weaponGroups;
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
    const groups = wfrp4e().config.weaponGroups;
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
    return wfrp4e().config.weaponGroups.basic;
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

  public static async getCareerEntitieNames(
    withWorld = true
  ): Promise<string[]> {
    const names = (await this.getCareerEntities(withWorld)).map(
      (c) => c.name ?? ''
    );
    return Promise.resolve(names);
  }

  public static async getWorldCareers(): Promise<Item[]> {
    const careersGroups = await CompendiumUtil.getCompendiumCareersGroups();
    const worldCareers = items()?.contents?.filter((item: any) => {
      const group = (<any>item?.data?.data)?.careergroup?.value;
      return item.type === 'career' && !careersGroups.includes(group);
    });
    return Promise.resolve(worldCareers);
  }

  public static async getWorldEntities(type: string): Promise<Item[]> {
    const worldEntities = items()?.contents?.filter((item: any) => {
      return item.type === type;
    });
    return Promise.resolve(worldEntities);
  }

  public static async getWorldActorEntities(type?: string): Promise<Actor[]> {
    const worldEntities = actors()?.filter((actor: any) => {
      return type != null ? actor.data?.type === type : true;
    });
    return Promise.resolve(worldEntities);
  }

  public static async getTrappingEntities(withWorld = true): Promise<Item[]> {
    const trappings: Item[] = await CompendiumUtil.getCompendiumTrappings();
    const finalTrappings: Item[] = [];
    if (withWorld) {
      const trappingCategories = CompendiumUtil.getTrappingCategories();
      const worldTrappings = items()?.contents?.filter(
        (item: any) =>
          trappingCategories.includes(item.type) ||
          trappingCategories.includes(
            (<any>item?.data?.data)?.trappingType?.value
          )
      );
      if (worldTrappings != null && worldTrappings.length > 0) {
        finalTrappings.push(...worldTrappings);
      }
    }
    finalTrappings.push(...trappings);
    return Promise.resolve(finalTrappings);
  }

  public static async getRandomSpeciesCareers(
    speciesKey: string,
    subSpeciesKey?: string
  ): Promise<string[]> {
    if (speciesKey == null) {
      return [];
    }
    const concatKey =
      subSpeciesKey != null ? `${speciesKey}-${subSpeciesKey}` : speciesKey;
    const humanDefaultKey = 'human-reiklander';
    const randomCareers: string[] = wfrp4e()
      .tables.career.rows.filter((row: any) => {
        let result = row?.range[concatKey]?.length > 0;
        if (!result) {
          result = row?.range[speciesKey]?.length > 0;
        }
        if (!result && speciesKey === 'human') {
          result = row?.range[humanDefaultKey]?.length > 0;
        }
        return result;
      })
      .map((row: any) => {
        let result = row[concatKey]?.name;
        if (result == null) {
          result = row[speciesKey]?.name;
        }
        if (result == null && speciesKey === 'human') {
          result = row[humanDefaultKey]?.name;
        }
        return result;
      });

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
          StringUtil.equalsDeburrIgnoreCase(c.name ?? '', rc)
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
        result.push(...cs.map((c) => c.name ?? ''));
      }
    });

    return Promise.resolve(result);
  }

  public static getStatusTiers() {
    return wfrp4e().config.statusTiers;
  }

  public static async getAllBasicSkills() {
    return await wfrp4e().utility.allBasicSkills();
  }

  public static async findSkill(name: string): Promise<ItemData> {
    const skills = [
      ...(await this.getWorldEntities('skill')),
      ...(await this.getSkillEntities(false)),
    ];
    const skill = EntityUtil.find(name, skills);
    if (skill == null) {
      throw (
        'Could not find skill (or specialization of) ' +
        name +
        ' in compendum or world'
      );
    }
    return skill;
  }

  public static async findTalent(name: string) {
    const talents = [
      ...(await this.getWorldEntities('talent')),
      ...(await this.getTalentEntities(false)),
    ];
    const talent = EntityUtil.find(name, talents);
    if (talent == null) {
      throw (
        'Could not find talent (or specialization of) ' +
        name +
        ' in compendum or world'
      );
    }
    return talent;
  }

  public static async findPsychology(name: string) {
    const psychologies = [
      ...(await this.getWorldEntities('psychology')),
      ...(await this.getPsychologyEntities(false)),
    ];
    const psychology = EntityUtil.find(name, psychologies);
    if (psychology == null) {
      throw (
        'Could not find psychology (or specialization of) ' +
        name +
        ' in compendum or world'
      );
    }
    return psychology;
  }

  public static async findTrait(name: string, onlyRefTrait = false) {
    const traits = [
      ...(await this.getWorldEntities('trait')),
      ...(await this.getTraitEntities(false)),
    ];
    const trait: ItemData & any = EntityUtil.find(name, traits);
    if (trait == null) {
      throw (
        'Could not find trait (or specialization of) ' +
        name +
        ' in compendum or world'
      );
    }
    if (onlyRefTrait) {
      return trait;
    }
    if (name.includes('(') && name.includes(')')) {
      const simpleName = StringUtil.getSimpleName(trait.name ?? name);
      const groupedName =
        StringUtil.getGroupName(trait.name ?? name) ??
        StringUtil.getGroupName(name);
      trait.name = simpleName;
      (<any>trait.data).specification.value = groupedName;
    } else {
      if (trait.name == null) {
        trait.name = name;
      }
      trait.DisplayName = trait.name;
    }

    return trait;
  }

  public static async findTrappings(
    name: string,
    referentialTrappings?: Item[]
  ): Promise<ItemData[]> {
    let searchName = StringUtil.toDeburrLowerCase(name);
    const trappings: ItemData[] = [];
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
          .map((word: any) => word.trim())
          .filter((word: any) => word.length > 3);
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
    const trappings: ItemData[] = [];
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
  ): Promise<ItemData | null> {
    const searchTrappings =
      referentialTrappings ?? (await this.getTrappingEntities(true));
    const simpleName =
      name.includes('(') && name.includes(')')
        ? name.substring(0, name.indexOf('(')).trim()
        : name;
    let trapping =
      searchTrappings.find((t) =>
        StringUtil.equalsDeburrIgnoreCase(name, t.name ?? '')
      ) ??
      searchTrappings.find((t) =>
        StringUtil.equalsDeburrIgnoreCase(t.name ?? '', simpleName)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(t.name ?? '', name)
      ) ??
      searchTrappings.find((t) =>
        StringUtil.includesDeburrIgnoreCase(t.name ?? '', simpleName)
      );

    if (trapping == null && !fromWord) {
      trapping = searchTrappings
        .sort((t1, t2) => {
          return (t2.name ?? '').length - (t1.name ?? '').length;
        })
        .find((t) => StringUtil.includesDeburrIgnoreCase(name, t.name ?? ''));
    }

    if (trapping == null) {
      console.warn(
        `Can't find trapping ${name}${
          simpleName !== name ? `or ${simpleName}` : ''
        }`
      );
    } else if (!StringUtil.equalsDeburrIgnoreCase(trapping.name ?? '', name)) {
      console.warn(`Trapping ${name} is resolved by ${trapping.name}`);
    }

    return Promise.resolve(trapping?.data ?? null);
  }

  public static async getSpeciesCharacteristics(speciesKey: string) {
    return await wfrp4e().utility.speciesCharacteristics(speciesKey, true);
  }

  public static async getSpeciesMovement(speciesKey: string) {
    return await wfrp4e().utility.speciesMovement(speciesKey);
  }

  public static async getAllMoneyItems(): Promise<ItemData[]> {
    let moneyItems: ItemData[] = (await wfrp4e().utility.allMoneyItems()) ?? [];
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
        actors[world().title] = worldActors;
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
        bestiary[world().title] = worldActors;
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

  public static async getPsychologyEntities(withWorld = true): Promise<Item[]> {
    const psychologies: Item[] = await CompendiumUtil.getCompendiumPsychologies();
    if (withWorld) {
      const worldPsychologies = await this.getWorldEntities('psychology');
      if (worldPsychologies != null && worldPsychologies.length > 0) {
        psychologies.push(...worldPsychologies);
      }
    }
    return Promise.resolve(psychologies);
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
    const compendiumActorTraits: ItemData[] = [];
    const traits = await CompendiumUtil.getCompendiumTraits();
    const traitsNames = traits.map((t) =>
      EntityUtil.toMinimalName(t.name ?? '').trim()
    );
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newTraits: ItemData[] = data?.traits?.filter(
          (t: ItemData) =>
            !traitsNames.includes(EntityUtil.toMinimalName(t.name).trim())
        );
        if (newTraits != null && newTraits.length > 0) {
          traitsNames.push(
            ...newTraits.map((t) => EntityUtil.toMinimalName(t.name).trim())
          );
          compendiumActorTraits.push(...newTraits);
        }
      }
    }

    return Promise.resolve(compendiumActorTraits);
  }

  public static async getCompendiumActorSkills() {
    const compendiumActorSkills: ItemData[] = [];
    const skills = await CompendiumUtil.getCompendiumSkills();
    const skillsNames = skills.map((t) =>
      EntityUtil.toMinimalName(t.name ?? '').trim()
    );
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newSkills: ItemData[] = data?.skills?.filter(
          (t: ItemData) =>
            !skillsNames.includes(EntityUtil.toMinimalName(t.name).trim()) &&
            !t.name.trim().startsWith('(')
        );
        if (newSkills != null && newSkills.length > 0) {
          skillsNames.push(
            ...newSkills.map((t) => EntityUtil.toMinimalName(t.name).trim())
          );
          compendiumActorSkills.push(...newSkills);
        }
      }
    }

    return Promise.resolve(compendiumActorSkills);
  }

  public static async getCompendiumActorTalents() {
    const compendiumActorTalents: ItemData[] = [];
    const talents = await CompendiumUtil.getCompendiumTalents();
    const talentsNames = talents.map((t) =>
      EntityUtil.toMinimalName(t.name ?? '').trim()
    );
    const actorsMap = await this.getActorsEntities();
    for (let [_key, actors] of Object.entries(actorsMap)) {
      for (let actor of actors) {
        const data: any = actor.data;
        const newTalents: ItemData[] = data?.talents?.filter(
          (t: ItemData) =>
            !talentsNames.includes(EntityUtil.toMinimalName(t.name).trim()) &&
            !t.name.trim().startsWith('(')
        );
        if (newTalents != null && newTalents.length > 0) {
          talentsNames.push(
            ...newTalents.map((t) => EntityUtil.toMinimalName(t.name).trim())
          );
          compendiumActorTalents.push(...newTalents);
        }
      }
    }

    return Promise.resolve(compendiumActorTalents);
  }

  public static async getSpeciesSkillsMap(): Promise<{
    [key: string]: string[];
  }> {
    if (this.speciesSkillsMap == null) {
      this.speciesSkillsMap = {};
      const coreMap = wfrp4e().config.speciesSkills;
      for (let key of Object.keys(coreMap)) {
        const moduleSkills: string[] = speciesSkills[key];
        if (moduleSkills == null) {
          console.warn(`Cant find fixed sub species skills map for ${key}`);
        }
        const skills: string[] =
          moduleSkills != null ? moduleSkills : coreMap[key];
        for (let skill of skills) {
          try {
            const refSkill = await ReferentialUtil.findSkill(skill);
            if (refSkill != null) {
              if (this.speciesSkillsMap[key] == null) {
                this.speciesSkillsMap[key] = [];
              }
              this.speciesSkillsMap[key].push(refSkill.name);
            }
          } catch (e) {
            console.warn(`Cant find Species ${key} Skill: ${skill}`);
          }
        }
      }
    }
    return Promise.resolve(this.speciesSkillsMap);
  }

  public static async getSpeciesSkills(key: string): Promise<string[]> {
    return Promise.resolve((await this.getSpeciesSkillsMap())[key] ?? []);
  }

  public static async getSpeciesTalentsMap(): Promise<{
    [key: string]: any[];
  }> {
    if (this.speciesTalentsMap == null) {
      this.speciesTalentsMap = {};
      await this.initSpeciesEntities(
        this.speciesTalentsMap,
        'speciesTalents',
        speciesTalents,
        (name) => this.findTalent(name),
        'Talent'
      );
    }
    return Promise.resolve(this.speciesTalentsMap);
  }

  public static async getSpeciesTalents(key: string): Promise<string[]> {
    return Promise.resolve((await this.getSpeciesTalentsMap())[key] ?? []);
  }

  public static async getSpeciesTraitsMap(): Promise<{
    [key: string]: any[];
  }> {
    if (this.speciesTraitsMap == null) {
      this.speciesTraitsMap = {};
      await this.initSpeciesEntities(
        this.speciesTraitsMap,
        'speciesTalents',
        speciesTraits,
        (name) => this.findTrait(name, true),
        'Trait',
        true
      );
    }
    return Promise.resolve(this.speciesTraitsMap);
  }

  public static async getSpeciesTraits(key: string): Promise<string[]> {
    return Promise.resolve((await this.getSpeciesTraitsMap())[key] ?? []);
  }

  public static async getSpeciesPsychologiesMap(): Promise<{
    [key: string]: any[];
  }> {
    if (this.speciesPsychologiesMap == null) {
      this.speciesPsychologiesMap = {};
      await this.initSpeciesEntities(
        this.speciesPsychologiesMap,
        'speciesTalents',
        speciesPsychologies,
        (name) => this.findPsychology(name),
        'Psychology',
        true
      );
    }
    return Promise.resolve(this.speciesPsychologiesMap);
  }

  public static async getSpeciesPsychologies(key: string): Promise<string[]> {
    return Promise.resolve((await this.getSpeciesPsychologiesMap())[key] ?? []);
  }

  private static async initSpeciesEntities(
    targetMap: { [key: string]: any[] },
    configKey: string,
    moduleMap: { [key: string]: any[] },
    search: (name: string) => Promise<ItemData>,
    logType: string,
    onlyModule = false
  ) {
    const coreMap = wfrp4e().config[configKey];
    for (let key of Object.keys(coreMap)) {
      const moduleEntities: any[] = moduleMap[key];
      if (moduleEntities == null) {
        console.warn(`Cant find fixed sub species ${logType} map for ${key}`);
        if (onlyModule) {
          continue;
        }
      }
      const entities: any[] =
        moduleEntities != null ? moduleEntities : coreMap[key];
      for (let entity of entities) {
        try {
          if (typeof entity === 'number') {
            if (targetMap[key] == null) {
              targetMap[key] = [];
            }
            targetMap[key].push(entity);
          } else if (entity.includes(',')) {
            const multiEntities = entity.split(',').map((t) => t.trim());
            let finalMultiEntity = '';
            for (let multiEntity of multiEntities) {
              const refEntity = await search(multiEntity);
              if (refEntity != null) {
                if (finalMultiEntity.length > 0) {
                  finalMultiEntity += ', ';
                }
                finalMultiEntity += refEntity.name;
              }
            }
            if (finalMultiEntity.length > 0) {
              if (targetMap[key] == null) {
                targetMap[key] = [];
              }
              targetMap[key].push(finalMultiEntity);
            }
          } else {
            const refTalent = await search(entity);
            if (refTalent != null) {
              if (targetMap[key] == null) {
                targetMap[key] = [];
              }
              targetMap[key].push(refTalent.name);
            }
          }
        } catch (e) {
          console.warn(`Cant find Species ${key} ${logType}: ${entity}`);
        }
      }
    }
  }
}
