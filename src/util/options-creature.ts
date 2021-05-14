import { IOptions } from './options-int.js';
import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';

export default class OptionsCreature implements IOptions {
  public withClassTrappings: boolean = false;
  public withCareerTrappings: boolean = false;
  public generateMoneyEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    game.settings.get(
      RegisterSettings.moduleName,
      'defaultCreatureGenerateMoneyEffect'
    )
  );
  public generateWeaponEffect: GenerateEffectOptionEnum =
    GenerateEffectOptionEnum.NONE;

  public withGenPathCareerName = false;

  public withLinkedToken = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureWithLinkedToken'
  );

  public withInitialMoney = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureWithInitialMoney'
  );

  public withInitialWeapons = false;

  public genPath: string = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureGenPath'
  );

  public imagePath: string | null = null;

  public tokenPath: string | null = null;

  public editTrappings = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureEditTrappings'
  );

  public addMagics = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureAddMagics'
  );

  public addMutations = game.settings.get(
    RegisterSettings.moduleName,
    'defaultCreatureAddMutations'
  );
}
