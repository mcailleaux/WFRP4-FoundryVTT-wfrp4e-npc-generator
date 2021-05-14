import CreatureAbilities from './util/creature-abilities.js';
import CreatureTemplate from './util/creature-template.js';
import OptionsCreature from './util/options-creature.js';

export default class CreatureModel {
  public name: string;
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public creatureTemplate: CreatureTemplate = new CreatureTemplate();
  public abilities: CreatureAbilities = new CreatureAbilities();
  public trappings: Item.Data[] = [];
  public spells: Item.Data[] = [];
  public prayers: Item.Data[] = [];
  public physicalMutations: Item.Data[] = [];
  public mentalMutations: Item.Data[] = [];
  public options = new OptionsCreature();
}
