import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import EntityUtil from './entity-util.js';
import StringUtil from './string-util.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { i18n, wfrp4e } from '../constant.js';

export default class MagicsChooser {
  public static async selectMagics(
    initSpells: ItemData[],
    initPrayers: ItemData[],
    callback: (spells: ItemData[], prayers: ItemData[]) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const spells = [
      ...(await ReferentialUtil.getSpellEntities(true)).map((t) => t.data),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const spellsMap: { [group: string]: ItemData[] } = {};
    for (let spell of spells) {
      const lore = StringUtil.toDeburrLowerCase(
        (<any>spell.data)?.lore?.value ?? ''
      );
      const loreLabel =
        lore == null || lore?.trim() == ''
          ? i18n.localize('WFRP4NPCGEN.select.magics.no.lore.label')
          : wfrp4e.config.magicLores[lore] ??
            wfrp4e.config.magicLores[this.getCorrectedLore(lore)] ??
            this.getCorrectedLore(lore);
      if (spellsMap[loreLabel] == null) {
        spellsMap[loreLabel] = [];
      }
      spellsMap[loreLabel].push(spell);
    }

    const spellsLoreEntries = Object.entries(
      <{ [key: string]: string }>wfrp4e.config.magicLores
    );
    spellsLoreEntries.push(['undivided', 'Chaos']);
    spellsLoreEntries.push(['warp', 'Skaven']);
    spellsLoreEntries.push([
      'none',
      i18n.localize('WFRP4NPCGEN.select.magics.no.lore.label'),
    ]);

    const spellsLoreSortList = [
      'petty',
      'none',
      'beasts',
      'heavens',
      'fire',
      'light',
      'metal',
      'death',
      'shadow',
      'life',
      'hedgecraft',
      'witchcraft',
      'daemonology',
      'necromancy',
      'undivided',
      'nurgle',
      'slaanesh',
      'tzeentch',
      'warp',
      'others',
    ];

    const spellsSort = (
      a: [groupKey: string, group: { [key: string]: string }],
      b: [groupKey: string, group: { [key: string]: string }]
    ) => {
      const g1 = a[0];
      const g2 = b[0];
      const entry1 = spellsLoreEntries?.find(([_key, value]) => value === g1);
      const entry2 = spellsLoreEntries?.find(([_key, value]) => value === g2);
      const key1 = entry1 != null ? entry1[0] : 'others';
      const key2 = entry2 != null ? entry2[0] : 'others';

      return (
        spellsLoreSortList.indexOf(key1) - spellsLoreSortList.indexOf(key2)
      );
    };

    const prayers = [
      ...(await ReferentialUtil.getPrayerEntities(true)).map((t) => t.data),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const prayersMap: { [group: string]: ItemData[] } = {};
    for (let prayer of prayers) {
      const type = (<any>prayer.data)?.type?.value;
      const god = (<any>prayer.data)?.god?.value;
      const key =
        type === 'blessing'
          ? wfrp4e.config.prayerTypes[type]
          : `${wfrp4e.config.prayerTypes[type]} - ${god}`;
      if (prayersMap[key] == null) {
        prayersMap[key] = [];
      }
      prayersMap[key].push(prayer);
    }

    const prayersGodSortList = [
      `${wfrp4e.config.prayerTypes.blessing}`,
      `${wfrp4e.config.prayerTypes.miracle} - Manann`,
      `${wfrp4e.config.prayerTypes.miracle} - Morr`,
      `${wfrp4e.config.prayerTypes.miracle} - Myrmidia`,
      `${wfrp4e.config.prayerTypes.miracle} - Ranald`,
      `${wfrp4e.config.prayerTypes.miracle} - Rhya`,
      `${wfrp4e.config.prayerTypes.miracle} - Shallya`,
      `${wfrp4e.config.prayerTypes.miracle} - Sigmar`,
      `${wfrp4e.config.prayerTypes.miracle} - Taal`,
      `${wfrp4e.config.prayerTypes.miracle} - Ulric`,
      `${wfrp4e.config.prayerTypes.miracle} - Verena`,
    ];

    const prayersSort = (
      a: [groupKey: string, group: { [key: string]: string }],
      b: [groupKey: string, group: { [key: string]: string }]
    ) => {
      const g1 = a[0];
      const g2 = b[0];

      return prayersGodSortList.indexOf(g1) - prayersGodSortList.indexOf(g2);
    };

    const spellsId = `creature-add-remove-spells-${dialogId}`;
    const prayersId = `creature-add-remove-prayers-${dialogId}`;

    new Dialog(
      {
        title: i18n.localize('WFRP4NPCGEN.select.magics.title'),
        content: `<form>
            <div class="form-group">
            ${DialogUtil.getSelectAddRemoveScript({
              id: spellsId,
              title: 'WFRP4NPCGEN.select.spells.title',
              captions: `
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.name.select.label'
            )}           
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
              optionGroups: EntityUtil.toSelectOptionGroup(spellsMap),
              sort: spellsSort,
              initValues: initSpells?.map((s: ItemData & any) => {
                return {
                  key: s._id,
                  value: s.displayName ?? s.name,
                };
              }),
            })}
          </div>
          <div class="form-group">
          ${DialogUtil.getSelectAddRemoveScript({
            id: prayersId,
            title: 'WFRP4NPCGEN.select.prayers.title',
            captions: `
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.name.select.label'
            )}           
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            optionGroups: EntityUtil.toSelectOptionGroup(prayersMap),
            sort: prayersSort,
            initValues: initPrayers?.map((s: ItemData & any) => {
              return {
                key: s._id,
                value: s.displayName ?? s.name,
              };
            }),
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
            const resultSpells: ItemData[] = [];
            html.find(`.${spellsId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;

              const spell = <ItemData & any>spells.find((t) => t._id === key);
              resultSpells.push(spell);
            });

            const resultPrayers: ItemData[] = [];
            html.find(`.${prayersId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;

              const prayer = <ItemData & any>prayers.find((t) => t._id === key);
              resultPrayers.push(prayer);
            });
            callback(resultSpells, resultPrayers);
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

  private static getCorrectedLore(lore: string): string {
    switch (lore) {
      case 'minor':
        return 'petty';
      case 'shadows':
        return 'shadow';
      case 'undivided':
        return 'Chaos';
      case 'warp':
        return 'Skaven';
      default:
        return lore;
    }
  }
}
