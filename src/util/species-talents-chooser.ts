import DialogUtil from './dialog-util.js';
import RandomUtil from './random-util.js';

export default class SpeciesTalentsChooser {
  public static getSpeciesTalentsMap(): { [key: string]: any[] } {
    return game.wfrp4e.config.speciesTalents;
  }

  public static async selectSpeciesTalents(
    initTalents: string[],
    speciesKey: string,
    callback: (speciesTalents: string[]) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const speciesTalentsMap = this.getSpeciesTalentsMap();
    const speciesTalent: string[] = speciesTalentsMap[speciesKey].filter(
      (talent: string, index) =>
        index !== speciesTalentsMap[speciesKey].length - 1 &&
        talent.includes(',')
    );
    const randomTalentsNbr: number =
      speciesTalentsMap[speciesKey][speciesTalentsMap[speciesKey].length - 1];
    const randomTalents: string[] = game.wfrp4e.tables.talents.rows.map(
      (row: any) => row.name
    );

    let initChoiceTalents: string[];
    let initRandomTalents: string[] = [];
    if (randomTalentsNbr > 0) {
      const lastIndexOfChoice = initTalents.length - randomTalentsNbr;
      if (lastIndexOfChoice >= 0) {
        initChoiceTalents = initTalents.filter(
          (_t, i) => i < lastIndexOfChoice
        );
        initRandomTalents = initTalents.filter(
          (_t, i) => i >= lastIndexOfChoice
        );
      } else {
        initChoiceTalents = initTalents;
      }
    } else {
      initChoiceTalents = initTalents;
    }

    const randomTalentsForm =
      randomTalentsNbr > 0
        ? `
        <div class="form-group">
          ${DialogUtil.getButtonScript(
            'WFRP4NPCGEN.common.button.Random',
            'randomTalents()'
          )}
        </div>
        <div class="form-group" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: stretch;">
        ${randomTalents
          .map(
            (t) =>
              `
            <div class="form-group" style="flex: 50%; display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;">
            ${DialogUtil.getLabelScript(t, 'flex: 80%')}
            ${DialogUtil.getInputScript({
              id: `select-talent-random-${t}-${dialogId}`,
              type: 'checkbox',
              initValue: t,
              style: 'flex: 20%',
              classes: `select-talent-random-${dialogId}`,
              onClick: 'check()',
              checked: initRandomTalents.includes(t),
            })}
            </div>
            `
          )
          .join('')}
        </div>
        `
        : '';

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.species.talents.select.title'),
      content: `<form>   
              <div class="form-group">
                  ${DialogUtil.getButtonScript(
                    'WFRP4NPCGEN.common.button.Random',
                    'random()'
                  )}
              </div>                 
              ${speciesTalent
                .map((t) => {
                  const tl = t.split(',')[0].trim();
                  const tr = t.split(',')[1].trim();
                  return `
                  <div class="form-group" style="display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;">
                  ${DialogUtil.getLabelScript(
                    tl,
                    'word-break: break-all; flex: 40%;'
                  )}   
                  ${DialogUtil.getInputScript({
                    id: `select-talent-left-${tl}-${dialogId}`,
                    type: 'radio',
                    name: `select-talent-${t}`,
                    initValue: tl,
                    onClick: 'check()',
                    classes: `select-talent-left-${dialogId}`,
                    style: 'flex: 10%;',
                    checked: initChoiceTalents.includes(tl),
                  })}    
                  ${DialogUtil.getLabelScript(
                    tr,
                    'word-break: break-all; flex: 40%;'
                  )}              
                  ${DialogUtil.getInputScript({
                    id: `select-talent-right-${tr}-${dialogId}`,
                    type: 'radio',
                    name: `select-talent-${t}`,
                    initValue: tr,
                    onClick: 'check()',
                    classes: `select-talent-right-${dialogId}`,
                    style: 'flex: 10%;',
                    checked: initChoiceTalents.includes(tr),
                  })} 
                  </div>      
              `;
                })
                .join('')} 
              ${randomTalentsForm}      
          </form>
          <script>                        
              function check() {
                 const leftClass = 'select-talent-left-${dialogId}';
                 const rightClass = 'select-talent-right-${dialogId}';                
                 const lefts = toArray(document.getElementsByClassName(leftClass));
                 const rights = toArray(document.getElementsByClassName(rightClass));
                 const nbrLeftsChecked = lefts.filter((r) => r.checked).length;
                 const nbrRightsChecked = rights.filter((r) => r.checked).length;
                 const nbrChecked = nbrLeftsChecked + nbrRightsChecked;
                 const nbrTalents = ${randomTalentsNbr};
                 let nbrRandomChecked = 0;
                 let hasGoodNbrOfTalents = true;
                 if (nbrTalents > 0) {
                    const talentClass = 'select-talent-random-${dialogId}';                
                    const talentsElm = toArray(document.getElementsByClassName(talentClass));
                    nbrRandomChecked = talentsElm.filter((cb) => cb.checked).length;
                    hasGoodNbrOfTalents = nbrRandomChecked >= nbrTalents;
                    if (hasGoodNbrOfTalents) {
                        talentsElm.forEach((cb) => cb.disabled = !cb.checked);    
                    } else {
                        talentsElm.forEach((cb) => cb.disabled = false);
                    }                    
                 }  
                
                 const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                 yesButton.disabled = nbrChecked < ${
                   speciesTalent.length
                 } || !hasGoodNbrOfTalents;
              }
              
              function random() {
                  const speciesTalents = [${speciesTalent
                    .map((t) => `"${t}"`)
                    .join(',')}];
                  const randomTalents = [];
                  speciesTalents.forEach((st) => {
                      const choices = st.split(',').map((t) => t.trim());
                      const randomTalent = getRandomValue(choices);
                      if (randomTalent != null) {
                          randomTalents.push(randomTalent);
                      }
                  });
                  if (randomTalents.length > 0) {
                     const leftClass = 'select-talent-left-${dialogId}';
                     const rightClass = 'select-talent-right-${dialogId}';                
                     const lefts = toArray(document.getElementsByClassName(leftClass));
                     const rights = toArray(document.getElementsByClassName(rightClass));
                     lefts.forEach((r) => {
                        r.checked = randomTalents.includes(r.value);
                     });
                     rights.forEach((r) => {
                        r.checked = randomTalents.includes(r.value);
                     });
                     check();
                  }
              }
              
              function randomTalents() {
                  const talents = [${randomTalents
                    .map((t) => `"${t}"`)
                    .join(',')}];
                  const nbrTalents = ${randomTalentsNbr};
                  const randomTalents = nbrTalents > 1 ? getRandomValues(talents, nbrTalents) : [getRandomValue(talents)];
                  const talentClass = 'select-talent-random-${dialogId}';                
                  const talentsElm = toArray(document.getElementsByClassName(talentClass));
                  talentsElm.forEach((elm) => {
                     elm.checked = randomTalents.includes(elm.value); 
                  });
                  check();
              }
              
              ${RandomUtil.getRandomValueScript()}
              ${RandomUtil.getRandomValuesScript()}

              ${DialogUtil.getToArrayScript()}
              
              check();
          </script>
                 `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (html: JQuery) => {
          const talents: string[] = [];
          html
            .find(`.select-talent-left-${dialogId}`)
            .filter((_i, r: HTMLInputElement) => r.checked)
            .each((_i, r: HTMLInputElement) => {
              talents.push(r.value);
            });
          html
            .find(`.select-talent-right-${dialogId}`)
            .filter((_i, r: HTMLInputElement) => r.checked)
            .each((_i, r: HTMLInputElement) => {
              talents.push(r.value);
            });
          if (randomTalentsNbr > 0) {
            html
              .find(`.select-talent-random-${dialogId}`)
              .filter((_i, r: HTMLInputElement) => r.checked)
              .each((_i, r: HTMLInputElement) => {
                talents.push(r.value);
              });
          }
          callback(talents);
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
