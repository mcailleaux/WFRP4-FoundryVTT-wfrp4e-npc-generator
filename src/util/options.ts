import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';
import { IOptions } from './options-int.js';

export default class Options implements IOptions {
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

  public editAbilities = game.settings.get(
    RegisterSettings.moduleName,
    'defaultEditAbilities'
  );

  public editTrappings = game.settings.get(
    RegisterSettings.moduleName,
    'defaultEditTrappings'
  );

  public addMagics = game.settings.get(
    RegisterSettings.moduleName,
    'defaultAddMagics'
  );

  public addMutations = game.settings.get(
    RegisterSettings.moduleName,
    'defaultAddMutations'
  );
}
