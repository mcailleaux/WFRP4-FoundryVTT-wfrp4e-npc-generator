import SpeciesChooser from './util/species-chooser.js';
import NpcModel from './npc-model.js';
import CheckDependencies from './check-dependencies.js';
import CareerChooser from './util/career-chooser.js';
import SpeciesSkillsChooser from './util/species-skills-chooser.js';
import SpeciesTalentsChooser from './util/species-talents-chooser.js';
import NameChooser from './util/name-chooser.js';

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
    await this.addBasicSkill(model);
    await this.addBasicCaracs(model);
    await this.addMovement(model);
    await this.addAdvanceSkills(model);
    await this.addAdvanceCaracs(model);
    callback(model);
  }

  private static async addCareerPath(model: NpcModel) {
    let careers: Item[];
    let career: Item;
    if (model.career.data != null) {
      careers = game.items.entities.filter((item) => item.type === 'career');
      career = model.career;
    } else {
      const careersPack = game.packs.get('wfrp4e-core.careers');
      careers = await careersPack.getContent();
      career = <Item>careers.find((c: Item) => c.id === model.career._id);
      console.dir(careers);
    }

    const careerData: any = career?.data?.data;
    if (careerData?.careergroup?.value != null) {
      model.careerPath = careers
        .filter((c: Item) => {
          const data: any = c?.data?.data;
          return data?.careergroup?.value === careerData?.careergroup?.value;
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

    console.dir(model);
  }

  private static async addBasicSkill(model: NpcModel) {
    console.dir(model);
  }

  private static async addCareerSkill(model: NpcModel) {
    console.dir(model);
  }

  private static async addBasicCaracs(model: NpcModel) {
    console.dir(model);
  }

  private static async addMovement(model: NpcModel) {
    console.dir(model);
  }

  private static async addAdvanceSkills(model: NpcModel) {
    console.dir(model);
  }

  private static async addAdvanceCaracs(model: NpcModel) {
    console.dir(model);
  }
}
