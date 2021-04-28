import DialogUtil from './dialog-util.js';
import Options from './options.js';
import { getGenerateEffectOptionEnum } from './generate-effect-option.enum.js';

export default class OptionsChooser {
  public static async selectOptions(
    initOptions: Options,
    callback: (options: Options) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.options.select.title'),
      content: `<form>
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
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.trappings.money.label')}
              ${DialogUtil.getEffectSelectScript(
                dialogId,
                'generate-effect-money',
                initOptions?.generateMoneyEffect
              )}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.trappings.weapon.label')}
              ${DialogUtil.getEffectSelectScript(
                dialogId,
                'generate-effect-weapon',
                initOptions?.generateWeaponEffect
              )}
              </div>
              </form>            
            `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const options = new Options();
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

          callback(options);
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
