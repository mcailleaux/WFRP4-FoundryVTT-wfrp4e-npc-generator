import Options from './util/options.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export default class NpcModel {
  public speciesKey: string;
  public subSpeciesKey: string;
  public speciesValue: string;
  public cityBorn: string;
  public selectedCareers: Item[] = [];
  public career: ItemData;
  public status: string;
  public careerPath: ItemData[] = [];
  public careerForSkills: ItemData[] = [];
  public speciesSkills: { major: string[]; minor: string[] } = {
    major: [],
    minor: [],
  };
  public speciesTalents: string[] = [];
  public speciesTraits: string[] = [];
  public name: string;
  public skills: (ItemData & Record<string, unknown>)[] = [];
  public talents: (ItemData & Record<string, unknown>)[] = [];
  public traits: (ItemData & Record<string, unknown>)[] = [];
  public trappingsStr: string[] = [];
  public trappings: (ItemData & Record<string, unknown>)[] = [];
  public spells: (ItemData & Record<string, unknown>)[] = [];
  public prayers: (ItemData & Record<string, unknown>)[] = [];
  public physicalMutations: (ItemData & Record<string, unknown>)[] = [];
  public mentalMutations: (ItemData & Record<string, unknown>)[] = [];
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public actor: Actor;
  public options = new Options();
}
