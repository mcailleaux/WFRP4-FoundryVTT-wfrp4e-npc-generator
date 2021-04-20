export default class NpcModel {
  public speciesKey: string;
  public speciesValue: string;
  public career: Item;
  public speciesSkills: { major: string[]; minor: string[] } = {
    major: [],
    minor: [],
  };
}
