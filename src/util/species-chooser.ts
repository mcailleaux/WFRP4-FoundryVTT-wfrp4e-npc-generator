import RandomUtil from './random-util.js';
import DialogUtil from './dialog-util.js';

export default class SpeciesChooser {
  public static getSpeciesMap(): { [key: string]: string } {
    return game.wfrp4e.config.species;
  }

  public static async selectSpecies(
    initSpeciesKey: string,
    callback: (speciesKey: string, speciesValue: string) => void
  ) {
    const dialogId = new Date().getTime();
    const speciesMap = this.getSpeciesMap();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.species.select.title'),
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
                `select-species-${dialogId}`,
                speciesMap,
                initSpeciesKey
              )}
              </div>
          </form>
          <script>  
              function random() {
                  const speciesKeys = [${Object.keys(speciesMap)
                    .map((key) => `"${key}"`)
                    .join(',')}];
                  const randomSpeciesKey = getRandomValue(speciesKeys);
                  if (randomSpeciesKey != null) {
                      document.getElementById('select-species-${dialogId}').value = randomSpeciesKey;
                  }
              }
              
              ${RandomUtil.getRandomValueScript()}
                
            </script>
`,
      buttons: DialogUtil.getDialogButtons(dialogId, (html: JQuery) => {
        const speciesKey = <string>(
          html.find(`#select-species-${dialogId}`).val()
        );
        const speciesValue = speciesMap[speciesKey];
        callback(speciesKey, speciesValue);
      }),
      default: 'yes',
    }).render(true);
  }
}
