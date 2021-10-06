import { AbstractChooser } from './abstract-chooser.js';
import ReferentialUtil from '../util/referential-util.js';
import { i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import RandomUtil from '../util/random-util.js';

class Model {
  public careers: string[];

  constructor(careers: string[]) {
    this.careers = careers;
  }
}

export class CareerChooser extends AbstractChooser<
  Model,
  {
    careers: string[];
    speciesCareers: string[];
    speciesName: string;
  }
> {
  private careers: string[];
  private filteredCareers: string[];
  private speciesCareers: string[];
  private filteredSpeciesCareers: string[];
  private selectedCareer: string | null = null;
  private selectedSpeciesCareer: string | null = null;

  private callback: (careers: string[]) => void;

  constructor(
    object: Model,
    careers: string[],
    speciesCareers: string[],
    speciesName: string,
    callback: (careers: string[]) => void,
    previousCallback: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);

    this.model.speciesName = speciesName;

    this.callback = callback;
    this.careers = careers;
    this.speciesCareers = speciesCareers;

    this.initCareers();
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'career-chooser',
      title: i18n().localize('WFRP4NPCGEN.career.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/career-chooser.html`,
      width: 400,
    });
  }

  public static async selectCareer(
    initCareers: string[],
    speciesKey: string,
    subSpeciesKey: string,
    callback: (careers: string[]) => void,
    undo: () => void
  ) {
    const careers = await ReferentialUtil.getCareerEntitieNames();
    const speciesCareers = await ReferentialUtil.getRandomSpeciesCareers(
      speciesKey ?? 'human',
      subSpeciesKey
    );

    new CareerChooser(
      new Model(initCareers ?? []),
      careers,
      speciesCareers,
      ReferentialUtil.getSpeciesMap()[speciesKey ?? 'human'],
      callback,
      undo
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '#randomCareerButton', (_event) => {
      const randomCareer = RandomUtil.getRandomValue(this.filteredCareers);
      this.addCareer(randomCareer);
      this.render();
    });
    this.handleClick(html, '#randomSpeciesCareerButton', (_event) => {
      const randomCareer = RandomUtil.getRandomValue(
        this.filteredSpeciesCareers
      );
      this.addCareer(randomCareer);
      this.render();
    });
    this.handleInput(html, '#selectCareerInput', (event) => {
      this.updateSelectedCareer(event.currentTarget.value);
    });
    this.handleInput(html, '#selectSpeciesCareerInput', (event) => {
      this.updateSelectedSpeciesCareer(event.currentTarget.value);
    });
    this.handleClick(html, '#addCareerButton', (_event) => {
      this.addCareer(this.selectedCareer);
      this.render();
    });
    this.handleClick(html, '#addSpeciesCareerButton', (_event) => {
      this.addCareer(this.selectedSpeciesCareer);
      this.render();
    });
    this.handleClick(html, '.remove-career-button', (event) => {
      this.removeCareer(event.currentTarget.value);
      this.render();
    });
  }

  protected isValid(data: Model): boolean {
    return data?.careers?.length > 0;
  }

  protected yes(data: Model) {
    this.callback(data?.careers);
  }

  private initCareers() {
    this.updateFilteredCareer();
  }

  private addCareer(career: string | null) {
    if (career != null && !this.model.data.careers.includes(career)) {
      this.model.data.careers.push(career);
    }
    this.updateFilteredCareer();
  }

  private removeCareer(career: string) {
    if (career != null && this.model.data.careers.includes(career)) {
      this.model.data.careers = this.model.data.careers.filter(
        (c) => c !== career
      );
    }
    this.updateFilteredCareer();
  }

  private updateFilteredCareer() {
    this.filteredCareers = this.careers.filter(
      (c) => !this.model.data.careers.includes(c)
    );
    this.filteredSpeciesCareers = this.speciesCareers.filter(
      (c) => !this.model.data.careers.includes(c)
    );
    this.model.careers = this.filteredCareers;
    this.model.speciesCareers = this.filteredSpeciesCareers;
  }

  private updateSelectedCareer(career: string) {
    if (career != null && this.careers.includes(career)) {
      this.selectedCareer = career;
    } else {
      this.selectedCareer = null;
    }
  }

  private updateSelectedSpeciesCareer(career: string) {
    if (career != null && this.speciesCareers.includes(career)) {
      this.selectedSpeciesCareer = career;
    } else {
      this.selectedSpeciesCareer = null;
    }
  }
}
