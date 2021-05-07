import ReferentialUtil from './referential-util.js';
import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';

export default class CreatureChooser {
  public static async selectCreature(
    initCreature: string,
    callback: (creature: Actor.Data) => void
  ) {
    const dialogId = new Date().getTime();
    const creatures = await ReferentialUtil.getBestiaryEntities(true);
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
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.species.select.label')}
              ${DialogUtil.getSelectScript(
                `select-creatures-${dialogId}`,
                creaturesMap,
                initCreature
              )}
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
                  }
              }
              
              ${RandomUtil.getRandomValueScript()}
                
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