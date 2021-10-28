import { AbstractChooser } from './abstract-chooser.js';
import { SelectModel } from '../models/common/select-model.js';
import { i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import ReferentialUtil from '../util/referential-util.js';
import RandomUtil from '../util/random-util.js';
import {
  origin,
  originNames,
  randomTalent,
} from '../referential/species-referential.js';

class Model {
  public others: string[];
  public randomTalents: string[];
  public originKey: string | null;
  public origin: string[];

  constructor(
    others: string[],
    randomTalents: string[],
    originKey: string,
    origin: string[]
  ) {
    this.others = others;
    this.randomTalents = randomTalents;
    this.originKey = originKey;
    this.origin = origin;
  }
}

class ReferentialOthersModel {
  public model: ReferentialOtherModel[] = [];
}

class ReferentialOtherModel {
  public model: string[] = [];
}

class OthersModel {
  public model: OtherModel[] = [];
}

class OtherModel {
  public id = RandomUtil.getRandomId();
  public model: SelectModel[] = [];
}

export class SpeciesOthersChooser extends AbstractChooser<
  Model,
  {
    showOrigin: boolean;
    showOriginOthers: boolean;
    originLabel: string;
    selectedOriginKey: string | null;
    origins: SelectModel[];
    others: OthersModel;
    origin: OthersModel | null;
    randomTalents: SelectModel[];
    showRandomTalent: boolean;
    randomTalentsNbr: number;
    selectedRandomTalentsNbr: number;
    selectableRandomTalentsNbr: number;
  }
> {
  private others: ReferentialOthersModel;
  private randomTalents: string[];
  private baseRandomTalentsNbr: number;
  private oldestSelectedRandomTalents: string[] = [];
  private origins: { [origin: string]: ReferentialOthersModel };
  private randomOriginsTalentsNbr: { [origin: string]: number };

  private callback: (
    others: string[],
    randomTalents: string[],
    originKey: string | null,
    origin: string[]
  ) => void;

  constructor(
    object: Model,
    others: ReferentialOthersModel,
    randomTalents: string[],
    baseRandomTalentsNbr: number,
    randomTalentsNbr: number,
    origins: { [origin: string]: ReferentialOthersModel },
    randomOriginsTalentsNbr: { [origin: string]: number },
    originKey: string,
    originLabel: string,
    callback: (
      others: string[],
      randomTalents: string[],
      originKey: string,
      origin: string[]
    ) => void,
    previousCallback: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);

    this.others = others;
    this.randomTalents = randomTalents;
    this.baseRandomTalentsNbr = baseRandomTalentsNbr;
    this.model.randomTalentsNbr = randomTalentsNbr;
    this.origins = origins;
    this.randomOriginsTalentsNbr = randomOriginsTalentsNbr;
    this.model.selectedOriginKey = originKey ?? Object.keys(origins)[0] ?? null;
    this.model.originLabel = originLabel;
    this.callback = callback;

    // Init
    this.initModelFromData();
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'species-others-chooser',
      title: i18n().localize('WFRP4NPCGEN.species.talents.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/species-others-chooser.html`,
      width: 800,
    });
  }

  public static async selectSpeciesOthers(
    initOthers: string[],
    initRandomTalents: string[],
    initOriginKey: string,
    initOrigin: string[],
    speciesKey: string,
    subSpeciesKey: string,
    callback: (
      others: string[],
      randomTalents: string[],
      originKey: string,
      origin: string[]
    ) => void,
    undo: () => void
  ) {
    const refOthers =
      subSpeciesKey != null
        ? await ReferentialUtil.getSubSpeciesOthers(
            speciesKey,
            subSpeciesKey,
            true
          )
        : await ReferentialUtil.getSpeciesOthers(speciesKey, true);
    const others = this.refOthersToModel(refOthers);
    const baseRandomTalentsNbr =
      refOthers.find((ro) => typeof ro === 'number') ?? 0;
    let rdmTalNbr = baseRandomTalentsNbr;
    for (const other of initOthers.filter((t) => t.startsWith(randomTalent))) {
      rdmTalNbr += ReferentialUtil.resolveRandomPrefix(other);
    }
    const refOrigins =
      subSpeciesKey != null
        ? await ReferentialUtil.getSubSpeciesOrigins(
            speciesKey,
            subSpeciesKey,
            true
          )
        : await ReferentialUtil.getSpeciesOrigins(speciesKey, true);
    const origins = {};
    const rdmOriTalNbr: { [key: string]: number } = {};
    for (let origin of Object.keys(refOrigins)) {
      origins[origin] = this.refOthersToModel(refOrigins[origin]);
      rdmOriTalNbr[origin] =
        refOrigins[origin]?.find((ro) => typeof ro === 'number') ?? 0;
    }
    const originLabel =
      subSpeciesKey != null
        ? i18n().localize(
            `WFRP4NPCGEN.origin.${speciesKey}.${subSpeciesKey}.label`
          )
        : i18n().localize(`WFRP4NPCGEN.origin.${speciesKey}.label`);
    const randomTalents = await ReferentialUtil.getRandomTalents();

    if (initOriginKey != null) {
      rdmTalNbr += rdmOriTalNbr[initOriginKey] ?? 0;
    }

    new SpeciesOthersChooser(
      new Model(
        initOthers ?? [],
        initRandomTalents ?? [],
        initOriginKey,
        initOrigin ?? []
      ),
      others,
      randomTalents,
      baseRandomTalentsNbr,
      rdmTalNbr,
      origins,
      rdmOriTalNbr,
      initOriginKey,
      originLabel,
      callback,
      undo
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '#randomSpeciesOthersButton', (_event) => {
      this.randomOthers();
      this.render();
    });
    this.handleClick(html, '.species-other-radio', (event) => {
      const id = event.currentTarget.getAttribute('data-id');
      this.selectOther(id, event.currentTarget.value);
      this.render();
    });
    this.handleClick(html, '#randomOrigin', (_event) => {
      const randomOriginKey = RandomUtil.getRandomValue(
        Object.keys(this.origins)
      );
      this.selectOriginKey(randomOriginKey);
      this.render();
    });
    this.handleClick(html, '#originSelect', (event) => {
      const originKey = event.currentTarget.value;
      this.selectOriginKey(originKey);
      this.render();
    });
    this.handleClick(html, '#randomRandomTalentsButton', (_event) => {
      this.randomRandomTalents();
      this.render();
    });
    this.handleClick(html, '.random-talent-checkbox', (event) => {
      this.toggleRandomTalent(event.currentTarget.value);
      this.render();
    });
    this.handleClick(html, '#randomSpeciesOriginOthersButton', (_event) => {
      this.randomOriginOthers();
      this.render();
    });
    this.handleClick(html, '.species-origin-other-radio', (event) => {
      const id = event.currentTarget.getAttribute('data-id');
      this.selectOriginOther(id, event.currentTarget.value);
      this.render();
    });
  }

  protected isValid(data: Model): boolean {
    const singleOriginNotSelected = this.model.others.model.find(
      (om) => om.model.length === 1 && !om.model[0].selected
    );
    const offsetResult = singleOriginNotSelected ? 1 : 0;
    const othersValid =
      data.others.length + offsetResult === this.model.others.model.length;
    const randomTalentsValid =
      this.model.randomTalentsNbr === this.model.data.randomTalents.length;
    const originValid =
      data.originKey == null ||
      data.origin.length === this.model.origin?.model.length;
    return othersValid && randomTalentsValid && originValid;
  }

  protected yes(data: Model) {
    this.callback(
      data?.others ?? [],
      data.randomTalents ?? [],
      data.originKey,
      data.origin
    );
  }

  private randomOthers() {
    for (let modelOther of this.model.others.model) {
      const keys = modelOther.model.map((mo) => mo.key);
      const randomKey = RandomUtil.getRandomValue(keys);
      for (let selectModel of modelOther.model) {
        selectModel.selected = randomKey === selectModel.key;
      }
    }
    this.updateOrigins(false);
    this.updateRandomNumber();
    this.updateDataFromModel();
  }

  private randomOriginOthers() {
    for (let modelOther of this.model.origin?.model ?? []) {
      const keys = modelOther.model.map((mo) => mo.key);
      const randomKey = RandomUtil.getRandomValue(keys);
      for (let selectModel of modelOther.model) {
        selectModel.selected = randomKey === selectModel.key;
      }
    }
    this.updateOrigins(false);
    this.updateRandomNumber();
    this.updateDataFromModel();
  }

  private randomRandomTalents() {
    const randomTalents = RandomUtil.getRandomValues(
      this.randomTalents,
      this.model.randomTalentsNbr
    );
    for (let rdmTalent of this.model.randomTalents) {
      rdmTalent.selected = randomTalents.includes(rdmTalent.key);
    }
    this.oldestSelectedRandomTalents = randomTalents;
    this.updateDataFromModel();
  }

  private selectOther(id: string, value: string) {
    const modelOther = this.model.others.model.find((oth) => oth.id === id);
    if (modelOther != null) {
      if (modelOther.model.length === 1) {
        modelOther.model[0].selected = !modelOther.model[0].selected;
      } else {
        for (let selectModel of modelOther.model) {
          selectModel.selected = value === selectModel.key;
        }
      }
      this.updateOrigins(false);
      this.updateRandomNumber();
      this.updateDataFromModel();
    }
  }

  private selectOriginOther(id: string, value: string) {
    const modelOther = this.model.origin?.model.find((oth) => oth.id === id);
    if (modelOther != null) {
      for (let selectModel of modelOther.model) {
        selectModel.selected = value === selectModel.key;
      }
      this.updateOrigins(false);
      this.updateRandomNumber();
      this.updateDataFromModel();
    }
  }

  private selectOriginKey(originKey: string) {
    this.model.selectedOriginKey = originKey;
    for (const origin of this.model.origins) {
      origin.selected = origin.key === originKey;
    }
    this.updateOrigins();
    this.updateRandomNumber();
    this.updateDataFromModel();
  }

  private toggleRandomTalent(value: string) {
    const rdmTalent = this.model.randomTalents.find((rt) => rt.key === value);
    if (rdmTalent != null) {
      rdmTalent.selected = !rdmTalent.selected;
      if (
        this.model.randomTalents.filter((rt) => rt.selected).length >
        this.model.randomTalentsNbr
      ) {
        const oldestSelected = this.model.randomTalents.find(
          (rt) => rt.key === this.oldestSelectedRandomTalents[0]
        );
        if (oldestSelected != null) {
          oldestSelected.selected = false;
          this.oldestSelectedRandomTalents.splice(0, 1);
          this.oldestSelectedRandomTalents.push(value);
        }
      } else {
        if (rdmTalent.selected) {
          this.oldestSelectedRandomTalents.push(value);
        } else {
          this.oldestSelectedRandomTalents = this.oldestSelectedRandomTalents.filter(
            (rt) => rt !== rdmTalent.key
          );
        }
      }
      this.updateDataFromModel();
    }
  }

  private initModelFromData() {
    // Init Others
    const data = this.model.data.others;
    const models = new OthersModel();
    let i = 0;
    for (let refOther of this.others.model) {
      const model = new OtherModel();
      for (let ref of refOther.model) {
        model.model.push(
          new SelectModel(ref, this.resolveName(ref), data[i] === ref)
        );
      }
      models.model.push(model);
      i++;
    }
    this.model.others = models;

    // Init Random Talents
    this.model.randomTalents = [];
    for (let rdmTalent of this.randomTalents) {
      this.model.randomTalents.push(
        new SelectModel(
          rdmTalent,
          rdmTalent,
          this.model.data.randomTalents.includes(rdmTalent)
        )
      );
    }
    this.model.showRandomTalent = this.model.randomTalentsNbr > 0;
    this.model.selectedRandomTalentsNbr = this.model.data.randomTalents.length;
    this.model.selectableRandomTalentsNbr =
      this.model.randomTalentsNbr - this.model.selectedRandomTalentsNbr;
    this.oldestSelectedRandomTalents = this.model.randomTalents
      .filter((rt) => rt.selected)
      .map((rt) => rt.key);

    // Init Origin Select
    this.model.origins = [];
    for (const origin of Object.keys(this.origins)) {
      this.model.origins.push(
        new SelectModel(
          origin,
          originNames[origin],
          origin === this.model.selectedOriginKey
        )
      );
    }
    if (this.model.selectedOriginKey != null) {
      const originData = this.model.data.origin;
      const originModels = new OthersModel();
      i = 0;
      for (let refOther of this.origins[this.model.selectedOriginKey].model) {
        const model = new OtherModel();
        for (let ref of refOther.model) {
          model.model.push(
            new SelectModel(ref, this.resolveName(ref), originData[i] === ref)
          );
        }
        originModels.model.push(model);
        i++;
      }
      this.model.origin = originModels;
      this.model.showOriginOthers = originModels.model.length > 0;
    }
    const selectedOrigin = this.model.others.model
      .find(
        (osm) =>
          osm.model.find((om) => om.key.startsWith(origin) && om.selected) !=
          null
      )
      ?.model.find((om) => om.key.startsWith(origin) && om.selected);
    this.model.showOrigin = selectedOrigin != null;
  }

  private updateOrigins(forceRazModel = true) {
    const selectedOrigin = this.model.others.model
      .find(
        (osm) =>
          osm.model.find((om) => om.key.startsWith(origin) && om.selected) !=
          null
      )
      ?.model.find((om) => om.key.startsWith(origin) && om.selected);
    const hasSelectedOrigin = selectedOrigin != null;

    const razModel =
      forceRazModel ||
      (hasSelectedOrigin && this.model.selectedOriginKey == null);

    if (hasSelectedOrigin) {
      this.model.selectedOriginKey =
        this.model.selectedOriginKey != null
          ? this.model.selectedOriginKey
          : Object.keys(this.origins)[0];
      if (this.model.selectedOriginKey != null && razModel) {
        const originModels = new OthersModel();
        for (let refOther of this.origins[this.model.selectedOriginKey].model) {
          const model = new OtherModel();
          for (let ref of refOther.model) {
            model.model.push(
              new SelectModel(ref, this.resolveName(ref), false)
            );
          }
          originModels.model.push(model);
        }
        this.model.origin = originModels;
        this.model.showOriginOthers = originModels.model.length > 0;
      }
    } else {
      this.model.origin = null;
      this.model.showOriginOthers = false;
    }

    this.model.showOrigin = hasSelectedOrigin;
  }

  private updateRandomNumber() {
    let extraRdmNbr = 0;
    for (const modelOther of this.model.others.model) {
      for (const selectModel of modelOther.model.filter(
        (sm) => sm.selected && sm.key.startsWith(randomTalent)
      )) {
        extraRdmNbr += ReferentialUtil.resolveRandomPrefix(selectModel.key);
      }
    }

    if (this.model.showOrigin) {
      extraRdmNbr +=
        this.randomOriginsTalentsNbr[this.model.selectedOriginKey ?? ''] ?? 0;
    }

    this.model.randomTalentsNbr = this.baseRandomTalentsNbr + extraRdmNbr;
    this.model.showRandomTalent = this.model.randomTalentsNbr > 0;
    const currentLength = this.model.randomTalents.filter((rt) => rt.selected)
      .length;
    if (currentLength > this.model.randomTalentsNbr) {
      for (let i = this.model.randomTalentsNbr; i < currentLength; i++) {
        const oldestSelected = this.model.randomTalents.find(
          (rt) => rt.key === this.oldestSelectedRandomTalents[0]
        );
        if (oldestSelected != null) {
          oldestSelected.selected = false;
          this.oldestSelectedRandomTalents.splice(0, 1);
        }
      }
    }
  }

  private updateDataFromModel() {
    const others: string[] = [];
    for (let modelOther of this.model.others.model) {
      others.push(
        ...modelOther.model.filter((sm) => sm.selected).map((sm) => sm.key)
      );
    }
    this.model.data.others = others;
    this.model.data.randomTalents = this.model.randomTalents
      .filter((rt) => rt.selected)
      .map((rt) => rt.key);
    this.model.data.originKey =
      this.model.origin != null ? this.model.selectedOriginKey : null;
    this.model.selectedRandomTalentsNbr = this.model.data.randomTalents.length;
    this.model.selectableRandomTalentsNbr =
      this.model.randomTalentsNbr - this.model.selectedRandomTalentsNbr;
    const originOthers: string[] = [];
    for (let modelOther of this.model.origin?.model ?? []) {
      originOthers.push(
        ...modelOther.model.filter((sm) => sm.selected).map((sm) => sm.key)
      );
    }
    this.model.data.origin = originOthers;
  }

  private static refOthersToModel(refOthers: any[]): ReferentialOthersModel {
    const others = new ReferentialOthersModel();
    for (let refOther of refOthers?.filter((ro) => typeof ro === 'string') ??
      []) {
      const other = new ReferentialOtherModel();
      other.model.push(...refOther.split(',').map((s) => s.trim()));
      others.model.push(other);
    }
    return others;
  }

  private resolveName(name: string) {
    if (name?.startsWith(randomTalent)) {
      const nbrRandom = Number(name.replace(randomTalent, ''));
      return `${nbrRandom} ${i18n().localize(
        'WFRP4NPCGEN.common.button.Random'
      )}`;
    } else if (name?.startsWith(origin)) {
      return this.model.originLabel;
    }
    return ReferentialUtil.resolveName(name);
  }
}
