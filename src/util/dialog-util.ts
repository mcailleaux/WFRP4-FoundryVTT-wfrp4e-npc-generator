import { GenerateEffectOptionEnum } from './generate-effect-option.enum.js';

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

  public static getLabelScript(
    label: string,
    style: string = null as any
  ): string {
    const styleStr = style != null ? ` style="${style}"` : '';
    return `
        <label${styleStr}>
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
              return `<option${selected} id="${id}-${key}" value="${key}">${game.i18n.localize(
                value
              )}</option>`;
            })}
        </select>
        `;
  }

  public static getInputScript(options: {
    id: string;
    type: string;
    initValue?: string | number | boolean;
    name?: string;
    onInput?: string;
    onClick?: string;
    dataListId?: string;
    options?: string[];
    classes?: string;
    style?: string;
    checked?: boolean;
  }): string {
    const hasDataList =
      options?.dataListId != null &&
      options?.options != null &&
      options?.options?.length > 0;
    const onInputStr =
      options?.onInput != null ? ` oninput="${options.onInput}"` : '';
    const onClickStr =
      options?.onClick != null ? ` onclick="${options.onClick}"` : '';
    const inputListId = hasDataList ? ` list="${options.dataListId}"` : '';
    const initValueStr =
      options?.initValue != null ? ` value="${options.initValue}"` : '';
    const styleStr = options?.style != null ? ` style="${options.style}"` : '';
    const classesStr =
      options?.classes != null ? ` class="${options.classes}"` : '';
    const checkedStr = options?.checked ? ' checked' : '';
    const input = `
        <input${onInputStr}${onClickStr}${inputListId}${styleStr}${classesStr}${checkedStr}${initValueStr} type="${options?.type}" id="${options?.id}" name="${options?.name}" />
      `;
    const dataList = hasDataList
      ? `
    <datalist id="${options?.dataListId}">
    ${options?.options
      ?.map((val) => `<option value="${val}"></option>`)
      .join('')}
    </datalist>
    `
      : '';

    return `
          ${input}
          ${dataList}
          `;
  }

  public static getToArrayScript(): string {
    return `
        function toArray(obj) {
           const array = [];
           for (let i = 0; i < obj.length; i++) { 
              array[i] = obj[i];
           }
           return array;
        }
    `;
  }

  public static getNameRandomScript(): string {
    return `
        function generateName(speciesKey) {
            const nameGen = game.wfrp4e.names;
            return nameGen.generateName({ species: speciesKey });
        }
    `;
  }

  public static getEffectSelectScript(
    dialogId: number,
    id: string,
    initValue: GenerateEffectOptionEnum
  ): string {
    return this.getSelectScript(
      `${id}-${dialogId}`,
      {
        [GenerateEffectOptionEnum.NONE]: `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.NONE}`,
        [GenerateEffectOptionEnum.DEFAULT_DISABLED]: `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_DISABLED}`,
        [GenerateEffectOptionEnum.DEFAULT_ENABLED]: `WFRP4NPCGEN.options.effects.${GenerateEffectOptionEnum.DEFAULT_ENABLED}`,
      },
      initValue
    );
  }

  public static getFilePickerButton(target: string, type: string): string {
    return `
        <button onclick="FilePicker.fromButton(this).browse()" type="button" class="file-picker" data-type="${type}" data-target="${target}" id="file-picker-${target}" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
    `;
  }
}
