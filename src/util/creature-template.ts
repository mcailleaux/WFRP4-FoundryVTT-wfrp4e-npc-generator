export default class CreatureTemplate {
  public creatureData: Actor.Data & any;
  public size: string;
  public isSwarm: boolean = false;
  public swarm: Item.Data & any;
  public weapon: Item.Data & any;
  public ranged: Item.Data & any;
  public weaponDamage: string;
  public rangedRange: string;
  public rangedDamage: string;
  public armour: Item.Data & any;
  public armourValue: string;
}
