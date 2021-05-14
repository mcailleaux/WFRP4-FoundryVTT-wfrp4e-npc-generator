import DialogUtil from './dialog-util.js';
import { getGenerateEffectOptionEnum } from './generate-effect-option.enum.js';
import RegisterSettings from './register-settings.js';
import { GenerationProfile } from './generation-profiles.js';
import { IOptions } from './options-int.js';
import OptionsCreature from './options-creature.js';
import Options from './options.js';

export default class OptionsChooser {
  public static async selectOptions(
    forCreature: boolean,
    initOptions: IOptions,
    speciesKey: string,
    callback: (options: IOptions) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const speciesProfiles: { [key: string]: any } = duplicate(
      game.settings.get(RegisterSettings.moduleName, 'generationProfiles')
    );
    let profilesChooser = '';
    let profileNames: any[] = [];
    if (speciesProfiles != null && speciesProfiles[speciesKey] != null) {
      const profiles: GenerationProfile = speciesProfiles[speciesKey];
      profileNames = profiles?.profiles ?? [];
      const options: { [key: string]: string } = {
        ['']: '',
      };
      profiles.profiles.forEach((p) => {
        options[p.name] = p.name;
      });
      if (profiles?.profiles?.length > 0) {
        profilesChooser = `
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.profiles.label'
              )}
              ${DialogUtil.getSelectScript(
                `select-profile-${dialogId}`,
                options,
                '',
                'profileChange()'
              )}
              </div>
    `;
      }
    }

    const withClassTrappings = forCreature
      ? ''
      : `
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withClassTrappings.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-class-trappings-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-class-trappings',
                initValue:
                  initOptions != null && initOptions.withClassTrappings,
                checked: initOptions != null && initOptions.withClassTrappings,
              })}
              </div>
    `;

    const withCareerTrappings = forCreature
      ? ''
      : `
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withCareerTrappings.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-career-trappings-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-career-trappings',
                initValue:
                  initOptions != null && initOptions.withCareerTrappings,
                checked: initOptions != null && initOptions.withCareerTrappings,
              })}
              </div>
    `;

    const generateWeaponEffect = forCreature
      ? ''
      : `
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.trappings.weapon.label')}
              ${DialogUtil.getEffectSelectScript(
                dialogId,
                'generate-effect-weapon',
                initOptions?.generateWeaponEffect
              )}
              </div>
    `;

    const withGenPathCareerName = forCreature
      ? ''
      : `
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withGenPathCareerName.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-genPath-career-name-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-genPath-career-name',
                initValue:
                  initOptions != null && initOptions.withGenPathCareerName,
                checked:
                  initOptions != null && initOptions.withGenPathCareerName,
              })}
              </div>
    `;

    const withInitialWeapons = forCreature
      ? ''
      : `
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withInitialWeapons.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-init-weapons-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-init-weapons',
                initValue:
                  initOptions != null && initOptions.withInitialWeapons,
                checked: initOptions != null && initOptions.withInitialWeapons,
              })}
              </div>
    `;

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.options.select.title'),
      content: `<form>
              ${withClassTrappings}
              ${withCareerTrappings}             
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.editTrappings.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-edit-trappings-${dialogId}`,
                type: 'checkbox',
                name: 'select-edit-trappings',
                initValue: initOptions != null && initOptions.editTrappings,
                checked: initOptions != null && initOptions.editTrappings,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.addMagics.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-add-magics-${dialogId}`,
                type: 'checkbox',
                name: 'select-add-magics',
                initValue: initOptions != null && initOptions.addMagics,
                checked: initOptions != null && initOptions.addMagics,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.addMutations.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-add-mutations-${dialogId}`,
                type: 'checkbox',
                name: 'select-add-mutations',
                initValue: initOptions != null && initOptions.addMutations,
                checked: initOptions != null && initOptions.addMutations,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.trappings.money.label')}
              ${DialogUtil.getEffectSelectScript(
                dialogId,
                'generate-effect-money',
                initOptions?.generateMoneyEffect
              )}
              </div>
              ${generateWeaponEffect}
              
              ${withGenPathCareerName}             
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withLinkedToken.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-linked-token-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-linked-token',
                initValue: initOptions != null && initOptions.withLinkedToken,
                checked: initOptions != null && initOptions.withLinkedToken,
              })}
              </div>
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.withInitialMoney.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-with-init-money-${dialogId}`,
                type: 'checkbox',
                name: 'select-with-init-money',
                initValue: initOptions != null && initOptions.withInitialMoney,
                checked: initOptions != null && initOptions.withInitialMoney,
              })}
              </div>
              
              ${withInitialWeapons}
              
              ${profilesChooser}
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.genPath.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-genPath-${dialogId}`,
                type: 'text',
                initValue: initOptions?.genPath,
                name: 'select-genPath',
              })}          
              </div>
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.imagePath.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-imagePath-${dialogId}`,
                type: 'text',
                initValue: initOptions?.imagePath ?? '',
                name: 'select-imagePath',
              })}          
              ${DialogUtil.getFilePickerButton(
                `select-imagePath-${dialogId}`,
                'image'
              )}
              </div>
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.options.select.tokenPath.label'
              )}
              ${DialogUtil.getInputScript({
                id: `select-tokenPath-${dialogId}`,
                type: 'text',
                initValue: initOptions?.tokenPath ?? '',
                name: 'select-tokenPath',
              })}
              ${DialogUtil.getFilePickerButton(
                `select-tokenPath-${dialogId}`,
                'image'
              )}          
              </div>
              
              </form>      
              <script>
              
              function profileChange() {
                  const profiles = [
                      ${profileNames
                        .map((p) => {
                          return `{
                            name: "${p.name}",
                            genPath: "${p.genPath}",
                            imagePath: "${p.imagePath}",
                            tokenPath: "${p.tokenPath}",
                        }`;
                        })
                        .join(',')}
                  ]
                  const selectedProfile = document.getElementById('select-profile-${dialogId}')?.value;
                  if (selectedProfile != null && selectedProfile.length > 0) {
                      const prof = profiles.find((p) => p.name === selectedProfile);
                      if (prof != null) {
                          document.getElementById('select-genPath-${dialogId}').value = prof.genPath;
                          document.getElementById('select-imagePath-${dialogId}').value = prof.imagePath;
                          document.getElementById('select-tokenPath-${dialogId}').value = prof.tokenPath;
                      }
                  }
              }
              
              ${DialogUtil.browseFileScript()}
              </script>      
            `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const options = forCreature ? new OptionsCreature() : new Options();
          html
            .find(`#select-with-class-trappings-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withClassTrappings = r.checked;
            });
          html
            .find(`#select-with-career-trappings-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withCareerTrappings = r.checked;
            });
          html
            .find(`#select-edit-trappings-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.editTrappings = r.checked;
            });
          html
            .find(`#select-add-magics-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.addMagics = r.checked;
            });
          html
            .find(`#select-add-mutations-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.addMutations = r.checked;
            });
          html
            .find(`#generate-effect-money-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.generateMoneyEffect = getGenerateEffectOptionEnum(
                r.value
              );
            });
          html
            .find(`#generate-effect-weapon-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.generateWeaponEffect = getGenerateEffectOptionEnum(
                r.value
              );
            });
          html
            .find(`#select-with-genPath-career-name-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withGenPathCareerName = r.checked;
            });
          html
            .find(`#select-with-linked-token-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withLinkedToken = r.checked;
            });
          html
            .find(`#select-with-init-money-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withInitialMoney = r.checked;
            });
          html
            .find(`#select-with-init-weapons-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.withInitialWeapons = r.checked;
            });
          html
            .find(`#select-genPath-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.genPath = r.value ?? '';
            });
          html
            .find(`#select-imagePath-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.imagePath = r.value ?? '';
            });
          html
            .find(`#select-tokenPath-${dialogId}`)
            .each((_i, r: HTMLInputElement) => {
              options.tokenPath = r.value ?? '';
            });

          callback(options);
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
