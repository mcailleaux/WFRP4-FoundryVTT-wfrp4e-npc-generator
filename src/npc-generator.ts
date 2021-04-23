import SpeciesChooser from './util/species-chooser.js';
import NpcModel from './npc-model.js';
import CheckDependencies from './check-dependencies.js';
import CareerChooser from './util/career-chooser.js';
import SpeciesSkillsChooser from './util/species-skills-chooser.js';
import SpeciesTalentsChooser from './util/species-talents-chooser.js';
import NameChooser from './util/name-chooser.js';
import RandomUtil from './util/random-util.js';

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;
  public static readonly speciesSkillsChooser = SpeciesSkillsChooser;
  public static readonly speciesTalentsChooser = SpeciesTalentsChooser;
  public static readonly nameChooser = NameChooser;

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
      model.career?.name,
      (career: Item) => {
        model.career = career;

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
      model.name = `${model.career.name} ${model.speciesValue}`;
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
    await this.addBasicSkill(model);
    await this.addCareerSkill(model);
    await this.addSpeciesSkill(model);
    await this.addNativeTongueSkill(model);
    await this.addBasicChars(model);
    await this.addMovement(model);
    await this.addAdvanceSkills(model);
    await this.addAdvanceChars(model);
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
    let career: Item;
    if (model.career.data != null) {
      career = model.career;
    } else {
      career = <Item>careers.find((c: Item) => c.id === model.career._id);
    }
    model.career = career;

    const careerData: any = career?.data?.data;
    if (careerData?.careergroup?.value != null) {
      model.careerPath = careers
        .filter((c: Item) => {
          const data: any = c?.data?.data;
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
          const aData: any = a?.data?.data;
          const bData: any = b?.data?.data;
          const aLevelStr = aData?.level?.value;
          const bLevelStr = bData?.level?.value;
          const aLevel = aLevelStr != null ? Number(aLevelStr) : 0;
          const bLevel = bLevelStr != null ? Number(bLevelStr) : 0;
          return aLevel - bLevel;
        });
    } else {
      model.careerPath = [career];
    }
  }

  private static async addBasicSkill(model: NpcModel) {
    const skills: Item.Data[] = await game.wfrp4e.utility.allBasicSkills();
    model.skills = skills.map((itemData) => {
      return {
        skill: itemData,
        adv: 0,
      };
    });
  }

  private static async addCareerSkill(model: NpcModel) {
    const careerData: any = model.career?.data?.data;
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
    if (!model.skills.map((ms) => ms.skill.name).includes(name)) {
      const skillToAdd = await game.wfrp4e.utility.findSkill(name);
      model.skills.push({
        skill: skillToAdd.data,
        adv: 0,
      });
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
      model.chars.push({
        char: key,
        base: (<any>char).value + adjust,
        adv: 0,
      });
    });
  }

  private static async addMovement(model: NpcModel) {
    model.move = await game.wfrp4e.utility.speciesMovement(model.speciesKey);
  }

  private static async addAdvanceSkills(model: NpcModel) {
    model.careerPath.forEach((career: Item) => {
      const data: any = career?.data?.data;
      data?.skills?.forEach((skill: string) => {
        const sk = model.skills.find((s) => s.skill.name === skill);
        if (sk != null) {
          sk.adv += 5;
        }
      });
    });
    model.speciesSkills.major.forEach((skill) => {
      const sk = model.skills.find((s) => s.skill.name === skill);
      if (sk != null && sk.adv === 0) {
        sk.adv += 5;
      }
    });
    model.speciesSkills.minor.forEach((skill) => {
      const sk = model.skills.find((s) => s.skill.name === skill);
      if (sk != null && sk.adv === 0) {
        sk.adv += 3;
      }
    });
  }

  private static async addAdvanceChars(model: NpcModel) {
    console.dir(model);
  }
}
