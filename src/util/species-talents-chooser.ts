export default class SpeciesTalentsChooser {
  public static getSpeciesTalentsMap(): { [key: string]: any[] } {
    return game.wfrp4e.config.speciesTalents;
  }

  public static async selectSpeciesTalents(
    speciesKey: string,
    callback: (speciesTalents: string[]) => void
  ) {
    const dialogId = new Date().getTime();
    const speciesTalentsMap = this.getSpeciesTalentsMap();
    const speciesTalent: string[] = speciesTalentsMap[speciesKey].filter(
      (talent: string, index) =>
        index !== speciesTalentsMap[speciesKey].length - 1 &&
        talent.includes(',')
    );
    // const randomTalents: number =
    //   speciesTalentsMap[speciesKey][speciesTalentsMap[speciesKey].length - 1];

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.species.talents.select.title'),
      content: `<form>            
              ${speciesTalent
                .map((t) => {
                  const tl = t.split(',')[0].trim();
                  const tr = t.split(',')[1].trim();
                  return `
                  <div class="form-group" style="display: flex; flex-direction: row; justify-content: space-between; align-items: stretch;">                  
                  <label style="word-break: break-all; flex: 40%;">
                      ${tl}          
                  </label> 
                
                  <input class="select-talent-left-${dialogId}" onclick="check()" style="flex: 10%;" type="radio" id="select-talent-left-${tl}-${dialogId}" name="select-talent-${tl}" value="${tl}"/>
                 <label style="word-break: break-all; flex: 40%;">
                      ${tr}          
                  </label> 
                  <input class="select-talent-right-${dialogId}" onclick="check()" style="flex: 10%;" type="radio" id="select-talent-right-${tr}-${dialogId}" name="select-talent-${tr}" value="${tr}"/>
                  </div>      
              `;
                })
                .join('')}       
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
                 const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                 yesButton.disabled = nbrChecked < ${speciesTalent.length};
              }

              function toArray(obj) {
                 const array = [];
                 for (let i = 0; i < obj.length; i++) { 
                    array[i] = obj[i];
                 }
                 return array;
              }
              
              check();
          </script>
                 `,
      buttons: {
        yes: {
          icon: `<i class="fas fa-check" id="yes-icon-${dialogId}"></i>`,
          label: game.i18n.localize('WFRP4NPCGEN.common.button.OK'),
          callback: (html: JQuery) => {
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
            callback(talents);
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
