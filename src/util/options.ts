import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';

export default class Options {
  public withClassTrappings = true;
  public withCareerTrappings = true;
  public generateMoneyEffect: GenerateEffectOptionEnum =
    GenerateEffectOptionEnum.DEFAULT_ENABLED;
  public generateWeaponEffect: GenerateEffectOptionEnum =
    GenerateEffectOptionEnum.DEFAULT_ENABLED;
}
