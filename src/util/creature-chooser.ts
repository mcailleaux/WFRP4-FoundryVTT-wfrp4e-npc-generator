import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';
import { i18n } from '../constant.js';

export default class CreatureChooser {
  public static async selectCreature(
    initCreature: string,
    callback: (creature: Actor) => void
  ) {
    const dialogId = new Date().getTime();
    const creatures = await ReferentialUtil.getBestiaryEntities();
    const creaturesMap: { [group: string]: { [key: string]: string } } = {};
    const allCreaturesMap: { [key: string]: string } = {};
    const allCreaturesImgs: { _id: string; img: string }[] = [];
    for (let [groupeKey, actors] of Object.entries(creatures)) {
      creaturesMap[groupeKey] = {};
      for (let actor of actors) {
        const id: string = actor.id ?? '';
        creaturesMap[groupeKey][id] = actor.name ?? '';
        allCreaturesMap[id] = actor.name ?? '';
        allCreaturesImgs.push({
          _id: id,
          img: actor.img ?? '',
        });
      }
    }

    new Dialog(
      {
        title: i18n().localize('WFRP4NPCGEN.creatures.select.title'),
        content: `<form class="creature-chooser">
              <div class="form-group">
              ${DialogUtil.getButtonScript(
                'WFRP4NPCGEN.common.button.Random',
                'random()'
              )}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.creatures.select.label')}
              ${DialogUtil.getSelectOptGrpScript(
                `select-creatures-${dialogId}`,
                creaturesMap,
                undefined,
                initCreature,
                'change()'
              )}
              </div>
              <div class="form-group creature-chooser-img">
                <img id="selected-creature-img-${dialogId}" alt="" src=""/>
              </div>
          </form>
          <script>  
              function random() {
                  const creaturesKeys = [${Object.keys(allCreaturesMap)
                    .map((key) => `"${key}"`)
                    .join(',')}];
                  const randomCreaturesKey = getRandomValue(creaturesKeys);
                  if (randomCreaturesKey != null) {
                      document.getElementById('select-creatures-${dialogId}').value = randomCreaturesKey;
                      change();
                  }
              }
              
              ${RandomUtil.getRandomValueScript()}
              
              function change() {
                  const creaturesImg = [${allCreaturesImgs
                    .map((c) => {
                      return `{ key: "${c._id}", img: "${c.img}" }`;
                    })
                    .join(',')}];
                  const creatureKey = document.getElementById('select-creatures-${dialogId}').value;
                  const imgElm = document.getElementById('selected-creature-img-${dialogId}');
                  if (creatureKey != null) {
                      imgElm.src = creaturesImg.find((c) => c.key === creatureKey).img + '?' + new Date().getTime();
                  } else {
                      imgElm.src = '';
                  }
              }
              
              change();
                
            </script>          
            `,
        buttons: DialogUtil.getDialogButtons(dialogId, (html: JQuery) => {
          const creaturesKey = <string>(
            html.find(`#select-creatures-${dialogId}`).val()
          );
          let creature: Actor | null = null;
          for (let [_groupeKey, actors] of Object.entries(creatures)) {
            if (creature == null) {
              creature = actors.find((c) => c.id === creaturesKey) ?? null;
            }
          }
          if (creature != null) {
            callback(creature);
          }
        }),
        default: 'yes',
      },
      {
        resizable: true,
        classes: [
          'dialog',
          'wfrp4e-npc-generator-dialog',
          'wfrp4e-npc-generator-dialog-creature-chooser',
        ],
      }
    ).render(true);
  }
}
