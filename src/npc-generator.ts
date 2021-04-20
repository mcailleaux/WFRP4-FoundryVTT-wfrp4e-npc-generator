import SpeciesChooser from './util/species-chooser';
import { NpcModel } from './npc-model';

export default class NpcGenerator {
  public static readonly speciesChooser = SpeciesChooser;

  public static async generateNpcModel(callback: (model: NpcModel) => void) {
    const npcModel = new NpcModel();
    await this.speciesChooser.selectSpecies((key: string, value: string) => {
      npcModel.speciesKey = key;
      npcModel.speciesValue = value;

      callback(npcModel);
    });
  }
}
