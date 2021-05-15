import DialogUtil from './dialog-util.js';
import ReferentialUtil from './referential-util.js';
import EntityUtil from './entity-util.js';

export default class TrappingChooser {
  public static async selectTrappings(
    initTrappings: Item.Data[],
    callback: (trappings: Item.Data[]) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const trappings = [
      ...(await ReferentialUtil.getTrappingEntities(true)).map((t) => t.data),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const trappingsMap: { [group: string]: Item.Data[] } = {};
    for (let trapping of trappings) {
      const type = (<any>trapping.data)?.trappingType?.value ?? trapping.type;
      const categorie = game.wfrp4e.config.trappingCategories[type];
      if (trappingsMap[categorie] == null) {
        trappingsMap[categorie] = [];
      }
      trappingsMap[categorie].push(trapping);
    }

    const trappingsCategorieEntries = Object.entries(
      <{ [key: string]: string }>game.wfrp4e.config.trappingCategories
    );

    const trappingsSortList = [
      'weapon',
      'ammunition',
      'armour',
      'container',
      'clothingAccessories',
      'foodAndDrink',
      'toolsAndKits',
      'booksAndDocuments',
      'tradeTools',
      'drugsPoisonsHerbsDraughts',
      'misc',
      'ingredient',
      'money',
      'others',
    ];

    const trappingsSort = (
      a: [groupKey: string, group: { [key: string]: string }],
      b: [groupKey: string, group: { [key: string]: string }]
    ) => {
      const g1 = a[0];
      const g2 = b[0];
      const entry1 = trappingsCategorieEntries?.find(
        ([_key, value]) => value === g1
      );
      const entry2 = trappingsCategorieEntries?.find(
        ([_key, value]) => value === g2
      );
      const key1 = entry1 != null ? entry1[0] : 'others';
      const key2 = entry2 != null ? entry2[0] : 'others';

      return trappingsSortList.indexOf(key1) - trappingsSortList.indexOf(key2);
    };

    const trappingsId = `creature-add-remove-trappings-${dialogId}`;

    new Dialog(
      {
        title: game.i18n.localize('WFRP4NPCGEN.select.trappings.title'),
        content: `<form>
            <div class="form-group">
          ${DialogUtil.getSelectAddRemoveScript({
            id: trappingsId,
            captions: `
            ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.select.trappings.quantity.label',
              'max-width: 80px;'
            )}
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            optionGroups: EntityUtil.toSelectOptionGroup(trappingsMap),
            sort: trappingsSort,
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
      },
      {
        resizable: true,
        classes: ['dialog', 'wfrp4e-npc-generator-dialog'],
      }
    ).render(true);
  }
}
