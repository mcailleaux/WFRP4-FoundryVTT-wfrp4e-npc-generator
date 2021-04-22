import DialogUtil from './dialog-util.js';

export default class NameChooser {
  public static async selectName(
    initName: string,
    callback: (name: string) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.name.select.title'),
      content: `<form>              
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
    }).render(true);
  }
}
