import SpeciesChooser from './util/species-chooser.js';
import NpcModel from './npc-model.js';
import CheckDependencies from './check-dependencies.js';
import CareerChooser from './util/career-chooser.js';
import SpeciesSkillsChooser from './util/species-skills-chooser.js';
import SpeciesTalentsChooser from './util/species-talents-chooser.js';
import NameChooser from './util/name-chooser.js';
import RandomUtil from './util/random-util.js';
import { ActorBuilder } from './actor-builder.js';
import StringUtil from './util/string-util.js';
import TranslateErrorDetect from './util/translate-error-detect.js';
import ReferentialUtil from './util/referential-util.js';
import TrappingUtil from './util/trapping-util.js';
import OptionsChooser from './util/options.chooser.js';
import Options from './util/options.js';
import CompendiumUtil from './util/compendium-util.js';
import TrappingChooser from './util/trapping-chooser.js';
import WaiterUtil from './util/waiter-util.js';
import MagicsChooser from './util/magics-chooser.js';
import MutationsChooser from './util/mutations-chooser.js';
import NpcAbilitiesChooser from './util/npc-abilities-chooser.js';
import { i18n, notifications } from './constant.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;
  public static readonly speciesSkillsChooser = SpeciesSkillsChooser;
  public static readonly speciesTalentsChooser = SpeciesTalentsChooser;
  public static readonly nameChooser = NameChooser;
  public static readonly optionsChooser = OptionsChooser;
  public static readonly actorBuilder = ActorBuilder;
  public static readonly referential = ReferentialUtil;
  public static readonly compendium = CompendiumUtil;
  public static readonly trapping = TrappingUtil;
  public static readonly abilitiesChooser = NpcAbilitiesChooser;
  public static readonly trappingChooser = TrappingChooser;
  public static readonly magicsChooser = MagicsChooser;
  public static readonly mutationsChooser = MutationsChooser;
  public static readonly translateErrorDetect = TranslateErrorDetect;

  public static async generateNpc(
    callback?: (model: NpcModel, actorData: any, actor: any) => void
  ) {
    await this.compendium.initCompendium(async () => {
      await this.generateNpcModel(async (model) => {
        const actorData = await ActorBuilder.buildActorData(model, 'npc');
        const actor = await ActorBuilder.createActor(model, actorData);
        notifications().info(
          i18n().format('WFRP4NPCGEN.notification.actor.created', {
            name: actor.name,
          })
        );
        await WaiterUtil.hide();
        if (callback != null) {
          callback(model, actorData, actor);
        }
      });
    });
  }

  public static async generateNpcModel(callback: (model: NpcModel) => void) {
    const npcModel = new NpcModel();
    CheckDependencies.check((canRun) => {
      if (canRun) {
        this.selectSpecies(npcModel, callback);
      }
    });
  }

  private static async selectSpecies(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesChooser.selectSpecies(
      model.speciesKey,
      model.subSpeciesKey,
      model.cityBorn,
      (key: string, value: string, subKey: string, cityBorn: string) => {
        if (model.speciesKey != null && model.speciesKey !== key) {
          model.speciesSkills = {
            major: [],
            minor: [],
          };
          model.speciesTalents = [];
        }
        model.speciesKey = key;
        model.speciesValue = value;
        model.subSpeciesKey = subKey;
        model.cityBorn = cityBorn;

        this.selectCareer(model, callback);
      }
    );
  }

  private static async selectCareer(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.careerChooser.selectCareer(
      model.selectedCareers?.map((c) => c.name ?? ''),
      model.speciesKey,
      model.subSpeciesKey,
      (careers: Item[]) => {
        model.selectedCareers = careers;

        this.selectSpeciesSkills(model, callback);
      },
      () => {
        this.selectSpecies(model, callback);
      }
    );
  }

  private static async selectSpeciesSkills(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesSkillsChooser.selectSpeciesSkills(
      model.speciesSkills.major,
      model.speciesSkills.minor,
      model.speciesKey,
      model.subSpeciesKey,
      (major: string[], minor: string[]) => {
        model.speciesSkills.major = major;
        model.speciesSkills.minor = minor;
        this.selectSpeciesTalents(model, callback);
      },
      () => {
        this.selectCareer(model, callback);
      }
    );
  }

  private static async selectSpeciesTalents(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesTalentsChooser.selectSpeciesTalents(
      model.speciesTalents,
      model.speciesTraits,
      model.speciesKey,
      model.subSpeciesKey,
      (talents: string[], traits: string[]) => {
        model.speciesTalents = talents;
        model.speciesTraits = traits;
        this.selectName(model, callback);
      },
      () => {
        this.selectSpeciesSkills(model, callback);
      }
    );
  }

  private static async selectName(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    if (model.name == null) {
      model.name = `${
        model.selectedCareers[model.selectedCareers.length - 1].name
      } ${model.speciesValue}`;
    }
    await this.nameChooser.selectName(
      model.name,
      model.speciesKey,
      true,
      (name: string) => {
        model.name = name;
        this.selectOptions(model, callback);
      },
      () => {
        this.selectSpeciesTalents(model, callback);
      }
    );
  }

  private static async selectOptions(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.optionsChooser.selectOptions(
      false,
      model.options,
      model.speciesKey,
      (options: Options) => {
        model.options = options;
        this.finalize(model, callback);
      },
      () => {
        this.selectName(model, callback);
      }
    );
  }

  private static async finalize(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await WaiterUtil.show(
      'WFRP4NPCGEN.npc.generation.inprogress.title',
      'WFRP4NPCGEN.npc.generation.inprogress.hint',
      async () => {
        console.info('Prepare Career Path');
        await this.addCareerPath(model);

        console.info('Prepare Status');
        await this.addStatus(model);

        console.info('Prepare Basic skills');
        await this.addBasicSkill(model);

        console.info('Prepare Native Tongue');
        await this.addNativeTongueSkill(model);

        console.info('Prepare City Born');
        await this.addCityBornSkill(model);

        console.info('Prepare Career Skills');
        await this.addCareerSkill(model);

        console.info('Prepare Species Skills');
        await this.addSpeciesSkill(model);

        console.info('Prepare Species Talents');
        await this.addSpeciesTalents(model);

        console.info('Prepare Career Talents');
        await this.addCareerTalents(model);

        console.info('Prepare Species Traits');
        await this.addSpeciesTraits(model);

        console.info('Prepare Basic Chars');
        await this.addBasicChars(model);

        console.info('Prepare Movement');
        await this.addMovement(model);

        console.info('Prepare Skills Advances');
        await this.addAdvanceSkills(model);

        console.info('Prepare Chars Advances');
        await this.addAdvanceChars(model);

        if (model.options.withClassTrappings) {
          console.info('Prepare Class Trappings');
          await this.prepareClassTrappings(model);
        }
        if (model.options.withCareerTrappings) {
          console.info('Prepare Career Trappings');
          await this.prepareCareerTrappings(model);
        }
        console.info('Prepare Trappings');
        await this.addTrappings(model);

        await this.editAbilities(model, callback);
      }
    );
  }

  private static async editAbilities(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    if (model.options.editAbilities) {
      await CompendiumUtil.getCompendiumActors();
      await WaiterUtil.hide(false);
      await this.abilitiesChooser.selectNpcAbilities(
        model.skills,
        model.talents,
        model.traits,
        async (skills, talents, traits) => {
          model.skills = skills;
          model.talents = talents;
          model.traits = traits;
          await this.editTrappings(model, callback);
        }
      );
    } else {
      await this.editTrappings(model, callback);
    }
  }

  private static async editTrappings(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    if (model.options.editTrappings) {
      const undo = model.options.editAbilities
        ? () => {
            this.editAbilities(model, callback);
          }
        : undefined;
      await WaiterUtil.hide(false);
      await this.trappingChooser.selectTrappings(
        model.trappings,
        async (trappings) => {
          model.trappings = trappings;
          await this.editMagics(model, callback);
        },
        undo
      );
    } else {
      await this.editMagics(model, callback);
    }
  }

  private static async editMagics(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    if (model.options.addMagics) {
      const undo = model.options.editTrappings
        ? () => {
            this.editTrappings(model, callback);
          }
        : undefined;
      await WaiterUtil.hide(false);
      await this.magicsChooser.selectMagics(
        model.spells,
        model.prayers,
        async (spells, prayers) => {
          model.spells = spells;
          model.prayers = prayers;
          await this.editMutations(model, callback);
        },
        undo
      );
    } else {
      await this.editMutations(model, callback);
    }
  }

  private static async editMutations(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    if (model.options.addMutations) {
      const undo = model.options.addMagics
        ? () => {
            this.editMagics(model, callback);
          }
        : model.options.editTrappings
        ? () => {
            this.editTrappings(model, callback);
          }
        : undefined;
      await WaiterUtil.hide(false);
      await this.mutationsChooser.selectMutations(
        model.physicalMutations,
        model.mentalMutations,
        async (physicals, mentals) => {
          await WaiterUtil.show(
            'WFRP4NPCGEN.npc.generation.inprogress.title',
            'WFRP4NPCGEN.npc.generation.inprogress.hint',
            async () => {
              model.physicalMutations = physicals;
              model.mentalMutations = mentals;
              callback(model);
            }
          );
        },
        undo
      );
    } else {
      await WaiterUtil.show(
        'WFRP4NPCGEN.npc.generation.inprogress.title',
        'WFRP4NPCGEN.npc.generation.inprogress.hint',
        async () => {
          callback(model);
        }
      );
    }
  }

  private static async addCareerPath(model: NpcModel) {
    const careers: Item[] = await this.referential.getCareerEntities();
    let career: ItemData;
    const lastCareer = model.selectedCareers[model.selectedCareers.length - 1];
    if (lastCareer?.data != null) {
      career = lastCareer.data;
    } else {
      career = (<Item>careers.find((c: Item) => c.id === lastCareer?.id))?.data;
    }
    model.career = career;

    const careerData: any = career?.data;
    if (model.selectedCareers.length > 1) {
      model.careerPath = [];
      for (let customCareerPath of model.selectedCareers) {
        if (customCareerPath?.data != null) {
          model.careerPath.push(customCareerPath?.data);
        } else {
          model.careerPath.push(
            (<Item>careers.find((c: Item) => c.id === customCareerPath?.id))
              ?.data
          );
        }
      }
    } else if (careerData?.careergroup?.value != null) {
      model.careerPath = careers
        .map((c: Item) => c.data)
        .filter((c: ItemData) => {
          const data: any = c?.data;
          const levelStr = data?.level?.value;
          const selectLevelStr = careerData?.level?.value;
          const level = levelStr != null ? Number(levelStr) : 0;
          const selectLevel =
            selectLevelStr != null ? Number(selectLevelStr) : 0;
          return (
            data?.careergroup?.value === careerData?.careergroup?.value &&
            level <= selectLevel
          );
        })
        .sort((a, b) => {
          const aData: any = a?.data;
          const bData: any = b?.data;
          const aLevelStr = aData?.level?.value;
          const bLevelStr = bData?.level?.value;
          const aLevel = aLevelStr != null ? Number(aLevelStr) : 0;
          const bLevel = bLevelStr != null ? Number(bLevelStr) : 0;
          return aLevel - bLevel;
        });
    } else {
      model.careerPath = [career];
    }
    model.careerPath.forEach((c, i) => {
      const data: any = c?.data;
      if (data?.current != null) {
        data.current.value = i === model.careerPath.length - 1;
      }
      if (data?.complete != null) {
        data.complete.value = true;
      }
    });

    const careerSkillsMap: { [group: string]: ItemData } = {};
    for (let career of model.careerPath) {
      const data: any = career.data;
      const level = data?.level?.value ?? 0;
      const group = data?.careergroup?.value ?? '';
      const careerSkill = careerSkillsMap[group];
      if (careerSkill == null) {
        careerSkillsMap[group] = career;
      } else {
        const csData: any = careerSkill.data;
        const csLevel = csData?.level?.value ?? 0;
        if (level > csLevel) {
          careerSkillsMap[group] = career;
        }
      }
    }
    model.careerForSkills.push(...Object.values(careerSkillsMap));
  }

  private static async addStatus(model: NpcModel) {
    const careerData: any = model.career?.data;
    if (careerData?.status != null) {
      const statusTiers = this.referential.getStatusTiers();
      const standing = careerData.status.standing;
      const tier = statusTiers[careerData.status.tier];
      model.status = `${tier} ${standing}`;
    }
  }

  private static async addBasicSkill(model: NpcModel) {
    model.skills = await this.referential.getAllBasicSkills();
  }

  private static async addCareerSkill(model: NpcModel) {
    for (let career of model.careerForSkills) {
      const data: any = career?.data;
      await this.addSkills(model, data?.skills);
    }
  }

  private static async addSpeciesSkill(model: NpcModel) {
    const speciesSkill = model.speciesSkills.major.concat(
      model.speciesSkills.minor
    );
    await this.addSkills(model, speciesSkill);
  }

  private static async addNativeTongueSkill(model: NpcModel) {
    await this.addSkill(
      model,
      i18n().localize(`WFRP4NPCGEN.native.tongue.${model.speciesKey}`)
    );
  }

  private static async addCityBornSkill(model: NpcModel) {
    const loreSkill = await ReferentialUtil.findSkill('Lore');
    if (
      model.cityBorn != null &&
      model.cityBorn.length > 0 &&
      loreSkill != null
    ) {
      await this.addSkill(
        model,
        `${StringUtil.getSimpleName(loreSkill.name)} (${model.cityBorn})`
      );
    }
  }

  private static async addSkills(model: NpcModel, names: string[]) {
    if (names == null || names.length === 0) {
      return;
    }
    for (let name of names) {
      await this.addSkill(model, name);
    }
  }

  private static async addSkill(model: NpcModel, name: string) {
    if (name == null || name.length === 0) {
      return;
    }
    try {
      const skillToAdd = await this.referential.findSkill(name);
      if (
        !StringUtil.arrayIncludesDeburrIgnoreCase(
          model.skills.map((ms) => ms.name),
          skillToAdd.name
        ) ||
        (skillToAdd.name.includes('(') &&
          StringUtil.includesDeburrIgnoreCase(
            skillToAdd.name,
            i18n().localize('WFRP4NPCGEN.item.any')
          ))
      ) {
        model.skills.push(skillToAdd);
      }
    } catch (e) {
      console.warn('Cant find Skill : ' + name);
    }
  }

  private static async addCareerTalents(model: NpcModel) {
    for (let career of model.careerPath) {
      const data: any = career?.data;
      await this.addTalents(model, data?.talents);
    }
  }

  private static async addSpeciesTalents(model: NpcModel) {
    const traitPrefix = i18n().localize('Trait');
    const speciesTalentsMap = this.referential.getSpeciesTalentsMap();
    const speciesTalent: string[] = speciesTalentsMap[model.speciesKey].filter(
      (talent: string, index) =>
        index !== speciesTalentsMap[model.speciesKey].length - 1 &&
        !(talent.startsWith(traitPrefix) && talent.includes('-')) &&
        !talent.includes(',')
    );
    await this.addTalents(model, speciesTalent);
    await this.addTalents(model, model.speciesTalents);
  }

  private static async addTalents(model: NpcModel, names: string[]) {
    if (names == null || names.length === 0) {
      return;
    }
    for (let name of names) {
      await this.addTalent(model, name);
    }
  }

  private static async addTalent(model: NpcModel, name: string) {
    if (name == null || name.length === 0) {
      return;
    }

    try {
      const talentToAdd = await this.referential.findTalent(name);
      if (
        !StringUtil.arrayIncludesDeburrIgnoreCase(
          model.talents.map((ms) => ms.name),
          talentToAdd.name
        )
      ) {
        model.talents.push(talentToAdd);
      }
    } catch (e) {
      console.warn('Cant find Talent : ' + name);
    }
  }

  private static async addSpeciesTraits(model: NpcModel) {
    const traitPrefix = i18n().localize('Trait');
    const speciesTalentsMap = this.referential.getSpeciesTalentsMap();
    const speciesTraits: string[] = speciesTalentsMap[model.speciesKey]
      .filter(
        (talent: string, index) =>
          index !== speciesTalentsMap[model.speciesKey].length - 1 &&
          talent.startsWith(traitPrefix) &&
          talent.includes('-') &&
          !talent.includes(',')
      )
      .map((trait) => trait.substr(trait.indexOf('-') + 1).trim());
    await this.addTraits(model, speciesTraits);
    await this.addTraits(
      model,
      model.speciesTraits.map((trait) =>
        trait.substr(trait.indexOf('-') + 1).trim()
      )
    );
  }

  private static async addTraits(model: NpcModel, names: string[]) {
    if (names == null || names.length === 0) {
      return;
    }
    for (let name of names) {
      await this.addTrait(model, name);
    }
  }

  private static async addTrait(model: NpcModel, name: string) {
    if (name == null || name.length === 0) {
      return;
    }

    try {
      const traitToAdd = await this.referential.findTrait(name);
      if (
        !StringUtil.arrayIncludesDeburrIgnoreCase(
          model.traits.map((ms) => ms.name),
          traitToAdd.name
        )
      ) {
        model.traits.push(traitToAdd);
      }
    } catch (e) {
      console.warn('Cant find Trait : ' + name);
    }
  }

  private static async addBasicChars(model: NpcModel) {
    const averageChars = await this.referential.getSpeciesCharacteristics(
      model.speciesKey
    );
    Object.entries(averageChars).forEach(([key, char]) => {
      const positive = RandomUtil.getRandomBoolean();
      const amplitude = RandomUtil.getRandomPositiveNumber(6);
      const adjust =
        (positive ? 1 : -1) * RandomUtil.getRandomPositiveNumber(amplitude);
      model.chars[key] = {
        initial: (<any>char).value + adjust,
        advances: 0,
      };
    });
  }

  private static async addMovement(model: NpcModel) {
    model.move = await this.referential.getSpeciesMovement(model.speciesKey);
  }

  private static async addAdvanceSkills(model: NpcModel) {
    if (model.selectedCareers.length === 1) {
      const data: any = model.career?.data;
      data?.skills?.forEach((skill: string) => {
        const sk = model.skills.find(
          (s) => s.name === skill && (<any>s.data).advances.value === 0
        );
        if (sk != null) {
          (<any>sk.data).advances.value += model.careerPath.length * 5;
        }
      });
    } else {
      for (let career of model.careerPath) {
        const data: any = career?.data;
        const level: number = Number(data.level?.value);
        const maxAdvance = level * 5;
        for (let skill of data?.skills) {
          const sk = model.skills.find(
            (s) => s.name === skill && (<any>s.data).advances.value < maxAdvance
          );
          if (sk != null) {
            (<any>sk.data).advances.value = maxAdvance;
          }
        }
      }
    }

    model.speciesSkills.major.forEach((skill) => {
      const sk = model.skills.find((s) => s.name === skill);
      if (sk != null && (<any>sk.data).advances.value === 0) {
        (<any>sk.data).advances.value += 5;
      }
    });
    model.speciesSkills.minor.forEach((skill) => {
      const sk = model.skills.find((s) => s.name === skill);
      if (sk != null && (<any>sk.data).advances.value === 0) {
        (<any>sk.data).advances.value += 3;
      }
    });
  }

  private static async addAdvanceChars(model: NpcModel) {
    if (model.selectedCareers.length === 1) {
      const data: any = model.career?.data;
      data?.characteristics?.forEach((char: string) => {
        const ch = model.chars[char];
        if (ch != null) {
          ch.advances += model.careerPath.length * 5;
        }
      });
    } else {
      for (let career of model.careerPath) {
        const data: any = career?.data;
        const level: number = Number(data.level?.value);
        const maxAdvance = level * 5;
        for (let char of data?.characteristics) {
          const ch = model.chars[char];
          if (ch != null && ch.advances < maxAdvance) {
            ch.advances = maxAdvance;
          }
        }
      }
    }
  }

  public static async prepareClassTrappings(model: NpcModel) {
    const careerClasses: string[] = [];
    model.careerPath.forEach((cp) => {
      const careerClass = ReferentialUtil.getClassKeyFromCareer(cp);
      if (careerClass != null && !careerClasses.includes(careerClass)) {
        careerClasses.push(careerClass);
      }
    });
    const classTrappings = ReferentialUtil.getClassTrappings();
    careerClasses.forEach((cc) => {
      const tps = classTrappings[cc];
      if (tps != null) {
        tps
          .split(',')
          .map((t) => t.toLowerCase().trim())
          .forEach((t) => {
            if (!model.trappingsStr.includes(t)) {
              model.trappingsStr.push(t);
            }
          });
      }
    });
  }

  public static async prepareCareerTrappings(model: NpcModel) {
    for (let cp of model.careerPath) {
      for (let tr of (<string[]>(<any>cp.data).trappings).map((t: string) =>
        t.toLowerCase().trim()
      )) {
        if (!model.trappingsStr.includes(tr)) {
          model.trappingsStr.push(tr);
        }
      }
    }
  }

  public static async addTrappings(model: NpcModel) {
    const trappingCompendiums = await ReferentialUtil.getTrappingEntities(true);
    const trappingIds: string[] = [];
    const moneyItems = await ReferentialUtil.getAllMoneyItems();
    model.trappings.push(...moneyItems);
    for (let tr of model.trappingsStr) {
      const trappings = await ReferentialUtil.findTrappings(
        tr,
        trappingCompendiums
      );
      for (let trapping of trappings) {
        if (
          trapping != null &&
          !trappingIds.includes(trapping._id ?? '') &&
          trapping.type !== 'money'
        ) {
          trappingIds.push(trapping._id ?? '');
          model.trappings.push(trapping);
        }
      }
    }
  }
}
