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
  public skills: ItemData[] = [];
  public talents: ItemData[] = [];
  public traits: ItemData[] = [];
  public trappingsStr: string[] = [];
  public trappings: ItemData[] = [];
  public spells: ItemData[] = [];
  public prayers: ItemData[] = [];
  public physicalMutations: ItemData[] = [];
  public mentalMutations: ItemData[] = [];
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public actor: Actor;
  public options = new Options();
}
