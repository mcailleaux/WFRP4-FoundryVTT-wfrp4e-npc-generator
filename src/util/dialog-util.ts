export default class DialogUtil {
  public static getButtonScript(label: string, onclick: string) {
    return `
              <button type="button" onclick="${onclick}">
              ${game.i18n.localize(label)} 
              </button>
        `;
  }
}
