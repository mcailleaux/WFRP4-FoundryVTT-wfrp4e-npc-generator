export default class NpcModel {
  public speciesKey: string;
  public speciesValue: string;
  public career: Item;
  public careerPath: Item[] = [];
  public speciesSkills: { major: string[]; minor: string[] } = {
    major: [],
    minor: [],
  };
  public speciesTalents: string[] = [];
  public name: string;
  public skills: {
    skill: Item.Data;
    adv: number;
  }[] = [];
  public chars: {
    char: string;
    base: number;
    adv: number;
  }[] = [];
  public move: string;
}
