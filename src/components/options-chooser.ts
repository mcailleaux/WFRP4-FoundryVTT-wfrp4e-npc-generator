import { AbstractChooser } from './abstract-chooser.js';
import { IOptions } from '../util/options-int.js';
import {
  GenerationProfile,
  GenerationSingleProfile,
} from '../util/generation-profiles.js';
import { i18n, settings } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import { SelectModel } from '../models/common/select-model.js';
import {
  GenerateEffectOptionEnum,
  getGenerateEffectOptionEnum,
} from '../util/generate-effect-option.enum.js';

class Model {
  public options: IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }
}

class EffectModel {
  public values: SelectModel[];
  public key: keyof IOptions;
  public label: string;

  constructor(values: SelectModel[], key: keyof IOptions, label: string) {
    this.values = values;
    this.key = key;
    this.label = label;
  }
}

export class OptionsChooser extends AbstractChooser<
  Model,
  {
    showProfiles: boolean;
    showClassTrapping: boolean;
    showCareerTrapping: boolean;
    showEditAbilities: boolean;
    showWeaponsEffect: boolean;
    showGenPath: boolean;
    showInitWeapons: boolean;
    optionsCheck: SelectModel[];
    effectsModel: EffectModel[];
  }
> {
  private callback: (options: IOptions) => void;
  private profiles: GenerationSingleProfile[];

  constructor(
    object: Model,
    forCreature: boolean,
    profiles: GenerationSingleProfile[],
    callback: (options: IOptions) => void,
    previousCallback: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);

    this.callback = callback;
    this.profiles = profiles ?? [];
    this.model.showProfiles = this.profiles.length > 0;
    this.model.showClassTrapping = !forCreature;
    this.model.showCareerTrapping = !forCreature;
    this.model.showEditAbilities = !forCreature;
    this.model.showWeaponsEffect = !forCreature;
    this.model.showGenPath = !forCreature;
    this.model.showInitWeapons = !forCreature;

    this.initOptionsCheck();
    this.initEffects();
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'options-chooser',
      title: i18n().localize('WFRP4NPCGEN.options.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/options-chooser.html`,
      width: 400,
    });
  }

  public static async selectOptions(
    forCreature: boolean,
    initOptions: IOptions,
    speciesKey: string,
    callback: (options: IOptions) => void,
    undo: () => void
  ) {
    const speciesProfiles: { [key: string]: any } = duplicate(
      settings().get(RegisterSettings.moduleName, 'generationProfiles')
    );
    let profiles: GenerationProfile | null = null;
    if (speciesProfiles != null && speciesProfiles[speciesKey] != null) {
      profiles = speciesProfiles[speciesKey];
    }

    new OptionsChooser(
      new Model(initOptions),
      forCreature,
      profiles?.profiles ?? [],
      callback,
      undo
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '.options-checkbox', (event) => {
      this.toggleOption(event.currentTarget.value);
      this.render();
    });
    this.handleChange(html, '.effect-select', (event) => {
      const key = event.currentTarget.getAttribute('data-id');
      this.toggleEffect(key, event.currentTarget.value);
      this.render();
    });
    this.handleInput(html, '#genPathInput', (event) => {
      this.model.data.options.genPath = event.currentTarget.value;
    });
    this.handleInput(html, '#imagePathInput', (event) => {
      this.model.data.options.imagePath = event.currentTarget.value;
    });
    this.handleInput(html, '#tokenPathInput', (event) => {
      this.model.data.options.tokenPath = event.currentTarget.value;
    });
    this.handleChange(html, '#imagePathInput', (event) => {
      this.model.data.options.imagePath = event.currentTarget.value;
    });
    this.handleChange(html, '#tokenPathInput', (event) => {
      this.model.data.options.tokenPath = event.currentTarget.value;
    });
  }

  protected isValid(_data: Model): boolean {
    return true;
  }

  protected yes(data: Model) {
    this.callback(data?.options);
  }

  private initOptionsCheck() {
    const initOptions = this.model.data.options;
    const optionsCheckKey: (keyof IOptions)[] = [];
    if (this.model.showClassTrapping) {
      optionsCheckKey.push('withClassTrappings');
    }
    if (this.model.showCareerTrapping) {
      optionsCheckKey.push('withCareerTrappings');
    }
    if (this.model.showEditAbilities) {
      optionsCheckKey.push('editAbilities');
    }
    optionsCheckKey.push('editTrappings');
    optionsCheckKey.push('addMagics');
    optionsCheckKey.push('addMutations');
    if (this.model.showGenPath) {
      optionsCheckKey.push('withGenPathCareerName');
    }
    optionsCheckKey.push('withLinkedToken');
    optionsCheckKey.push('withInitialMoney');
    if (this.model.showInitWeapons) {
      optionsCheckKey.push('withInitialWeapons');
    }
    this.model.optionsCheck = optionsCheckKey.map((key) => {
      return new SelectModel(
        key,
        `WFRP4NPCGEN.options.select.${key}.label`,
        initOptions[key] === true
      );
    });
  }

  private initEffects() {
    const initOptions = this.model.data.options;
    const options = [
      GenerateEffectOptionEnum.NONE,
      GenerateEffectOptionEnum.DEFAULT_DISABLED,
      GenerateEffectOptionEnum.DEFAULT_ENABLED,
    ];
    this.model.effectsModel = [];
    this.model.effectsModel.push(
      new EffectModel(
        options.map(
          (o) =>
            new SelectModel(
              o,
              `WFRP4NPCGEN.options.effects.${o}`,
              initOptions.generateMoneyEffect === o
            )
        ),
        'generateMoneyEffect',
        'WFRP4NPCGEN.trappings.money.label'
      )
    );
    this.model.effectsModel.push(
      new EffectModel(
        options.map(
          (o) =>
            new SelectModel(
              o,
              `WFRP4NPCGEN.options.effects.${o}`,
              initOptions.generateWeaponEffect === o
            )
        ),
        'generateWeaponEffect',
        'WFRP4NPCGEN.trappings.weapon.label'
      )
    );
  }

  private toggleOption(key: string) {
    const option = this.model.optionsCheck.find((oc) => oc.key === key);
    if (option != null) {
      option.selected = !option.selected;
      this.model.data.options[key] = option.selected;
    }
  }

  private toggleEffect(key: string, value: string) {
    const effect = this.model.effectsModel.find((ef) => ef.key === key);
    if (effect != null) {
      for (const effectModel of effect.values) {
        effectModel.selected = effectModel.key === value;
      }
      this.model.data.options[key] = getGenerateEffectOptionEnum(value);
    }
  }
}
