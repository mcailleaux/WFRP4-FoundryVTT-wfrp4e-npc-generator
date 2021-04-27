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

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;
  public static readonly speciesSkillsChooser = SpeciesSkillsChooser;
  public static readonly speciesTalentsChooser = SpeciesTalentsChooser;
  public static readonly nameChooser = NameChooser;
  public static readonly optionsChooser = OptionsChooser;
  public static readonly actorBuilder = ActorBuilder;
  public static readonly referential = ReferentialUtil;
  public static readonly trapping = TrappingUtil;
  public static readonly translateErrorDetect = TranslateErrorDetect;

  public static async generateNpc(
    callback?: (model: NpcModel, actorData: any, actor: any) => void
  ) {
    await this.generateNpcModel(async (model) => {
      const actorData = await ActorBuilder.buildActorData(model, 'npc');
      const actor = await ActorBuilder.createActor(model, actorData);
      ui.notifications.info(
        game.i18n.format('WFRP4NPCGEN.notification.actor.created', {
          name: actor.name,
        })
      );
      if (callback != null) {
        callback(model, actorData, actor);
      }
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
      (key: string, value: string) => {
        model.speciesKey = key;
        model.speciesValue = value;

        this.selectCareer(model, callback);
      }
    );
  }

  private static async selectCareer(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.careerChooser.selectCareer(
      model.selectedCareer?.name,
      model.speciesKey,
      (career: Item) => {
        model.selectedCareer = career;

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
      model.speciesKey,
      (talents: string[]) => {
        model.speciesTalents = talents;
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
      model.name = `${model.selectedCareer.name} ${model.speciesValue}`;
    }
    await this.nameChooser.selectName(
      model.name,
      model.speciesKey,
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
      model.options,
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
    await this.addCareerPath(model);
    await this.addStatus(model);
    await this.addBasicSkill(model);
    await this.addNativeTongueSkill(model);
    await this.addCareerSkill(model);
    await this.addSpeciesSkill(model);
    await this.addSpeciesTalents(model);
    await this.addCareerTalents(model);
    await this.addBasicChars(model);
    await this.addMovement(model);
    await this.addAdvanceSkills(model);
    await this.addAdvanceChars(model);
    if (model.options.withClassTrappings) {
      await this.prepareClassTrappings(model);
    }
    if (model.options.withCareerTrappings) {
      await this.prepareCareerTrappings(model);
    }
    if (model.trappingsStr.length > 0) {
      await this.addTrappings(model);
    }
    callback(model);
  }

  private static async addCareerPath(model: NpcModel) {
    const careers: Item[] = await this.referential.getCareerEntities();
    let career: Item.Data;
    if (model.selectedCareer.data != null) {
      career = model.selectedCareer.data;
    } else {
      career = (<Item>(
        careers.find((c: Item) => c.id === model.selectedCareer._id)
      ))?.data;
    }
    model.career = career;

    const careerData: any = career?.data;
    if (careerData?.careergroup?.value != null) {
      model.careerPath = careers
        .map((c: Item) => c.data)
        .filter((c: Item.Data) => {
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
    const careerData: any = model.career?.data;
    const careerSkills: string[] = careerData?.skills;
    await this.addSkills(model, careerSkills);
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
      game.i18n.localize(`WFRP4NPCGEN.native.tongue.${model.speciesKey}`)
    );
  }

  private static async addSkills(model: NpcModel, names: string[]) {
    if (names == null || names.length === 0) {
      return;
    }
    for (let i = 0; i < names.length; i++) {
      const skill = names[i];
      await this.addSkill(model, skill);
    }
  }

  private static async addSkill(model: NpcModel, name: string) {
    if (name == null || name.length === 0) {
      return;
    }
    if (
      !StringUtil.arrayIncludesDeburrIgnoreCase(
        model.skills.map((ms) => ms.name),
        name
      ) ||
      (name.includes('(') &&
        StringUtil.includesDeburrIgnoreCase(
          name,
          game.i18n.localize('WFRP4NPCGEN.item.any')
        ))
    ) {
      try {
        const skillToAdd = await this.referential.findSkill(name);
        delete (<any>skillToAdd.data)._id;
        (<any>skillToAdd.data).name = name;
        model.skills.push(skillToAdd.data);
      } catch (e) {
        console.warn('Cant find Skill : ' + name);
      }
    }
  }

  private static async addCareerTalents(model: NpcModel) {
    for (let i = 0; i < model.careerPath.length; i++) {
      const data: any = model.careerPath[i]?.data;
      await this.addTalents(model, data?.talents);
    }
  }

  private static async addSpeciesTalents(model: NpcModel) {
    const speciesTalentsMap = this.referential.getSpeciesTalentsMap();
    const speciesTalent: string[] = speciesTalentsMap[model.speciesKey].filter(
      (talent: string, index) =>
        index !== speciesTalentsMap[model.speciesKey].length - 1 &&
        !talent.includes(',')
    );
    await this.addTalents(model, speciesTalent);
    await this.addTalents(model, model.speciesTalents);
  }

  private static async addTalents(model: NpcModel, names: string[]) {
    if (names == null || names.length === 0) {
      return;
    }
    for (let i = 0; i < names.length; i++) {
      const talent = names[i];
      await this.addTalent(model, talent);
    }
  }

  private static async addTalent(model: NpcModel, name: string) {
    if (name == null || name.length === 0) {
      return;
    }
    if (
      !StringUtil.arrayIncludesDeburrIgnoreCase(
        model.talents.map((ms) => ms.name),
        name
      )
    ) {
      try {
        const talentToAdd = await this.referential.findTalent(name);
        delete (<any>talentToAdd.data)._id;
        (<any>talentToAdd.data).name = name;
        model.talents.push(talentToAdd.data);
      } catch (e) {
        console.warn('Cant find Talent : ' + name);
      }
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
    const data: any = model.career?.data;
    data?.skills?.forEach((skill: string) => {
      const sk = model.skills.find(
        (s) => s.name === skill && (<any>s.data).advances.value === 0
      );
      if (sk != null) {
        (<any>sk.data).advances.value += model.careerPath.length * 5;
      }
    });
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
    const data: any = model.career?.data;
    data?.characteristics?.forEach((char: string) => {
      const ch = model.chars[char];
      if (ch != null) {
        ch.advances += model.careerPath.length * 5;
      }
    });
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
    const trappings = await ReferentialUtil.getTrappingEntities(true);
    const trappingIds: string[] = [];
    for (let tr of model.trappingsStr) {
      const trapping = await ReferentialUtil.findTrapping(tr, trappings);
      if (
        trapping != null &&
        !trappingIds.includes(trapping._id) &&
        trapping.type !== 'money'
      ) {
        trappingIds.push(trapping._id);
        delete (<any>trapping)._id;
        trapping.name = tr;
        model.trappings.push(trapping);
      }
    }
  }
}
