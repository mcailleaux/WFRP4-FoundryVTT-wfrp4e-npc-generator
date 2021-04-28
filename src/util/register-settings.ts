import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';

export default class RegisterSettings {
  public static moduleName: string;

  public static initSettings() {
    const mainModule = 'wfrp4-wfrp4e-npc-generator';
    const betaModule = 'wfrp4e-npc-generator-beta';

    const mainModuleActive = game.modules.get(mainModule)?.active;
    const betaModuleActive = game.modules.get(betaModule)?.active;

    if (mainModuleActive) {
      this.moduleName = mainModule;
      this.registerSettings(mainModule);
    }
    if (betaModuleActive) {
      this.moduleName = betaModule;
      this.registerSettings(betaModule);
    }
  }

  private static registerSettings(moduleName: string) {
    game.settings.register(moduleName, 'defaultWithClassTrappings', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithClassTrappings.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithClassTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    });
    game.settings.register(moduleName, 'defaultWithCareerTrappings', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithCareerTrappings.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithCareerTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    });
    game.settings.register(moduleName, 'defaultGenerateMoneyEffect', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateMoneyEffect.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateMoneyEffect.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [GenerateEffectOptionEnum.NONE]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`
        ),
      },
      default: GenerateEffectOptionEnum.DEFAULT_ENABLED,
    });

    game.settings.register(moduleName, 'defaultGenerateWeaponEffect', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateWeaponEffect.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateWeaponEffect.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [GenerateEffectOptionEnum.NONE]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: game.i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`
        ),
      },
      default: GenerateEffectOptionEnum.DEFAULT_ENABLED,
    });
  }
}
