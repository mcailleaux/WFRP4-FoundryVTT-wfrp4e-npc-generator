import DialogUtil from './dialog-util.js';
import ReferentialUtil from './referential-util.js';
import StringUtil from './string-util.js';
import EntityUtil from './entity-util.js';

export default class TrappingChooser {
  public static async selectTrappings(
    initTrappings: Item.Data[],
    callback: (trappings: Item.Data[]) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const initTrappingsNames = initTrappings.map((t) => t.name);
    const trappings = [
      ...initTrappings,
      ...(await ReferentialUtil.getTrappingEntities(true))
        .filter((t) => {
          return !StringUtil.arrayIncludesDeburrIgnoreCase(
            initTrappingsNames,
            t.name
          );
        })
        .map((t) => t.data),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const trappingsId = `creature-add-remove-trappings-${dialogId}`;

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.select.trappings.title'),
      content: `<form>
            <div class="form-group">
          ${DialogUtil.getSelectAddRemoveScript({
            id: trappingsId,
            captions: `
            ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.creatures.trappings.select.quantity.label',
              'max-width: 80px;'
            )}
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            options: EntityUtil.toSelectOption(trappings),
            initValues: initTrappings?.map((s: Item.Data & any) => {
              return {
                key: s._id,
                value: s.displayName ?? s.name,
                count: s.data.quantity.value,
              };
            }),
            withCount: true,
            initCount: 1,
          })}
          </div>
          </form>
          <script>  
              
              ${DialogUtil.getAddRemoveElementScript()}
                
            </script>
            `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const resultTrappings: Item.Data[] = [];
          html.find(`.${trappingsId}`).each((_i, r: HTMLInputElement) => {
            const id = r.id;
            const key = r.value;
            let count = 0;
            html.find(`#${id}-count`).each((_i1, r1: HTMLInputElement) => {
              count = Number(r1.value);
            });
            const trapping = <Item.Data & any>(
              trappings.find((t) => t._id === key)
            );
            trapping.data.quantity.value = count;
            resultTrappings.push(trapping);
          });
          callback(resultTrappings);
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
