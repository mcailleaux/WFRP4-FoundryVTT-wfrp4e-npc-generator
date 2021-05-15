import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';
import ReferentialUtil from './referential-util.js';

export default class SpeciesSkillsChooser {
  public static async selectSpeciesSkills(
    initMajors: string[],
    initMinors: string[],
    speciesKey: string,
    callback: (major: string[], minor: string[]) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const speciesSkillsMap = ReferentialUtil.getSpeciesSkillsMap();
    new Dialog(
      {
        title: game.i18n.localize('WFRP4NPCGEN.species.skills.select.title'),
        content: `<form>
                <div class="form-group">
                      ${DialogUtil.getButtonScript(
                        'WFRP4NPCGEN.common.button.Random',
                        'random()'
                      )}
              </div>            
              ${speciesSkillsMap[speciesKey]
                .map(
                  (s) => `
                  <div class="form-group" style="display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;">                  
                  ${DialogUtil.getLabelScript(
                    s,
                    'word-break: break-all; flex: 40%;'
                  )}                 
                  <div style="flex: 60%; display: flex; flex-direction: row; justify-content: flex-end; align-items: stretch;">
                  ${DialogUtil.getLabelScript('+5', 'flex: 25%;')}
                  ${DialogUtil.getInputScript({
                    id: `select-skill-major-${s}-${dialogId}`,
                    type: 'radio',
                    name: `select-skill-${s}`,
                    initValue: s,
                    onClick: 'check(this, true)',
                    classes: `select-skill-major-${dialogId}`,
                    style: 'flex: 25%;',
                    checked: initMajors?.includes(s),
                  })}
                  ${DialogUtil.getLabelScript('+3', 'flex: 25%;')}
                  ${DialogUtil.getInputScript({
                    id: `select-skill-minor-${s}-${dialogId}`,
                    type: 'radio',
                    name: `select-skill-${s}`,
                    initValue: s,
                    onClick: 'check(this, false)',
                    classes: `select-skill-minor-${dialogId}`,
                    style: 'flex: 25%;',
                    checked: initMinors?.includes(s),
                  })}
                  </div>
                  </div>      
              `
                )
                .join('')}       
                  <input type="hidden" id="select-skill-major-nbr-${dialogId}" value="${
          initMajors.length
        }"/>
                  <input type="hidden" id="select-skill-minor-nbr-${dialogId}" value="${
          initMinors.length
        }"/>       
          </form>
          <script>                        
              function check(elm, isMajor) {
                 const nbrMajor = Number(document.getElementById('select-skill-major-nbr-${dialogId}').value)
                 const nbrMinor = Number(document.getElementById('select-skill-minor-nbr-${dialogId}').value)
                 if (elm?.checked && (isMajor && nbrMajor >= 3 || !isMajor && nbrMinor >= 3)) {
                    elm.checked = false
                 }
                 const majorClass = 'select-skill-major-${dialogId}'
                 const minorClass = 'select-skill-minor-${dialogId}'                
                 const majors = toArray(document.getElementsByClassName(majorClass))
                 const minors = toArray(document.getElementsByClassName(minorClass))
                 const nbrMajorsChecked = majors.filter((r) => r.checked).length
                 const nbrMinorsChecked = minors.filter((r) => r.checked).length  
                 document.getElementById('select-skill-major-nbr-${dialogId}').value = nbrMajorsChecked
                 document.getElementById('select-skill-minor-nbr-${dialogId}').value = nbrMinorsChecked 
                 if (nbrMajorsChecked >= 3) {
                    majors.forEach((r) => r.disabled = !r.checked)
                 } else {
                    majors.forEach((r) => r.disabled = false)
                 }
                 if (nbrMinorsChecked >= 3) {
                    minors.forEach((r) => r.disabled = !r.checked)
                 } else {
                    minors.forEach((r) => r.disabled = false)
                 }
                 const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                 yesButton.disabled = nbrMajorsChecked < 3 || nbrMinorsChecked < 3;
              }
              
              function random() {
                  const speciesSkills = [${speciesSkillsMap[speciesKey]
                    .map((skill) => `"${skill}"`)
                    .join(',')}];
                  const randomSpeciesSkills = getRandomValues(speciesSkills, 6);
                  if (randomSpeciesSkills != null && randomSpeciesSkills.length > 0) {
                      const randomMajors = getRandomValues(randomSpeciesSkills, 3);
                      const randomMinors = randomSpeciesSkills.filter((skill) => !randomMajors.includes(skill));
                      const majorClass = 'select-skill-major-${dialogId}';
                      const minorClass = 'select-skill-minor-${dialogId}';          
                      const majors = toArray(document.getElementsByClassName(majorClass));
                      const minors = toArray(document.getElementsByClassName(minorClass));
                      majors.forEach((r) => {
                          r.checked = randomMajors.includes(r.value);
                      });
                      minors.forEach((r) => {
                          r.checked = randomMinors.includes(r.value);
                      });
                      check(null, true);
                  }
              }
              
              ${RandomUtil.getRandomValuesScript()}

              ${DialogUtil.getToArrayScript()}
              
              check(null, true);
          </script>
                 `,
        buttons: DialogUtil.getDialogButtons(
          dialogId,
          (html: JQuery) => {
            const major: string[] = [];
            const minor: string[] = [];
            html
              .find(`.select-skill-major-${dialogId}`)
              .filter((_i, r: HTMLInputElement) => r.checked)
              .each((_i, r: HTMLInputElement) => {
                major.push(r.value);
              });
            html
              .find(`.select-skill-minor-${dialogId}`)
              .filter((_i, r: HTMLInputElement) => r.checked)
              .each((_i, r: HTMLInputElement) => {
                minor.push(r.value);
              });
            callback(major, minor);
          },
          undo
        ),
        default: 'yes',
      },
      {
        resizable: true,
      }
    ).render(true);
  }
}
