import GenerationProfiles from './generation-profiles.js';
import RegisterSettings from './register-settings.js';
import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';

export default class GenerationProfilesForm extends FormApplication<GenerationProfiles> {
  private data: any;

  constructor(
    object: GenerationProfiles,
    options: FormApplication.Options = {}
  ) {
    super(object, options);
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'generation-profiles',
      title: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      template: `modules/${RegisterSettings.moduleName}/templates/generation-profiles.html`,
      width: 700,
      height: 'auto',
      resizable: true,
      closeOnSubmit: false,
    });
  }

  public getData(): any {
    if (this.data == null) {
      const profiles: { [key: string]: any } = duplicate(
        game.settings.get(RegisterSettings.moduleName, 'generationProfiles')
      );
      const speciesMap = ReferentialUtil.getSpeciesMap();
      Object.entries(speciesMap).forEach(([key, label]) => {
        if (profiles[key] != null) {
          profiles[key].species = label;
        }
      });
      Object.entries(profiles).forEach(([key, value]) => {
        value.profiles.forEach((profile: any) => {
          profile.id = `${key}-${name}`;
        });
      });
      this.data = profiles;
    }

    return {
      species: this.data,
    };
  }

  public activateListeners(html: JQuery) {
    html.find('.generation-profiles-add-button').on('click', (event) => {
      const dialogId = new Date().getTime();
      const species = (<HTMLButtonElement>event?.currentTarget)?.value;
      new Dialog({
        title: game.i18n.localize('WFRP4NPCGEN.name.select.title'),
        content: `<form>            
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
              ${DialogUtil.getInputScript({
                id: `select-name-${dialogId}`,
                type: 'text',
                onInput: 'check()',
                name: 'select-name',
              })}
              </div>
          </form>
          <script>  
              function check() {
                const name = document.getElementById('select-name-${dialogId}').value;
                const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                yesButton.disabled = name == null || name.length <= 0;    
              }
              check();
            </script>
            `,
        buttons: DialogUtil.getDialogButtons(dialogId, (html: JQuery) => {
          const name = <string>html.find(`#select-name-${dialogId}`).val();

          const existingName = this.data[species].profiles.find(
            (p: any) => p.id === `${species}-${name}`
          );

          if (existingName == null) {
            this.data[species].profiles.push({
              id: `${species}-${name}`,
              name: name,
              genPath: '',
              imagePath: '',
              tokenPath: '',
            });
            this.render();
          }
        }),
        default: 'yes',
      }).render(true);
    });

    html.find('.generation-profiles-delete-button').on('click', (event) => {
      const id = (<HTMLButtonElement>event?.currentTarget)?.value;
      if (id != null && id.includes('-')) {
        const species = id.substring(0, id.indexOf('-'));
        if (this.data[species] != null) {
          const indexToRemove = this.data[species].profiles.findIndex(
            (p: any) => p.id === id
          );
          if (indexToRemove >= 0) {
            this.data[species].profiles.splice(indexToRemove, 1);
            this.render();
          }
        }
      }
    });
    super.activateListeners(html);
  }

  protected _onChangeInput(event: Event | JQuery.Event) {
    console.dir(event);
    super._onChangeInput(event);
  }

  protected _getSubmitData(_updateData?: object): any {
    return this.data;
  }

  public async _updateObject(_event: Event, formData: any) {
    console.dir(formData);
  }

  public close(options?: object): Promise<void> {
    this.data = null;
    return super.close(options);
  }
}
