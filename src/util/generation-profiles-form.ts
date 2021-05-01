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
      const profiles = duplicate(
        game.settings.get(RegisterSettings.moduleName, 'generationProfiles')
      );
      const speciesMap = ReferentialUtil.getSpeciesMap();
      Object.entries(speciesMap).forEach(([key, label]) => {
        if (profiles[key] != null) {
          profiles[key].species = label;
        }
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

          this.data[species].profiles.push({
            name: name,
            genPath: '',
            imagePath: '',
            tokenPath: '',
          });
          this.render();
        }),
        default: 'yes',
      }).render(true);
    });
  }

  public async _updateObject(_event: Event, formData: any) {
    console.dir(formData);
  }

  public close(options?: object): Promise<void> {
    this.data = null;
    return super.close(options);
  }
}
