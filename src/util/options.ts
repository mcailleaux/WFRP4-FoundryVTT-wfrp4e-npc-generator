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

  public defaultGenPath: string = game.settings.get(
    RegisterSettings.moduleName,
    'defaultGenPath'
  );

  public profiles: {
    [species: string]: {
      [name: string]: {
        genPath?: string;
        imagePath?: string;
        tokenPath?: string;
      };
    };
  };
}
