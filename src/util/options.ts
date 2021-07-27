import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';
import { IOptions } from './options-int.js';
import { settings } from '../constant.js';

export default class Options implements IOptions {
  public withClassTrappings: boolean = settings.get(
    RegisterSettings.moduleName,
    'defaultWithClassTrappings'
  );
  public withCareerTrappings: boolean = settings.get(
    RegisterSettings.moduleName,
    'defaultWithCareerTrappings'
  );
  public generateMoneyEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    settings.get(RegisterSettings.moduleName, 'defaultGenerateMoneyEffect')
  );
  public generateWeaponEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    settings.get(RegisterSettings.moduleName, 'defaultGenerateWeaponEffect')
  );

  public withGenPathCareerName = settings.get(
    RegisterSettings.moduleName,
    'defaultWithGenPathCareerName'
  );

  public withLinkedToken = settings.get(
    RegisterSettings.moduleName,
    'defaultWithLinkedToken'
  );

  public withInitialMoney = settings.get(
    RegisterSettings.moduleName,
    'defaultWithInitialMoney'
  );

  public withInitialWeapons = settings.get(
    RegisterSettings.moduleName,
    'defaultWithInitialWeapons'
  );

  public genPath: string = settings.get(
    RegisterSettings.moduleName,
    'defaultGenPath'
  );

  public imagePath: string | null = null;

  public tokenPath: string | null = null;

  public editAbilities = settings.get(
    RegisterSettings.moduleName,
    'defaultEditAbilities'
  );

  public editTrappings = settings.get(
    RegisterSettings.moduleName,
    'defaultEditTrappings'
  );

  public addMagics = settings.get(
    RegisterSettings.moduleName,
    'defaultAddMagics'
  );

  public addMutations = settings.get(
    RegisterSettings.moduleName,
    'defaultAddMutations'
  );
}
