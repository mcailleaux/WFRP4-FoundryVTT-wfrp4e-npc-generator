import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import EntityUtil from './entity-util.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { i18n } from '../constant.js';

export default class MutationsChooser {
  public static async selectMutations(
    initPhysicals: ItemData[],
    initMentals: ItemData[],
    callback: (physicals: ItemData[], mentals: ItemData[]) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const physicals = [
      ...(await ReferentialUtil.getPhysicalMutationEntities(true)).map(
        (t) => t.data
      ),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const mentals = [
      ...(await ReferentialUtil.getMentalMutationEntities(true)).map(
        (t) => t.data
      ),
    ].sort((t1, t2) => {
      return t1.name.localeCompare(t2.name);
    });

    const physicalsId = `creature-add-remove-physicals-${dialogId}`;
    const mentalsId = `creature-add-remove-mentals-${dialogId}`;

    new Dialog(
      {
        title: i18n().localize('WFRP4NPCGEN.select.mutations.title'),
        content: `<form>
            <div class="form-group">
            ${DialogUtil.getSelectAddRemoveScript({
              id: physicalsId,
              title: 'WFRP4NPCGEN.select.mutations.physicals.title',
              captions: `
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.name.select.label'
            )}           
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
              options: EntityUtil.toSelectOption(physicals),
              initValues: initPhysicals?.map((s: ItemData & any) => {
                return {
                  key: s._id,
                  value: s.displayName ?? s.name,
                };
              }),
            })}
          </div>
          <div class="form-group">
          ${DialogUtil.getSelectAddRemoveScript({
            id: mentalsId,
            title: 'WFRP4NPCGEN.select.mutations.mentals.title',
            captions: `
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.name.select.label'
            )}           
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            options: EntityUtil.toSelectOption(mentals),
            initValues: initMentals?.map((s: ItemData & any) => {
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
            const resultPhysicals: ItemData[] = [];
            html.find(`.${physicalsId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;

              const physical = <ItemData & any>(
                physicals.find((t) => t._id === key)
              );
              resultPhysicals.push(physical);
            });

            const resultMentals: ItemData[] = [];
            html.find(`.${mentalsId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;

              const mental = <ItemData & any>mentals.find((t) => t._id === key);
              resultMentals.push(mental);
            });
            callback(resultPhysicals, resultMentals);
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
