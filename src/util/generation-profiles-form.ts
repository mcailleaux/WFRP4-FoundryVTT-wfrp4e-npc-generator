import GenerationProfiles from './generation-profiles.js';
import RegisterSettings from './register-settings.js';
import ReferentialUtil from './referential-util.js';
import NameChooser from './name-chooser.js';

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
      closeOnSubmit: true,
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
          profile.id = `${key}-${profile.name}`;
          profile.idImagePath = `${key}-${profile.name}-imagePath`;
          profile.idTokenPath = `${key}-${profile.name}-tokenPath`;
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
      const species = (<HTMLButtonElement>event?.currentTarget)?.value;
      NameChooser.selectName('', species, false, (name) => {
        const existingName = this.data[species].profiles.find(
          (p: any) => p.id === `${species}-${name}`
        );

        if (existingName == null) {
          this.data[species].profiles.push({
            id: `${species}-${name}`,
            idImagePath: `${species}-${name}-imagePath`,
            idTokenPath: `${species}-${name}-tokenPath`,
            name: name,
            genPath: '',
            imagePath: '',
            tokenPath: '',
          });
          this.render();
        }
      });
    });

    html.find('.generation-profiles-edit-button').on('click', (event) => {
      const id = (<HTMLButtonElement>event?.currentTarget)?.value;
      if (id != null && id.includes('-')) {
        const species = id.substring(0, id.indexOf('-'));
        const name = id.substring(id.indexOf('-') + 1, id.length);
        const editedName = this.data[species].profiles.find(
          (p: any) => p.id === `${species}-${name}`
        );
        NameChooser.selectName(name, species, false, (newName) => {
          const existingName = this.data[species].profiles.find(
            (p: any) => p.id === `${species}-${newName}`
          );

          if (existingName == null && editedName != null) {
            editedName.name = newName;
            editedName.id = `${species}-${newName}`;
            editedName.idImagePath = `${species}-${newName}-imagePath`;
            editedName.idTokenPath = `${species}-${newName}-tokenPath`;
            this.render();
          }
        });
      }
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

    html.find('.generation-profiles-input-genPath').on('input', (event) => {
      this.performInputChange(event, 'genPath');
    });
    html.find('.generation-profiles-input-imagePath').on('input', (event) => {
      this.performInputChange(event, 'imagePath');
    });
    html.find('.generation-profiles-input-tokenPath').on('input', (event) => {
      this.performInputChange(event, 'tokenPath');
    });
    super.activateListeners(html);
  }

  protected _getSubmitData(_updateData?: object): any {
    return this.data;
  }

  public async _updateObject(_event: Event, formData: any) {
    const generationProfiles: { [key: string]: any } = duplicate(formData);
    Object.entries(generationProfiles).forEach(([key, value]) => {
      delete generationProfiles[key].species;
      value.profiles.forEach((profile: any) => {
        delete profile.id;
      });
    });

    await game.settings.set(
      RegisterSettings.moduleName,
      'generationProfiles',
      generationProfiles
    );
  }

  public close(options?: object): Promise<void> {
    this.data = null;
    return super.close(options);
  }

  private performInputChange(event: JQuery.TriggeredEvent, attr: string) {
    const id = (<HTMLButtonElement>event?.currentTarget)?.id;
    const value = (<HTMLButtonElement>event?.currentTarget)?.value;
    if (id != null && id.includes('-')) {
      const species = id.substring(0, id.indexOf('-'));
      const startName = id.indexOf('-') + 1;
      const name = id.substring(startName, id.indexOf('-', startName));
      const existing = this.data[species].profiles.find(
        (p: any) => p.id === `${species}-${name}`
      );
      if (existing != null) {
        existing[attr] = value;
      }
    }
  }
}
