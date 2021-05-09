export default class CreatureAbilities {
  public includeBasicSkills: boolean = false;
  public sizeKey: string = 'avg';
  public isSwarm: boolean = false;
  public hasWeaponTrait = false;
  public hasArmourTrait = false;

  public traits: Item.Data[] = [];
  public talents: Item.Data[] = [];
  public skills: Item.Data[] = [];
}
