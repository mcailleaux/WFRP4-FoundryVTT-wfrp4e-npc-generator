import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';
import GenerationProfilesForm from './generation-profiles-form.js';
import GenerationProfiles from './generation-profiles.js';
import { i18n, modules, settings } from '../constant.js';

export default class RegisterSettings {
  public static moduleName: string;

  public static initSettings() {
    const mainModule = 'wfrp4-wfrp4e-npc-generator';
    const betaModule = 'wfrp4e-npc-generator-beta';

    const mainModuleActive = modules.get(mainModule)?.active;
    const betaModuleActive = modules.get(betaModule)?.active;

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
    settings.register(moduleName, 'defaultWithClassTrappings', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithClassTrappings.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithClassTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    });
    settings.register(moduleName, 'defaultWithCareerTrappings', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithCareerTrappings.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithCareerTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true,
    });
    settings.register(moduleName, 'defaultGenerateMoneyEffect', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateMoneyEffect.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateMoneyEffect.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [GenerateEffectOptionEnum.NONE]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`
        ),
      },
      default: GenerateEffectOptionEnum.DEFAULT_ENABLED,
    });

    settings.register(moduleName, 'defaultGenerateWeaponEffect', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateWeaponEffect.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultGenerateWeaponEffect.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [GenerateEffectOptionEnum.NONE]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`
        ),
      },
      default: GenerateEffectOptionEnum.DEFAULT_ENABLED,
    });

    settings.register(moduleName, 'defaultGenPath', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultGenPath.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultGenPath.hint'),
      scope: 'world',
      config: true,
      type: String,
      default: '',
    });

    settings.registerMenu(moduleName, 'generationProfilesForm', {
      name: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      label: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.label'),
      hint: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.hint'),
      icon: 'fas fa-id-card',
      type: GenerationProfilesForm,
      restricted: true,
    });

    settings.register(moduleName, 'generationProfiles', {
      name: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.hint'),
      default: new GenerationProfiles(),
      scope: 'world',
      type: Object,
      onChange: (_s: any) => {},
    });

    settings.register(moduleName, 'defaultWithGenPathCareerName', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithGenPathCareerName.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithGenPathCareerName.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultWithLinkedToken', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultWithLinkedToken.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultWithLinkedToken.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultWithInitialMoney', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultWithInitialMoney.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultWithInitialMoney.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultWithInitialWeapons', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialWeapons.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultWithInitialWeapons.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultEditAbilities', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultEditAbilities.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultEditAbilities.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultEditTrappings', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultEditTrappings.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultEditTrappings.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultAddMagics', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultAddMagics.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultAddMagics.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultAddMutations', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultAddMutations.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultAddMutations.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultCreatureGenerateMoneyEffect', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenerateMoneyEffect.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenerateMoneyEffect.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [GenerateEffectOptionEnum.NONE]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`
        ),
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: i18n.localize(
          `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`
        ),
      },
      default: GenerateEffectOptionEnum.NONE,
    });

    settings.register(moduleName, 'defaultCreatureWithLinkedToken', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithLinkedToken.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithLinkedToken.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultCreatureWithInitialMoney', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithInitialMoney.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithInitialMoney.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultCreatureGenPath', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultCreatureGenPath.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultCreatureGenPath.hint'),
      scope: 'world',
      config: true,
      type: String,
      default: '',
    });

    settings.register(moduleName, 'defaultCreatureEditTrappings', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureEditTrappings.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureEditTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultCreatureAddMagics', {
      name: i18n.localize('WFRP4NPCGEN.settings.defaultCreatureAddMagics.name'),
      hint: i18n.localize('WFRP4NPCGEN.settings.defaultCreatureAddMagics.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    settings.register(moduleName, 'defaultCreatureAddMutations', {
      name: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMutations.name'
      ),
      hint: i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMutations.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });
  }
}
