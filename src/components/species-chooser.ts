import { AbstractChooser } from './abstract-chooser.js';
import { i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import ReferentialUtil from '../util/referential-util.js';
import RandomUtil from '../util/random-util.js';
import { SelectModel } from '../models/common/select-model.js';

class Model {
  public speciesKey: string | null;
  public subSpeciesKey: string | null;
  public cityBorn: string | null;

  constructor(speciesKey: string, subSpeciesKey: string, cityBorn: string) {
    this.speciesKey = speciesKey;
    this.subSpeciesKey = subSpeciesKey;
    this.cityBorn = cityBorn;
  }
}

export class SpeciesChooser extends AbstractChooser<
  Model,
  {
    species: SelectModel[];
    subSpecies: SelectModel[];
    showSubSpecies: boolean;
  }
> {
  private speciesKeys = Object.keys(ReferentialUtil.getSpeciesMap());
  private subSpeciesKeys: string[] = [];

  private callback: (
    speciesKey: string,
    subSpeciesKey: string | null,
    cityBorn: string | null
  ) => void;

  constructor(
    object: Model,
    callback: (
      speciesKey: string,
      subSpeciesKey: string | null,
      cityBorn: string | null
    ) => void,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, null, options);
    this.callback = callback;

    // Init species
    this.initSpecies(this.model.data?.speciesKey);

    // Init Sub species
    this.initSubSpecies(
      this.model.data?.speciesKey,
      this.model.data?.subSpeciesKey
    );
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'species-chooser',
      title: i18n().localize('WFRP4NPCGEN.species.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/species-chooser.html`,
      width: 400,
    });
  }

  public static async selectSpecies(
    initSpeciesKey: string,
    initSubSpeciesKey: string,
    initCityBorn: string,
    callback: (
      speciesKey: string,
      subSpeciesKey: string | null,
      cityBorn: string | null
    ) => void
  ) {
    new SpeciesChooser(
      new Model(initSpeciesKey, initSubSpeciesKey, initCityBorn),
      callback
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '#randomSpeciesButton', (_event) => {
      const randomSpeciesKey = RandomUtil.getRandomValue(this.speciesKeys);
      this.selectSpecies(randomSpeciesKey);
      this.render();
    });
    this.handleClick(html, '#randomSubSpeciesButtonContainer', (_event) => {
      const randomSubSpeciesKey = RandomUtil.getRandomValue(
        this.subSpeciesKeys.filter((key) => key !== 'none')
      );
      this.selectSubSpecies(randomSubSpeciesKey);
      this.render();
    });
    this.handleChange(html, '#speciesSelect', (event) => {
      this.selectSpecies(event.currentTarget.value);
      this.render();
    });
    this.handleChange(html, '#subSpeciesSelect', (event) => {
      this.selectSubSpecies(event.currentTarget.value);
      this.render();
    });
    this.handleChange(html, '#cityBornInput', (event) => {
      this.updateCityborn(event.currentTarget.value);
    });
  }

  protected isValid(data): boolean {
    return data?.speciesKey != null;
  }

  protected yes(data: Model) {
    this.callback(
      data?.speciesKey ?? 'human',
      data?.subSpeciesKey,
      data?.cityBorn
    );
  }

  private initSpecies(speciesKey) {
    const defaultSpeciesKey = speciesKey != null ? speciesKey : 'human';
    const species: SelectModel[] = [];
    const speciesMap = ReferentialUtil.getSpeciesMap();
    this.speciesKeys.forEach((key) => {
      species.push(
        new SelectModel(key, speciesMap[key], key === defaultSpeciesKey)
      );
    });
    this.model.species = species;
    this.model.data.speciesKey = defaultSpeciesKey;
  }

  private initSubSpecies(
    speciesKey: string | null,
    subSpeciesKey: string | null
  ) {
    const defaultSpeciesKey = speciesKey != null ? speciesKey : 'human';
    const initSubSpeciesMap = ReferentialUtil.getSpeciesSubSpeciesMap(
      defaultSpeciesKey
    );
    const initSubSpeciesLabelsMap: { [key: string]: string } =
      initSubSpeciesMap != null ? {} : {};
    if (initSubSpeciesMap != null && initSubSpeciesLabelsMap != null) {
      initSubSpeciesLabelsMap['none'] = '';
      for (let [key, value] of Object.entries(initSubSpeciesMap)) {
        initSubSpeciesLabelsMap[key] = value.name;
      }
    }
    const subSpecies: SelectModel[] = [];
    this.subSpeciesKeys = Object.keys(initSubSpeciesLabelsMap);
    this.subSpeciesKeys.forEach((key) => {
      subSpecies.push(
        new SelectModel(
          key,
          initSubSpeciesLabelsMap[key],
          key === subSpeciesKey
        )
      );
    });
    this.model.subSpecies = subSpecies;
    this.model.showSubSpecies = subSpecies.length > 0;
  }

  private selectSpecies(speciesKey: string) {
    this.model.species = this.model.species.map((spec) => {
      return new SelectModel(spec.key, spec.value, speciesKey === spec.key);
    });
    this.model.data.speciesKey = speciesKey;
    this.model.data.subSpeciesKey = null;
    this.initSubSpecies(speciesKey, null);
  }

  private selectSubSpecies(subSpeciesKey: string | null) {
    this.model.subSpecies = this.model.subSpecies.map((spec) => {
      return new SelectModel(spec.key, spec.value, subSpeciesKey === spec.key);
    });
    this.model.data.subSpeciesKey = subSpeciesKey;
  }

  private updateCityborn(cityBorn: string | null) {
    this.model.data.cityBorn = cityBorn;
  }
}
