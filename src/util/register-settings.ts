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

    game.settings.register(moduleName, 'defaultEditAbilities', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultEditAbilities.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultEditAbilities.hint'
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

    game.settings.register(moduleName, 'defaultAddMagics', {
      name: game.i18n.localize('WFRP4NPCGEN.settings.defaultAddMagics.name'),
      hint: game.i18n.localize('WFRP4NPCGEN.settings.defaultAddMagics.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultAddMutations', {
      name: game.i18n.localize('WFRP4NPCGEN.settings.defaultAddMutations.name'),
      hint: game.i18n.localize('WFRP4NPCGEN.settings.defaultAddMutations.hint'),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultCreatureGenerateMoneyEffect', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenerateMoneyEffect.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenerateMoneyEffect.hint'
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
      default: GenerateEffectOptionEnum.NONE,
    });

    game.settings.register(moduleName, 'defaultCreatureWithLinkedToken', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithLinkedToken.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithLinkedToken.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultCreatureWithInitialMoney', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithInitialMoney.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureWithInitialMoney.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultCreatureGenPath', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenPath.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureGenPath.hint'
      ),
      scope: 'world',
      config: true,
      type: String,
      default: '',
    });

    game.settings.register(moduleName, 'defaultCreatureEditTrappings', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureEditTrappings.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureEditTrappings.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultCreatureAddMagics', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMagics.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMagics.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(moduleName, 'defaultCreatureAddMutations', {
      name: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMutations.name'
      ),
      hint: game.i18n.localize(
        'WFRP4NPCGEN.settings.defaultCreatureAddMutations.hint'
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
    });
  }
}
