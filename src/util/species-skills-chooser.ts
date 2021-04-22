import DialogUtil from './dialog-util.js';

export default class SpeciesSkillsChooser {
  public static getSpeciesSkillsMap(): { [key: string]: string[] } {
    return game.wfrp4e.config.speciesSkills;
  }

  public static async selectSpeciesSkills(
    initMajors: string[],
    initMinors: string[],
    speciesKey: string,
    callback: (major: string[], minor: string[]) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const speciesSkillsMap = this.getSpeciesSkillsMap();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.species.skills.select.title'),
      content: `<form>            
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
                    onClick: 'check(this, false)',
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
                    onClick: 'check(this, true)',
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
                    majors.filter((r) => !r.checked).forEach((r) => r.disabled = true)
                 } else {
                    majors.forEach((r) => r.disabled = false)
                 }
                 if (nbrMinorsChecked >= 3) {
                    minors.filter((r) => !r.checked).forEach((r) => r.disabled = true)
                 } else {
                    minors.forEach((r) => r.disabled = false)
                 }
                 const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                 yesButton.disabled = nbrMajorsChecked < 3 || nbrMinorsChecked < 3;
              }

              function toArray(obj) {
                 const array = [];
                 for (let i = 0; i < obj.length; i++) { 
                    array[i] = obj[i];
                 }
                 return array;
              }
              
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
    }).render(true);
  }
}
