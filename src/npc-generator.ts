import SpeciesChooser from './util/species-chooser.js';
import NpcModel from './npc-model.js';
import CheckDependencies from './check-dependencies.js';
import CareerChooser from './util/career-chooser.js';

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;

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
    await this.speciesChooser.selectSpecies((key: string, value: string) => {
      model.speciesKey = key;
      model.speciesValue = value;

      this.selectCareer(model, callback);
    });
  }

  private static async selectCareer(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.careerChooser.selectCareer((career: Item) => {
      model.career = career;

      callback(model);
    });
  }
}
