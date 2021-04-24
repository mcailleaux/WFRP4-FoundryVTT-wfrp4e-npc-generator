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

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;
  public static readonly speciesSkillsChooser = SpeciesSkillsChooser;
  public static readonly speciesTalentsChooser = SpeciesTalentsChooser;
  public static readonly nameChooser = NameChooser;
  public static readonly actorBuilder = ActorBuilder;

  public static async generateNpc(
    callback: (model: NpcModel, actorData: any, actor: any) => void
  ) {
    this.generateNpcModel(async (model) => {
      const actorData = await ActorBuilder.buildActorData(model, 'npc');
      const actor = await Actor.create(actorData);
      callback(model, actorData, actor);
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
        this.finalize(model, callback);
      },
      () => {
        this.selectSpeciesTalents(model, callback);
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
    await this.addCareerSkill(model);
    await this.addSpeciesSkill(model);
    await this.addNativeTongueSkill(model);
    await this.addSpeciesTalents(model);
    await this.addCareerTalents(model);
    await this.addBasicChars(model);
    await this.addMovement(model);
    await this.addAdvanceSkills(model);
    await this.addAdvanceChars(model);
    await this.addEffects(model);
    callback(model);
  }

  private static async addCareerPath(model: NpcModel) {
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getContent();
    const worldCareers = game.items?.entities?.filter(
      (item) => item.type === 'career'
    );
    if (worldCareers != null && worldCareers.length > 0) {
      careers.push(...worldCareers);
    }
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
      const statusTiers = game.wfrp4e.config.statusTiers;
      const standing = careerData.status.standing;
      const tier = statusTiers[careerData.status.tier];
      model.status = `${tier} ${standing}`;
    }
  }

  private static async addBasicSkill(model: NpcModel) {
    model.skills = await game.wfrp4e.utility.allBasicSkills();
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
      !StringUtil.arrayIncludesLocalEnIgnoreCase(
        model.skills.map((ms) => ms.name),
        name
      ) ||
      (name.includes('(') &&
        StringUtil.includesLocalEnIgnoreCase(
          name,
          game.i18n.localize('WFRP4NPCGEN.item.any')
        ))
    ) {
      const skillToAdd = await game.wfrp4e.utility.findSkill(name);
      model.skills.push(skillToAdd.data);
    }
  }

  private static async addCareerTalents(model: NpcModel) {
    for (let i = 0; i < model.careerPath.length; i++) {
      const data: any = model.careerPath[i]?.data;
      await this.addTalents(model, data?.talents);
    }
  }

  private static async addSpeciesTalents(model: NpcModel) {
    const speciesTalentsMap = this.speciesTalentsChooser.getSpeciesTalentsMap();
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
      !StringUtil.arrayIncludesLocalEnIgnoreCase(
        model.talents.map((ms) => ms.name),
        name
      )
    ) {
      const talentToAdd = await game.wfrp4e.utility.findTalent(name);
      model.talents.push(talentToAdd.data);
    }
  }

  private static async addBasicChars(model: NpcModel) {
    const averageChars = await game.wfrp4e.utility.speciesCharacteristics(
      model.speciesKey,
      true
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
    model.move = await game.wfrp4e.utility.speciesMovement(model.speciesKey);
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

  private static async addEffects(model: NpcModel) {
    model.talents.forEach((talent) => {
      model.effects.push(
        ...(<any>talent).effects.map((eff: any) => {
          eff.sourcename = talent.name;
          return eff;
        })
      );
    });
  }
}
