import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';

export default class Options {
  public withClassTrappings: boolean = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithClassTrappings'
  );
  public withCareerTrappings: boolean = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithCareerTrappings'
  );
  public generateMoneyEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    game.settings.get(RegisterSettings.moduleName, 'defaultGenerateMoneyEffect')
  );
  public generateWeaponEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    game.settings.get(
      RegisterSettings.moduleName,
      'defaultGenerateWeaponEffect'
    )
  );

  public withGenPathCareerName = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithGenPathCareerName'
  );

  public withLinkedToken = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithLinkedToken'
  );

  public withInitialMoney = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithInitialMoney'
  );

  public withInitialWeapons = game.settings.get(
    RegisterSettings.moduleName,
    'defaultWithInitialWeapons'
  );

  public genPath: string = game.settings.get(
    RegisterSettings.moduleName,
    'defaultGenPath'
  );

  public imagePath: string | null = null;

  public tokenPath: string | null = null;

  public editTrappings = game.settings.get(
    RegisterSettings.moduleName,
    'defaultEditTrappings'
  );
}
