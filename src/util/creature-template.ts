export default class CreatureTemplate {
  public creatureData: Actor.Data & any;
  public size: string;
  public swarm: Item.Data & any;
  public weapon: Item.Data & any;
  public ranged: Item.Data & any;
  public armour: Item.Data & any;
  public isSwarm: boolean = false;
  public hasWeaponTrait: boolean = false;
  public hasArmourTrait: boolean = false;
  public weaponDamage: string;
  public rangedRange: string;
  public rangedDamage: string;
  public armourValue: string;
}
