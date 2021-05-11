export default class CreatureAbilities {
  public includeBasicSkills: boolean = false;
  public sizeKey: string = 'avg';
  public isSwarm: boolean = false;
  public hasWeaponTrait = false;
  public hasRangedTrait = false;
  public hasArmourTrait = false;
  public rangedRange: string;
  public rangedDamage: string;
  public armourValue: string;

  public traits: Item.Data[] = [];
  public talents: Item.Data[] = [];
  public skills: Item.Data[] = [];
}
