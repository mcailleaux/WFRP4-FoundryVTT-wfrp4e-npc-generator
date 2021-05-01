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
      width: '50%',
      height: 'auto',
      resizable: true,
      closeOnSubmit: false,
    });
  }

  public getData(): any {
    return {
      profiles: game.settings.get(
        RegisterSettings.moduleName,
        'generationProfiles'
      ),
    };
  }
}
