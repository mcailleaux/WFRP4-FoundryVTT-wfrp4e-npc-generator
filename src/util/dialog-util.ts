export default class DialogUtil {
  public static getDialogButtons(
    id: number,
    yesCallback: (html?: JQuery) => void,
    previousCallback?: (html?: JQuery) => void
  ) {
    const buttons: any = {
      yes: {
        icon: `<i class="fas fa-check" id="yes-icon-${id}"></i>`,
        label: game.i18n.localize('WFRP4NPCGEN.common.button.OK'),
        callback: (html: JQuery) => {
          if (yesCallback != null) {
            yesCallback(html);
          }
        },
      },
      no: {
        icon: `<i class="fas fa-times" id="no-icon-${id}"></i>`,
        label: game.i18n.localize('WFRP4NPCGEN.common.button.Cancel'),
      },
    };
    if (previousCallback != null) {
      buttons.undo = {
        icon: `<i class="fas fa-undo" id="undo-icon-${id}"></i>`,
        label: game.i18n.localize('WFRP4NPCGEN.common.button.Undo'),
        callback: (html: JQuery) => {
          previousCallback(html);
        },
      };
    }
    return buttons;
  }

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
    options: { [key: string]: string },
    initValue?: string
  ): string {
    const finalInitValue =
      initValue != null && Object.keys(options).includes(initValue)
        ? initValue
        : '';
    return `
        <select id="${id}" value="${finalInitValue}">
            ${Object.entries(options).map(([key, value]) => {
              const selected =
                finalInitValue === key ? ' selected="selected"' : '';
              return `<option${selected} id="${id}-${key}" value="${key}">${value}</option>`;
            })}
        </select>
        `;
  }

  public static getInputScript(
    id: string,
    type = 'text',
    initValue: string | number = null as any,
    name = id,
    onInput: string = null as any,
    dataListId: string = null as any,
    options: string[] = null as any
  ): string {
    const hasDataList = dataListId != null && options?.length > 0;
    const onInputStr = onInput != null ? ` oninput="${onInput}"` : '';
    const inputListId = hasDataList ? ` list="${dataListId}"` : '';
    const initValueStr = initValue != null ? ` value=${initValue}` : '';
    const input = `
        <input${onInputStr}${inputListId} type="${type}" id="${id}" name="${name}"${initValueStr}/>
      `;
    const dataList = hasDataList
      ? `
    <datalist id="${dataListId}">
    ${options.map((val) => `<option value="${val}"></option>`)}
    </datalist>
    `
      : '';

    return `
          ${input}
          ${dataList}
          `;
  }

  /*
    <input oninput="check()" list="select-career-list-${dialogId}" type="text" id="select-career-${dialogId}" name="select-career" />
                <datalist id="select-career-list-${dialogId}">
                   ${careers.map((c) => `<option value="${c.name}"></option>`)}
                </datalist>
     */
}
