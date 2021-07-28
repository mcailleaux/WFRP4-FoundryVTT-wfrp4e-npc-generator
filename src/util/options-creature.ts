import { IOptions } from './options-int.js';
import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';
import { settings } from '../constant.js';

export default class OptionsCreature implements IOptions {
  public withClassTrappings: boolean = false;
  public withCareerTrappings: boolean = false;
  public generateMoneyEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    settings().get(
      RegisterSettings.moduleName,
      'defaultCreatureGenerateMoneyEffect'
    )
  );
  public generateWeaponEffect: GenerateEffectOptionEnum =
    GenerateEffectOptionEnum.NONE;

  public withGenPathCareerName = false;

  public withLinkedToken = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureWithLinkedToken'
  );

  public withInitialMoney = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureWithInitialMoney'
  );

  public withInitialWeapons = false;

  public genPath: string = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureGenPath'
  );

  public imagePath: string | null = null;

  public tokenPath: string | null = null;

  public editAbilities: boolean = false;

  public editTrappings = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureEditTrappings'
  );

  public addMagics = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureAddMagics'
  );

  public addMutations = settings().get(
    RegisterSettings.moduleName,
    'defaultCreatureAddMutations'
  );
}
