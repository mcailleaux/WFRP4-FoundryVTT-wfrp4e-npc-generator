import { ActorModel } from '../common/actor-model.js';
import { SpeciesSkills } from './species-skills.js';

export class NpcModel extends ActorModel {
  public speciesKey: string;
  public subSpeciesKey: string;
  public cityBorn: string;
  public careers: string[] = [];
  public speciesSkills: SpeciesSkills = new SpeciesSkills();
}
