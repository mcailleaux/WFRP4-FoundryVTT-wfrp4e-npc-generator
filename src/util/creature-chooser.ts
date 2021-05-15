import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';

export default class CreatureChooser {
  public static async selectCreature(
    initCreature: string,
    callback: (creature: Actor.Data) => void
  ) {
    const dialogId = new Date().getTime();
    const creatures = await ReferentialUtil.getBestiaryEntities();
    const creaturesMap: { [group: string]: { [key: string]: string } } = {};
    const allCreaturesMap: { [key: string]: string } = {};
    const allCreaturesImgs: { _id: string; img: string }[] = [];
    for (let [groupeKey, actors] of Object.entries(creatures)) {
      creaturesMap[groupeKey] = {};
      for (let actor of actors) {
        creaturesMap[groupeKey][actor._id] = actor.name;
        allCreaturesMap[actor._id] = actor.name;
        allCreaturesImgs.push({
          _id: actor._id,
          img: actor.img,
        });
      }
    }

    new Dialog(
      {
        title: game.i18n.localize('WFRP4NPCGEN.creatures.select.title'),
        content: `<form>
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
                initCreature,
                'change()'
              )}
              </div>
              <div class="form-group">
                <img style="object-fit: contain;" id="selected-creature-img-${dialogId}" alt="" src="" width="200" height="200"/>
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
          let creature = null;
          for (let [_groupeKey, actors] of Object.entries(creatures)) {
            if (creature == null) {
              creature = actors.find((c) => c._id === creaturesKey);
            }
          }
          if (creature != null) {
            callback(creature?.data);
          }
        }),
        default: 'yes',
      },
      {
        resizable: true,
      }
    ).render(true);
  }
}
