import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';

export default class CreatureChooser {
  public static async selectCreature(
    initCreature: string,
    callback: (creature: Actor.Data) => void
  ) {
    const dialogId = new Date().getTime();
    const creatures = (await ReferentialUtil.getBestiaryEntities()).sort(
      (c1, c2) => {
        return c1.name.localeCompare(c2.name);
      }
    );
    const creaturesMap: { [key: string]: string } = {};
    for (let c of creatures) {
      creaturesMap[c._id] = c.name;
    }

    new Dialog({
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
              ${DialogUtil.getSelectScript(
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
                  const creaturesKeys = [${Object.keys(creaturesMap)
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
                  const creaturesImg = [${creatures
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
        const creature = creatures.find((c) => c._id === creaturesKey);
        if (creature != null) {
          callback(creature?.data);
        }
      }),
      default: 'yes',
    }).render(true);
  }
}
