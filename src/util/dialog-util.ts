export default class DialogUtil {
  public static getButtonScript(label: string, onclick: string): string {
    return `
        <button type="button" onclick="${onclick}">
            ${game.i18n.localize(label)} 
        </button>
        `;
  }

  public static getLabelScript(label: string): string {
    return `
        <label>
            ${game.i18n.localize(label)}          
        </label> 
        `;
  }

  public static getSelectScript(
    id: string,
    options: { [key: string]: string }
  ): string {
    return `
        <select id="${id}">
            ${Object.entries(options).map(
              ([key, value]) =>
                `<option id="${id}-${key}" value="${key}">${value}</option>`
            )}
        </select>
        `;
  }
}
