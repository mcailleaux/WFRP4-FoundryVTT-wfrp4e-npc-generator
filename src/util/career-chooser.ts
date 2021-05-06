import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';
import ReferentialUtil from './referential-util.js';

export default class CareerChooser {
  public static async selectCareer(
    initCareers: string[],
    speciesKey: string,
    callback: (item: Item[]) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const careers = await ReferentialUtil.getCareerEntities();
    const randomCareers = await ReferentialUtil.getRandomSpeciesCareers(
      speciesKey
    );
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.career.select.title'),
      content: `<form id="select-career-form-${dialogId}">
              <div class="form-group">
                      ${DialogUtil.getButtonScript(
                        'WFRP4NPCGEN.common.button.Random',
                        'random()'
                      )}
              </div>
              <div class="form-group">
                      ${DialogUtil.getButtonScript(
                        `${game.i18n.localize(
                          'WFRP4NPCGEN.common.button.Random'
                        )} ${ReferentialUtil.getSpeciesMap()[speciesKey]}`,
                        'randomSpecies()'
                      )}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.career.select.label')}
              ${DialogUtil.getInputScript({
                id: `select-career-${dialogId}`,
                type: 'text',
                initValue: initCareers?.length > 0 ? initCareers[0] : '',
                name: 'select-career',
                onInput: 'check()',
                dataListId: `select-career-list-${dialogId}`,
                options: careers.map((c) => c.name),
              })}
              </div>
              ${initCareers
                ?.filter((_c, i) => i > 0)
                ?.map(
                  (c) => `
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.career.select.label')}
              ${DialogUtil.getInputScript({
                id: '',
                type: 'text',
                initValue: c,
                name: 'select-extra-career',
                classes: 'select-extra-career',
                onInput: 'check()',
                dataListId: `select-career-list-${dialogId}`,
              })}
              </div>
              `
                )}
              <button id="add-extra-career-button-${dialogId}" class="add-remove-button-career" type="button" onclick="addCareer()">
                 <i class="fas fa-plus"></i>
              </button>
          </form>
          <script>
            function check() {
                const careers = [${careers.map((c) => `"${c.name}"`).join(',')}]
                const career = document.getElementById('select-career-${dialogId}').value;
                const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                yesButton.disabled = !careers.includes(career);
            }
            
            function random() {
              const careers = [${careers.map((c) => `"${c.name}"`).join(',')}];
              performRandom(careers);
            }
            
            function randomSpecies() {
              const careers = [${randomCareers.map((c) => `"${c}"`).join(',')}];
                performRandom(careers);  
              }
              
              function performRandom(careers) {
                const randomCareer = getRandomValue(careers);
                if (randomCareer != null) {
                    document.getElementById('select-career-${dialogId}').value = randomCareer;
                  check();
              } 
            }
            
            function addCareer() {
                const form = document.getElementById('select-career-form-${dialogId}');
                const div = document.createElement('div');
                div.classList.add('form-group');
                div.innerHTML = \`
                    ${DialogUtil.getLabelScript(
                      'WFRP4NPCGEN.career.select.label'
                    )}
                    ${DialogUtil.getInputScript({
                      id: '',
                      type: 'text',
                      name: 'select-extra-career',
                      classes: 'select-extra-career',
                      onInput: 'check()',
                      outerDataListId: `select-career-list-${dialogId}`,
                    })}
                    <button class="add-remove-button-career" type="button" onclick="removeCareer(event)">
                       <i class="fas fa-trash-alt"></i>
                    </button>
                    \`
                    const addButton = document.getElementById('add-extra-career-button-${dialogId}');
                    form.insertBefore(div, addButton);
            }
            
            function removeCareer(event) {
               const form = document.getElementById('select-career-form-${dialogId}');
               const div = event.target.parentElement;
               form.removeChild(div);
            }
              
            ${RandomUtil.getRandomValueScript()}
              
            check()
          </script>
          <style>
            .add-remove-button-career {
                max-width: 32px;
            }
            
            .add-remove-button-career > i {
                pointer-events: none;
            }
          </style>
          `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const careerName = html.find(`#select-career-${dialogId}`).val();
          const career = careers.find((c) => c.name === careerName);
          if (career != null) {
            callback([career]);
          }
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
