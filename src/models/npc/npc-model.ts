import { ActorModel } from '../common/actor-model.js';

export class NpcModel extends ActorModel {
  public speciesKey: string;
  public subSpeciesKey: string;
  public cityBorn: string;
}
