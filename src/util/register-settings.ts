import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';
import GenerationProfilesForm from './generation-profiles-form.js';
import GenerationProfiles from './generation-profiles.js';

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

    game.settings.register(moduleName, 'defaultGenPath', {
      name: game.i18n.localize('WFRP4NPCGEN.settings.defaultGenPath.name'),
      hint: game.i18n.localize('WFRP4NPCGEN.settings.defaultGenPath.hint'),
      scope: 'world',
      config: true,
      type: String,
      default: '',
    });

    game.settings.registerMenu(moduleName, 'generationProfilesForm', {
      name: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      label: game.i18n.localize(
        'WFRP4NPCGEN.settings.generationProfiles.label'
      ),
      hint: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.hint'),
      icon: 'fas fa-id-card',
      type: GenerationProfilesForm,
      restricted: true,
    });

    game.settings.register(moduleName, 'generationProfiles', {
      name: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      hint: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.hint'),
      default: new GenerationProfiles(),
      scope: 'world',
      type: Object,
      onChange: (_s: any) => {},
    });

    game.settings.register(moduleName, 'defaultWithGenPathCareerName', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithGenPathCareerName.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithGenPathCareerName.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultWithLinkedToken', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithLinkedToken.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithLinkedToken.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultWithInitialMoney', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialMoney.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialMoney.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultWithInitialWeapons', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialWeapons.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialWeapons.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultEditTrappings', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultEditTrappings.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultEditTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });
  }
}
