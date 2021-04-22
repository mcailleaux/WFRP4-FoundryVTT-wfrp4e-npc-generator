import RandomUtil from './random-util.js';
import DialogUtil from './dialog-util.js';

export default class SpeciesChooser {
  public static getSpeciesMap(): { [key: string]: string } {
    return game.wfrp4e.config.species;
  }

  public static async selectSpecies(
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
              <label>
                  ${game.i18n.localize(
                    'WFRP4NPCGEN.species.select.label'
                  )}          
              </label> 
              <select id="select-species-${dialogId}">
              ${Object.entries(speciesMap).map(
                ([key, value]) => `<option value="${key}">${value}</option>`
              )}
              </select>
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
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize('WFRP4NPCGEN.common.button.OK'),

          callback: (html: JQuery) => {
            const speciesKey = <string>(
              html.find(`#select-species-${dialogId}`).val()
            );
            const speciesValue = speciesMap[speciesKey];
            callback(speciesKey, speciesValue);
          },
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize('WFRP4NPCGEN.common.button.Cancel'),
        },
      },
      default: 'yes',
    }).render(true);
  }
}
