import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

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
  public speciesKey: string = 'none';

  public traits: ItemData[] = [];
  public talents: ItemData[] = [];
  public skills: ItemData[] = [];

  public excludedTraits: string[] = [];
}
