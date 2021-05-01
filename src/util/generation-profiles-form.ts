import GenerationProfiles from './generation-profiles.js';
import RegisterSettings from './register-settings.js';

export default class GenerationProfilesForm extends FormApplication<GenerationProfiles> {
  constructor(object: GenerationProfiles, options: FormApplication.Options) {
    super(object, options);
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'generation-profiles',
      title: game.i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      template: `modules/${RegisterSettings.moduleName}/templates/generation-profiles.html`,
      width: 750,
      height: 'auto',
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
    });
  }
}
