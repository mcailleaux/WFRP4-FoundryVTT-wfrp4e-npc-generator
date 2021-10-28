import { AbstractChooser } from './abstract-chooser.js';
import { generateName, i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';

class Model {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class NameChooser extends AbstractChooser<
  Model,
  {
    showRandom: boolean;
  }
> {
  private speciesKey: string;
  private callback: (name: string) => void;

  constructor(
    object: Model,
    speciesKey: string,
    showRandom: boolean,
    callback: (name: string) => void,
    previousCallback?: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);
    this.model.showRandom = showRandom;
    this.speciesKey = speciesKey;
    this.callback = callback;
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'name-chooser',
      title: i18n().localize('WFRP4NPCGEN.name.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/name-chooser.html`,
      width: 400,
    });
  }

  public static async selectName(
    initName: string,
    speciesKey: string,
    withRandom: boolean,
    callback: (name: string) => void,
    undo?: () => void
  ) {
    new NameChooser(
      new Model(initName),
      speciesKey,
      withRandom,
      callback,
      undo
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '#randomNameButton', (_event) => {
      const randomName = generateName(this.speciesKey);
      this.updateName(randomName);
      this.render();
    });
    this.handleChange(html, '#nameInput', (event) => {
      this.updateName(event.currentTarget.value);
    });
  }

  protected isValid(data: Model): boolean {
    return data?.name?.length > 0;
  }

  protected yes(data: Model) {
    this.callback(data?.name);
  }

  private updateName(name: string) {
    this.model.data.name = name;
  }
}
