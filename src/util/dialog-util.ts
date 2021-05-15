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
    initValue?: string,
    onChange?: string,
    style: string = null as any
  ): string {
    const styleStr = style != null ? ` style="${style}"` : '';
    const finalInitValue =
      initValue != null && Object.keys(options).includes(initValue)
        ? initValue
        : '';
    const onChangeStr = onChange != null ? ` onchange="${onChange}"` : '';
    return `
        <select${styleStr} id="${id}" value="${finalInitValue}"${onChangeStr}>
            ${Object.entries(options)
              .map(([key, value]) => {
                const selected =
                  finalInitValue === key ? ' selected="selected"' : '';
                return `<option${selected} id="${id}-${key}" value="${key}">${game.i18n.localize(
                  value
                )}</option>`;
              })
              .join('')}
        </select>
        `;
  }

  public static getSelectOptGrpScript(
    id: string,
    options: { [group: string]: { [key: string]: string } },
    sort?: (
      a: [groupKey: string, group: { [key: string]: string }],
      b: [groupKey: string, group: { [key: string]: string }]
    ) => number,
    initValue?: string,
    onChange?: string,
    style: string = null as any
  ): string {
    const styleStr = style != null ? ` style="${style}"` : '';
    let finalInitValue = '';
    for (let group of Object.values(options)) {
      if (finalInitValue.length === 0) {
        finalInitValue =
          initValue != null && Object.keys(group).includes(initValue)
            ? initValue
            : '';
      }
    }
    const onChangeStr = onChange != null ? ` onchange="${onChange}"` : '';
    return `
        <select${styleStr} id="${id}" value="${finalInitValue}"${onChangeStr}>
            ${Object.entries(options)
              .sort((a, b) => (sort != null ? sort(a, b) : 0))
              .map(([groupKey, group]) => {
                return `<optgroup label="${groupKey}">
                ${Object.entries(group)
                  .map(([key, value]) => {
                    const selected =
                      finalInitValue === key ? ' selected="selected"' : '';
                    return `<option${selected} id="${id}-${key}" value="${key}">${game.i18n.localize(
                      value
                    )}</option>`;
                  })
                  .join('')}
              </optgroup>`;
              })
              .join('')}
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
    outerDataListId?: string;
    dataListId?: string;
    options?: string[];
    classes?: string;
    style?: string;
    checked?: boolean;
  }): string {
    const idStr =
      options?.id != null && options?.id?.length > 0
        ? ` id="${options?.id}"`
        : '';
    const hasDataList =
      options?.dataListId != null &&
      options?.options != null &&
      options?.options?.length > 0;
    const onInputStr =
      options?.onInput != null ? ` oninput="${options.onInput}"` : '';
    const onClickStr =
      options?.onClick != null ? ` onclick="${options.onClick}"` : '';
    const inputListId = hasDataList ? ` list="${options.dataListId}"` : '';
    const outerInputListId =
      options?.outerDataListId != null
        ? ` list="${options.outerDataListId}"`
        : '';
    const initValueStr =
      options?.initValue != null ? ` value="${options.initValue}"` : '';
    const styleStr = options?.style != null ? ` style="${options.style}"` : '';
    const classesStr =
      options?.classes != null ? ` class="${options.classes}"` : '';
    const checkedStr = options?.checked ? ' checked' : '';
    const input = `
        <input${onInputStr}${onClickStr}${inputListId}${outerInputListId}${styleStr}${classesStr}${checkedStr}${initValueStr}${idStr} type="${options?.type}" name="${options?.name}" />
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
        <button onclick="browse(event, this)" type="button" class="file-picker" data-type="${type}" data-target="${target}" id="file-picker-${target}" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
    `;
  }

  public static browseFileScript(): string {
    return `
        function browse(event, button) {
          event.preventDefault();
          FilePicker.fromButton(button).browse();
        }
    `;
  }

  public static getSelectAddRemoveScript(options: {
    id: string;
    initValues: {
      key: string;
      value: string;
      check?: boolean;
      count?: number;
    }[];
    options?: { [key: string]: string };
    optionGroups?: { [group: string]: { [key: string]: string } };
    sort?: (
      a: [groupKey: string, group: { [key: string]: string }],
      b: [groupKey: string, group: { [key: string]: string }]
    ) => number;
    title?: string;
    captions?: string;
    withCheck?: boolean;
    withCount?: boolean;
    initCount?: number;
  }): string {
    const flexRow =
      'display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;';
    const flexColumn =
      'display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch;';
    return `
      <div style="${flexColumn}">
        ${options.title != null ? this.getLabelScript(options.title) : ''}
        <div style="${flexRow}">
        ${
          options.optionGroups != null
            ? this.getSelectOptGrpScript(
                options.id,
                options.optionGroups,
                options.sort,
                undefined,
                undefined,
                'width: 100%;'
              )
            : options.options != null
            ? this.getSelectScript(
                options.id,
                options.options,
                undefined,
                undefined,
                'width: 100%;'
              )
            : ''
        }
        <button
          value="${options.id}"
          style="max-width: 32px;"
          type="button"
          onclick="addElement('${options.id}', ${
      options.withCheck != null && options.withCheck
    }, ${options.withCount != null && options.withCount}, ${
      options.initCount ?? 0
    })"
        >
          <i style="pointer-events: none;" class="fas fa-plus"></i>
        </button>
        </div>
      <div id="${options.id}-removables" style="${flexColumn}">
        
            ${
              options.captions != null
                ? `
            <div style="${flexRow}">
                ${options.captions}
            </div>
            `
                : ''
            }
        
        ${options.initValues
          .map(
            (item) => `
        ${this.getRemovableItemScript({
          id: options.id,
          item: item,
          withCheck: options.withCheck,
          withCount: options.withCount,
        })}
        `
          )
          .join('')}
      </div>
      </div>
    `;
  }

  public static getRemovableItemScript(options: {
    id: string;
    item: { key: string; value: string; check?: boolean; count?: number };
    withCheck?: boolean;
    withCount?: boolean;
  }) {
    const flexRow =
      'display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;';
    return `
        <div id="${options.id}-${
      options.item.key
    }-removable" style="${flexRow}">
            ${this.getLabelScript(options.item.value)}
            ${this.getInputScript({
              id: `${options.id}-${options.item.key}`,
              type: 'hidden',
              initValue: options.item.key,
              classes: options.id,
            })}
            ${
              options.withCheck
                ? this.getInputScript({
                    id: `${options.id}-${options.item.key}-check`,
                    type: 'checkbox',
                    checked: options.item.check,
                    classes: `${options.id}-check`,
                    style: 'min-width: 60px; max-width: 60px;',
                  })
                : ''
            }
            ${
              options.withCount
                ? this.getInputScript({
                    id: `${options.id}-${options.item.key}-count`,
                    type: 'number',
                    initValue: options.item.count,
                    classes: `${options.id}-count`,
                    style: 'min-width: 80px; max-width: 80px;',
                  })
                : ''
            }
            <button
              value="${options.item.key}"
              style="max-width: 32px;"
              type="button"
              onclick="removeElement('${options.id}', '${options.item.key}')"
            >
              <i style="pointer-events: none;" class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
  }

  public static getAddRemoveElementScript(): string {
    return `
        function addElement(id, withCheck, withCount, initCount) {
            const select = document.getElementById(id);
            const key = select.value;
            const value = select.querySelector('option[value="' + key + '"]').innerHTML;
            
            const idDiv = id + '-' + key + '-removable'; 
            
            if (document.getElementById(idDiv) != null) {
                return ;
            }
            
            const div = document.createElement('div');
            div.id = idDiv;
            div.style.display = 'flex';
            div.style.flexDirection = 'row';
            div.style.alignItems = 'stretch';
            div.style.justifyContent = 'space-between';
            const label = document.createElement('label');
            label.innerHTML = value;
            const input = document.createElement('input');
            input.id = id + '-' + key;
            input.type = 'hidden';
            input.value = key;
            input.classList.add(id);
            let inputCheck = null;
            if (withCheck) {
                inputCheck = document.createElement('input');
                inputCheck.id = id + '-' + key + '-check';
                inputCheck.type = 'checkbox';
                inputCheck.checked = true;
                inputCheck.classList.add(id + '-check');
                inputCheck.style.maxWidth = '60px';
                inputCheck.style.minWidth = '60px';
            }
            let inputCount = null;
            if (withCount) {
                inputCount = document.createElement('input');
                inputCount.id = id + '-' + key + '-count';
                inputCount.type = 'number';
                inputCount.value = initCount;
                inputCount.classList.add(id + '-count');
                inputCount.style.maxWidth = '80px';
                inputCount.style.minWidth = '80px';
            }
            const button = document.createElement('button');
            button.value = key;
            button.style.maxWidth = '32px';
            button.type = 'button';
            button.setAttribute('onclick', 'removeElement(\\'' + id + '\\', \\'' + key + '\\')');
            const icon = document.createElement('i');
            icon.style.pointerEvents = 'none';
            icon.classList.add('fa');
            icon.classList.add('fa-trash-alt');
            
            button.append(icon);
            div.append(label);
            div.append(input);
            if (inputCheck != null) {
                div.append(inputCheck);
            }
            if (inputCount != null) {
                div.append(inputCount);
            }
            div.append(button);
            
            document.getElementById(id + '-removables').append(div);
            
        }
        
        function removeElement(id, key) {
          const removables = document.getElementById(id + '-removables');
          const div = document.getElementById(id + '-' + key + '-removable');
          removables.removeChild(div);
        }
    `;
  }
}
