import DialogUtil from './dialog-util.js';
import { i18n } from '../constant.js';

export default class WaiterUtil {
  private static dialogInstance: Dialog | null = null;

  public static async show(
    title: string,
    msg: string,
    renderCallback: () => void
  ) {
    if (this.dialogInstance != null) {
      await this.hide(false);
    }
    this.dialogInstance = new Dialog(<Dialog.Data & any>{
      title: i18n().localize(title),
      content: `<form> 
              <div class="form-group">
              ${DialogUtil.getLabelScript(msg)}
              </div>
          </form>
            `,
      buttons: {},
      render: (_html: JQuery) => {
        setTimeout(async () => {
          renderCallback();
        });
      },
    });
    this.dialogInstance.render(true);
  }

  public static async hide(asyncClose = true) {
    if (this.dialogInstance != null) {
      asyncClose
        ? setTimeout(async () => {
            await this.dialogInstance?.close();
          })
        : await this.dialogInstance?.close();
    }
  }
}
