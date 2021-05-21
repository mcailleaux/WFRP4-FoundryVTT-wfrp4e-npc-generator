import RandomUtil from './random-util.js';
import DialogUtil from './dialog-util.js';
import ReferentialUtil from './referential-util.js';

export default class SpeciesChooser {
  public static async selectSpecies(
    initSpeciesKey: string,
    initSubSpeciesKey: string,
    callback: (
      speciesKey: string,
      speciesValue: string,
      subSpeciesKey: string
    ) => void
  ) {
    const dialogId = new Date().getTime();
    const speciesMap = ReferentialUtil.getSpeciesMap();
    const subSpeciesMap = ReferentialUtil.getSubSpeciesMap();
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

    const initSubSpeciesContainerClass =
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
              <div id="select-subspecies-container-${dialogId}" class="form-group ${initSubSpeciesContainerClass}">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.subspecies.select.label'
              )}
              ${DialogUtil.getSelectScript(
                `select-subspecies-${dialogId}`,
                initSubSpeciesLabelsMap,
                initSubSpeciesKey
              )}
              </div>
          </form>
          <script>  
          
                function speciesChange() {
                  const subSpecies = \{
                      ${Object.entries(subSpeciesMap)
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
                  const selectSubSpeciesContainer = document.getElementById('select-subspecies-container-${dialogId}');
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
                     selectSubSpeciesContainer.classList.remove('select-subspecies-no-subspecies');
                  } else {
                     selectSubSpeciesContainer.classList.add('select-subspecies-no-subspecies'); 
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
          let speciesValue = speciesMap[speciesKey];
          const subSpeciesKey = <string>(
            html.find(`#select-subspecies-${dialogId}`).val()
          );
          if (subSpeciesKey != null) {
            speciesValue +=
              ' (' + subSpeciesMap[speciesKey][subSpeciesKey] + ')';
          }
          callback(speciesKey, speciesValue, subSpeciesKey);
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
