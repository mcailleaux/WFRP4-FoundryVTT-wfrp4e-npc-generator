export default class NpcModel {
  public speciesKey: string;
  public speciesValue: string;
  public slectedCareer: Item;
  public career: Item.Data;
  public careerPath: Item.Data[] = [];
  public speciesSkills: { major: string[]; minor: string[] } = {
    major: [],
    minor: [],
  };
  public speciesTalents: string[] = [];
  public name: string;
  public skills: Item.Data[] = [];
  public talents: Item.Data[] = [];
  public chars: { [char: string]: { initial: number; advances: number } } = {};
  public move: string;
  public actor: Actor;
}
