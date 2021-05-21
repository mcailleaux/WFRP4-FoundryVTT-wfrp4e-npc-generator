import RandomUtil from './random-util.js';
import DialogUtil from './dialog-util.js';
import ReferentialUtil from './referential-util.js';

export default class SpeciesChooser {
  public static async selectSpecies(
    initSpeciesKey: string,
    initSubSpeciesKey: string,
    callback: (speciesKey: string, speciesValue: string) => void
  ) {
    const dialogId = new Date().getTime();
    const speciesMap = ReferentialUtil.getSpeciesMap();
    const defaultSpeciesKey = initSpeciesKey != null ? initSpeciesKey : 'human';
    const initSubSpeciesMap = ReferentialUtil.getSpeciesSubSpeciesMap(
      defaultSpeciesKey
    );

    const initSubSpeciesLabelsMap: { [key: string]: string } =
      initSubSpeciesMap != null ? {} : {};
    if (initSubSpeciesMap != null && initSubSpeciesLabelsMap != null) {
      for (let [key, value] of Object.entries(initSubSpeciesMap)) {
        initSubSpeciesLabelsMap[key] = value.name;
      }
    }

    const initSubSpeciesClass =
      initSubSpeciesMap != null ? '' : 'select-subspecies-no-subspecies';

    new Dialog(
      {
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
                initSpeciesKey,
                'speciesChange()'
              )}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.subspecies.select.label'
              )}
              ${DialogUtil.getSelectScript(
                `select-subspecies-${dialogId}`,
                initSubSpeciesLabelsMap,
                initSubSpeciesKey,
                undefined,
                initSubSpeciesClass
              )}
              </div>
          </form>
          <script>  
          
                function speciesChange() {
                  const subSpecies = \{
                      ${Object.entries(ReferentialUtil.getSubSpeciesMap())
                        .map(
                          ([key, value]) =>
                            `"${key}": {${Object.entries(value)
                              .map(
                                ([subKey, subValue]) =>
                                  `"${subKey}": "${game.i18n.localize(
                                    subValue.name
                                  )}"`
                              )
                              .join(',')}}`
                        )
                        .join(',')}
                  \};
                  
                  
                  const speciesKey = document.getElementById('select-species-${dialogId}').value;
                  const selectSubSpecies = document.getElementById('select-subspecies-${dialogId}');
                  selectSubSpecies.value = null;
                  selectSubSpecies.innerHTML = '';
                  
                  if (subSpecies[speciesKey] != null) {
                      for(let [key, value] of Object.entries(subSpecies[speciesKey])) {
                          
                          const option = document.createElement('option');
                          
                          if (selectSubSpecies.value == null) {
                              option.setAttribute('selected', 'selected');
                              selectSubSpecies.value = key;
                          }
                          
                          option.setAttribute('id', 'select-subspecies-${dialogId}-' + key);
                          option.setAttribute('value', key);
                          option.innerHTML = value;
                          
                          selectSubSpecies.append(option);
                          
                      }
                     selectSubSpecies.classList.remove('select-subspecies-no-subspecies');
                  } else {
                     selectSubSpecies.classList.add('select-subspecies-no-subspecies'); 
                  }
                  
              }
          
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
            <style>
            .select-subspecies-no-subspecies {
                display: none;
            }
            </style>
            `,
        buttons: DialogUtil.getDialogButtons(dialogId, (html: JQuery) => {
          const speciesKey = <string>(
            html.find(`#select-species-${dialogId}`).val()
          );
          const speciesValue = speciesMap[speciesKey];
          callback(speciesKey, speciesValue);
        }),
        default: 'yes',
      },
      {
        resizable: true,
        classes: ['dialog', 'wfrp4e-npc-generator-dialog'],
      }
    ).render(true);
  }
}
