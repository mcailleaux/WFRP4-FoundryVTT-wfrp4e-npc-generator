export default class CreatureAbilities {
  public includeBasicSkills: boolean = false;
  public sizeKey: string = 'avg';
  public isSwarm: boolean = false;
  public hasWeaponTrait: boolean = false;
  public hasRangedTrait: boolean = false;
  public hasArmourTrait: boolean = false;
  public weaponDamage: string;
  public rangedRange: string;
  public rangedDamage: string;
  public armourValue: string;

  public traits: Item.Data[] = [];
  public talents: Item.Data[] = [];
  public skills: Item.Data[] = [];
}
