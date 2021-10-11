import { AbstractChooser } from './abstract-chooser.js';
import { SelectModel } from '../models/common/select-model.js';
import { i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import ReferentialUtil from '../util/referential-util.js';
import RandomUtil from '../util/random-util.js';

class Model {
  public others: string[];
  public randomTalents: string[];
  public originKey: string;
  public origin: string[];
  public randomOriginTalents: string[];

  constructor(
    others: string[],
    randomTalents: string[],
    originKey: string,
    origin: string[],
    randomOriginTalents: string[]
  ) {
    this.others = others;
    this.randomTalents = randomTalents;
    this.originKey = originKey;
    this.origin = origin;
    this.randomOriginTalents = randomOriginTalents;
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
    originName: string;
    others: OthersModel;
    origin: OthersModel;
    randomTalents: SelectModel[];
    randomOriginTalents: SelectModel[];
  }
> {
  private others: ReferentialOthersModel;
  // private randomTalentsNbr: number;
  // private origins: { [origin: string]: ReferentialOthersModel };
  // private randomOriginsTalentsNbr: { [origin: string]: number };

  private callback: (
    others: string[],
    randomTalents: string[],
    originKey: string,
    origin: string[],
    randomOriginTalents: string[]
  ) => void;

  constructor(
    object: Model,
    others: ReferentialOthersModel,
    _randomTalentsNbr: number,
    _origins: { [origin: string]: ReferentialOthersModel },
    _randomOriginsTalentsNbr: { [origin: string]: number },
    callback: (
      others: string[],
      randomTalents: string[],
      originKey: string,
      origin: string[],
      randomOriginTalents: string[]
    ) => void,
    previousCallback: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);

    this.others = others;
    // this.randomTalentsNbr = randomTalentsNbr;
    // this.origins = origins;
    // this.randomOriginsTalentsNbr = randomOriginsTalentsNbr;
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
    initRandomOriginTalents: string[],
    speciesKey: string,
    subSpeciesKey: string,
    callback: (
      others: string[],
      randomTalents: string[],
      originKey: string,
      origin: string[],
      randomOriginTalents: string[]
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
    const rdmTalNbr = refOthers.find((ro) => typeof ro === 'number') ?? 0;
    const refOrigins =
      subSpeciesKey != null
        ? await ReferentialUtil.getSubSpeciesOrigins(
            speciesKey,
            subSpeciesKey,
            true
          )
        : await ReferentialUtil.getSpeciesOrigins(speciesKey, true);
    const origins = {};
    const rdmOriTalNbr = {};
    for (let origin of Object.keys(refOrigins)) {
      origins[origin] = this.refOthersToModel(refOrigins[origin]);
      rdmOriTalNbr[origin] =
        refOrigins[origin]?.find((ro) => typeof ro === 'number') ?? 0;
    }

    new SpeciesOthersChooser(
      new Model(
        initOthers ?? [],
        initRandomTalents ?? [],
        initOriginKey,
        initOrigin ?? [],
        initRandomOriginTalents ?? []
      ),
      others,
      rdmTalNbr,
      origins,
      rdmOriTalNbr,
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
  }

  protected isValid(data: Model): boolean {
    const othersValid = data.others.length === this.model.others.model.length;
    return othersValid;
  }

  protected yes(data: Model) {
    this.callback(
      data?.others ?? [],
      data.randomTalents ?? [],
      data.originKey,
      data.origin,
      data.randomOriginTalents
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
    this.updateDataFromModel();
  }

  private selectOther(id: string, value: string) {
    const modelOther = this.model.others.model.find((oth) => oth.id === id);
    if (modelOther != null) {
      for (let selectModel of modelOther.model) {
        selectModel.selected = value === selectModel.key;
      }
      this.updateDataFromModel();
    }
  }

  private initModelFromData() {
    const data = this.model.data.others;
    const models = new OthersModel();
    let i = 0;
    for (let refOther of this.others.model) {
      const model = new OtherModel();
      for (let ref of refOther.model) {
        model.model.push(
          new SelectModel(
            ref,
            ReferentialUtil.resolveName(ref),
            data[i] === ref
          )
        );
      }
      models.model.push(model);
      i++;
    }
    this.model.others = models;
  }

  private updateDataFromModel() {
    const others: string[] = [];
    for (let modelOther of this.model.others.model) {
      others.push(
        ...modelOther.model.filter((sm) => sm.selected).map((sm) => sm.key)
      );
    }
    this.model.data.others = others;
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
}
