import CreatureAbilities from './util/creature-abilities.js';

export default class CreatureModel {
  public speciesValue: string;
  public name: string;
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public creatureData: Actor.Data;
  public abilities: CreatureAbilities = new CreatureAbilities();
}
