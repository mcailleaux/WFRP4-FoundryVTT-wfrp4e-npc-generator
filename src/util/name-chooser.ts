import DialogUtil from './dialog-util.js';
import { i18n } from '../constant.js';

export default class NameChooser {
  public static async selectName(
    initName: string,
    speciesKey: string,
    withRandom: boolean,
    callback: (name: string) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();
    const randomButton = withRandom
      ? `
        <div class="form-group">
          ${DialogUtil.getButtonScript(
            'WFRP4NPCGEN.common.button.Random',
            'random()'
          )}
        </div>     
        `
      : '';
    new Dialog(
      {
        title: i18n().localize('WFRP4NPCGEN.name.select.title'),
        content: `<form>
              ${randomButton}            
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
              ${DialogUtil.getInputScript({
                id: `select-name-${dialogId}`,
                type: 'text',
                onInput: 'check()',
                initValue: initName,
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
              function random() {
                  document.getElementById('select-name-${dialogId}').value = generateName('${speciesKey}');
                  check();
              }
              check();
              
              ${DialogUtil.getNameRandomScript()};
            </script>
            `,
        buttons: DialogUtil.getDialogButtons(
          dialogId,
          (html: JQuery) => {
            const name = <string>html.find(`#select-name-${dialogId}`).val();
            callback(name);
          },
          undo
        ),
        default: 'yes',
      },
      {
        resizable: true,
        classes: ['dialog', 'wfrp4e-npc-generator-dialog'],
      }
    ).render(true);
  }
}
