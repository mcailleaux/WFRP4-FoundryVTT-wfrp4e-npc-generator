import GenerationProfiles, {
  GenerationProfile,
} from './generation-profiles.js';
import RegisterSettings from './register-settings.js';
import ReferentialUtil from './referential-util.js';
import NameChooser from './name-chooser.js';
import { i18n, settings } from '../constant.js';

export default class GenerationProfilesForm extends FormApplication<
  FormApplication.Options,
  GenerationProfiles
> {
  private data: any;

  constructor(object: GenerationProfiles, options: Partial<Options> = {}) {
    super(object, options);
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'generation-profiles',
      title: i18n.localize('WFRP4NPCGEN.settings.generationProfiles.name'),
      template: `modules/${RegisterSettings.moduleName}/templates/generation-profiles.html`,
      width: 800,
      height: 'auto',
      resizable: true,
      closeOnSubmit: true,
    });
  }

  public getData(): any {
    if (this.data == null) {
      const profiles: { [key: string]: any } = duplicate(
        settings.get(RegisterSettings.moduleName, 'generationProfiles')
      );
      if (profiles.creature == null) {
        profiles.creature = <GenerationProfile>{
          profiles: [],
        };
      }
      const speciesMap = ReferentialUtil.getSpeciesMap();
      Object.entries(speciesMap).forEach(([key, label]) => {
        if (profiles[key] == null) {
          profiles[key] = {
            profiles: [],
          };
        }
        profiles[key].species = label;
      });
      if (profiles.creature != null) {
        profiles.creature.species = i18n.localize(
          'WFRP4NPCGEN.options.select.profiles.creature.label'
        );
      }
      Object.entries(profiles).forEach(([key, value]) => {
        value.profiles.forEach((profile: any) => {
          profile.id = `${key}-${profile.name}`;
          profile.idGenPath = `${key}-${profile.name}-genPath`;
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
            idGenPath: `${species}-${name}-genPath`,
            idImagePath: `${species}-${name}-imagePath`,
            idTokenPath: `${species}-${name}-tokenPath`,
            name: name,
            genPath: settings.get(
              RegisterSettings.moduleName,
              species === 'creature'
                ? 'defaultCreatureGenPath'
                : 'defaultGenPath'
            ),
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
            editedName.idGenPath = `${species}-${newName}-genPath`;
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
    html.find('.generation-profiles-input-imagePath').on('change', (event) => {
      this.performInputChange(event, 'imagePath');
    });
    html.find('.generation-profiles-input-tokenPath').on('change', (event) => {
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
        delete profile.idGenPath;
        delete profile.idImagePath;
        delete profile.idTokenPath;
      });
    });

    await settings.set(
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
