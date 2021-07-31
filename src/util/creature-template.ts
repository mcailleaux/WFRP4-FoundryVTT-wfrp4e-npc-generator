import {
  ActorData,
  ItemData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';

export default class CreatureTemplate {
  public creatureData: ActorData & any;
  public size: string;
  public swarm: ItemData & any;
  public weapon: ItemData & any;
  public ranged: ItemData & any;
  public armour: ItemData & any;
  public isSwarm: boolean = false;
  public hasWeaponTrait: boolean = false;
  public hasArmourTrait: boolean = false;
  public weaponDamage: string;
  public rangedRange: string;
  public rangedDamage: string;
  public armourValue: string;
  public excludedTraits: string[] = [];
}
