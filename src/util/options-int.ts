import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';

export interface IOptions {
  withClassTrappings: boolean;
  withCareerTrappings: boolean;
  generateMoneyEffect: GenerateEffectOptionEnum;
  generateWeaponEffect: GenerateEffectOptionEnum;
  withGenPathCareerName: boolean;
  withLinkedToken: boolean;
  withInitialMoney: boolean;
  withInitialWeapons: boolean;
  genPath: string;
  imagePath: string | null;
  tokenPath: string | null;
  editAbilities: boolean;
  editTrappings: boolean;
  addMagics: boolean;
  addMutations: boolean;
}
