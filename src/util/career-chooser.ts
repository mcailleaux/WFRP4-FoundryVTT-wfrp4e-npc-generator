import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';
import ReferentialUtil from './referential-util.js';

export default class CareerChooser {
  public static async selectCareer(
    initCareer: string,
    speciesKey: string,
    callback: (item: Item) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const careers = await ReferentialUtil.getCareerIndexes();
    const randomCareers = await ReferentialUtil.getRandomSpeciesCareers(
      speciesKey
    );
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.career.select.title'),
      content: `<form>
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
                initValue: initCareer,
                name: 'select-career',
                onInput: 'check()',
                dataListId: `select-career-list-${dialogId}`,
                options: careers.map((c) => c.name),
              })}
              </div>
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
              
            ${RandomUtil.getRandomValueScript()}
              
            check()
          </script>
          `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const careerName = html.find(`#select-career-${dialogId}`).val();
          const career = careers.find((c) => c.name === careerName);
          if (career != null) {
            callback(career);
          }
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
