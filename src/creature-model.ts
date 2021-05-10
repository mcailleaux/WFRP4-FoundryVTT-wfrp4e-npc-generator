import CreatureAbilities from './util/creature-abilities.js';
import CreatureTemplate from './util/creature-template.js';

export default class CreatureModel {
  public speciesValue: string;
  public name: string;
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public creatureTemplate: CreatureTemplate = new CreatureTemplate();
  public abilities: CreatureAbilities = new CreatureAbilities();
}
