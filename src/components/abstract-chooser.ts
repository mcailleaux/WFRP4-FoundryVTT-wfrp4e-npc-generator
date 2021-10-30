import RegisterSettings from '../util/register-settings.js';

declare type Model<DATA> = {
  id: number;
  buttonsTemplate: () => string;
  actions: Actions<DATA>;
  data: DATA;
};

declare type Actions<DATA> = {
  name: 'yes' | 'no' | 'previous';
  label: string;
  icon: string;
  type: 'submit' | 'button';
  callback: (data?: DATA) => void;
}[];

export abstract class AbstractChooser<DATA, MODEL = {}> extends FormApplication<
  FormApplication.Options,
  FormApplication.Data<DATA, FormApplication.Options>
> {
  protected model = this.getInitModel();
  protected previousCallback: (() => void) | null;

  protected constructor(
    object: DATA,
    previousCallback: (() => void) | null = null,
    options: Partial<FormApplication.Options> = {}
  ) {
    super(object, options);
    this.model.data = this.object;
    this.previousCallback = previousCallback;
    this.model.id = new Date().getTime();
    this.model.buttonsTemplate = () =>
      `modules/${RegisterSettings.moduleName}/templates/chooser-action.html`;
    if (previousCallback != null) {
      this.model.actions.push({
        name: 'previous',
        label: 'WFRP4NPCGEN.common.button.Undo',
        icon: 'fa-undo',
        type: 'button',
        callback: this.previous,
      });
    }
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, <FormApplication.Options>{
      height: 'auto',
      resizable: true,
      closeOnSubmit: true,
    });
  }

  public async close(options?: object): Promise<void> {
    return await super.close(options ?? { submit: false, force: true });
  }

  protected async _onSubmit(
    event: Event,
    options?: FormApplication.OnSubmitOptions
  ): Promise<Partial<Record<string, unknown>>> {
    event.preventDefault();
    if (this.isValid(this.model.data)) {
      await super._onSubmit(event, options);
      this.yes(this.model.data);
    }
    return Promise.resolve({});
  }

  protected _getSubmitData(_updateData?: object): any {
    return this.model.data;
  }

  public getData(): any {
    return this.model;
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, `#${this.model.id}-no`, async (_event) => {
      await this.close();
      this.no();
    });
    this.handleClick(html, `#${this.model.id}-previous`, async (_event) => {
      await this.close();
      this.previous();
    });
  }

  protected handleClick(
    html: JQuery,
    selector: string,
    handler: (event: JQuery.ClickEvent) => void
  ) {
    html.find(selector).on('click', handler);
  }

  protected handleChange(
    html: JQuery,
    selector: string,
    handler: (event: JQuery.ChangeEvent) => void
  ) {
    html.find(selector).on('change', handler);
  }

  protected handleInput(
    html: JQuery,
    selector: string,
    handler: (event: JQuery.EventBase) => void
  ) {
    html.find(selector).on('input', handler);
  }

  protected _updateObject(
    _event: Event,
    _formData: object | undefined
  ): Promise<void> {
    return Promise.resolve();
  }

  protected previous() {
    if (this.previousCallback != null) {
      this.previousCallback();
    }
  }

  protected no() {}

  protected abstract isValid(data: DATA): boolean;

  protected abstract yes(data: DATA);

  private getInitModel(): Model<DATA> & MODEL {
    return <Model<DATA> & MODEL>{
      data: <DATA>{},
      actions: [
        {
          name: 'yes',
          label: 'WFRP4NPCGEN.common.button.OK',
          icon: 'fa-check',
          type: 'submit',
          callback: this.yes,
        },
        {
          name: 'no',
          label: 'WFRP4NPCGEN.common.button.Cancel',
          icon: 'fa-times',
          type: 'button',
          callback: this.no,
        },
      ],
    };
  }
}
