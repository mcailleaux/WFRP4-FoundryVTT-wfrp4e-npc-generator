export default class CreatureTemplate {
  public creatureData: Actor.Data & any;
  public size: string;
  public swarm: Item.Data & any;
  public weapon: Item.Data & any;
  public ranged: Item.Data & any;
  public rangedRange: string;
  public rangedDamage: string;
  public armour: Item.Data & any;
  public armorValue: string;
}
