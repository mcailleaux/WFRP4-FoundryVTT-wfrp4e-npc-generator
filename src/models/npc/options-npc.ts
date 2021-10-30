import { IOptions } from '../common/options-int.js';
import { settings } from '../../constant.js';
import RegisterSettings from '../../util/register-settings.js';
import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from '../../util/generate-effect-option.enum.js';

export class OptionsNpc implements IOptions {
  public withClassTrappings: boolean = settings().get(
    RegisterSettings.moduleName,
    'defaultWithClassTrappings'
  );
  public withCareerTrappings: boolean = settings().get(
    RegisterSettings.moduleName,
    'defaultWithCareerTrappings'
  );
  public generateMoneyEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    settings().get(RegisterSettings.moduleName, 'defaultGenerateMoneyEffect')
  );
  public generateWeaponEffect: GenerateEffectOptionEnum = getGenerateEffectOptionEnum(
    settings().get(RegisterSettings.moduleName, 'defaultGenerateWeaponEffect')
  );

  public withGenPathCareerName = settings().get(
    RegisterSettings.moduleName,
    'defaultWithGenPathCareerName'
  );

  public withLinkedToken = settings().get(
    RegisterSettings.moduleName,
    'defaultWithLinkedToken'
  );

  public withInitialMoney = settings().get(
    RegisterSettings.moduleName,
    'defaultWithInitialMoney'
  );

  public withInitialWeapons = settings().get(
    RegisterSettings.moduleName,
    'defaultWithInitialWeapons'
  );

  public genPath: string = settings().get(
    RegisterSettings.moduleName,
    'defaultGenPath'
  );

  public imagePath: string | null = null;

  public tokenPath: string | null = null;

  public editAbilities = settings().get(
    RegisterSettings.moduleName,
    'defaultEditAbilities'
  );

  public editTrappings = settings().get(
    RegisterSettings.moduleName,
    'defaultEditTrappings'
  );

  public addMagics = settings().get(
    RegisterSettings.moduleName,
    'defaultAddMagics'
  );

  public addMutations = settings().get(
    RegisterSettings.moduleName,
    'defaultAddMutations'
  );
}
