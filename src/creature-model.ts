import CreatureAbilities from './util/creature-abilities.js';
import CreatureTemplate from './util/creature-template.js';
import OptionsCreature from './util/options-creature.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export default class CreatureModel {
  public name: string;
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public creatureTemplate: CreatureTemplate = new CreatureTemplate();
  public abilities: CreatureAbilities = new CreatureAbilities();
  public trappings: (ItemData & Record<string, unknown>)[] = [];
  public spells: (ItemData & Record<string, unknown>)[] = [];
  public prayers: (ItemData & Record<string, unknown>)[] = [];
  public physicalMutations: (ItemData & Record<string, unknown>)[] = [];
  public mentalMutations: (ItemData & Record<string, unknown>)[] = [];
  public options = new OptionsCreature();
}
