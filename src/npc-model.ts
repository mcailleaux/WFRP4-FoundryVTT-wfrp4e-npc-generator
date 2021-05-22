import Options from './util/options.js';

export default class NpcModel {
  public speciesKey: string;
  public subSpeciesKey: string;
  public speciesValue: string;
  public cityBorn: string;
  public selectedCareers: Item[] = [];
  public career: Item.Data;
  public status: string;
  public careerPath: Item.Data[] = [];
  public careerForSkills: Item.Data[] = [];
  public speciesSkills: { major: string[]; minor: string[] } = {
    major: [],
    minor: [],
  };
  public speciesTalents: string[] = [];
  public name: string;
  public skills: Item.Data[] = [];
  public talents: Item.Data[] = [];
  public traits: Item.Data[] = [];
  public trappingsStr: string[] = [];
  public trappings: Item.Data[] = [];
  public spells: Item.Data[] = [];
  public prayers: Item.Data[] = [];
  public physicalMutations: Item.Data[] = [];
  public mentalMutations: Item.Data[] = [];
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public actor: Actor;
  public options = new Options();
}
