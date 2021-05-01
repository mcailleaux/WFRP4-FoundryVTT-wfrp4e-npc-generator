import GenerationProfiles from './generation-profiles.js';
import RegisterSettings from './register-settings.js';
import ReferentialUtil from './referential-util.js';

export default class GenerationProfilesForm extends FormApplication<GenerationProfiles> {
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
    const profiles = game.settings.get(
      RegisterSettings.moduleName,
      'generationProfiles'
    );
    const speciesMap = ReferentialUtil.getSpeciesMap();
    Object.entries(speciesMap).forEach(([key, label]) => {
      if (profiles[key] != null) {
        profiles[key].species = label;
      }
    });
    return {
      species: profiles,
    };
  }

  public activateListeners(html: any) {
    console.dir(html);
    console.dir(typeof html);
  }

  public async _updateObject(_event: Event, formData: any) {
    console.dir(formData);
  }
}
