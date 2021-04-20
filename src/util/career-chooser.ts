export default class CareerChooser {
  public static async getCareers(): Promise<Item[]> {
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getIndex();
    const worldCareers = game.items.entities.filter(
      (item) => item.type === 'career'
    );
    careers.push(...worldCareers);
    return Promise.resolve(careers);
  }

  public static async selectCareer(callback: (item: Item) => void) {
    const dialogId = new Date().getTime();
    const careers = await this.getCareers();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.career.select.title'),
      content: `<form>
              <div class="form-group">
              <label>
                  ${game.i18n.localize(
                    'WFRP4NPCGEN.career.select.label'
                  )}          
              </label> 
              <input oninput="check()" list="select-career-list-${dialogId}" type="text" id="select-career-${dialogId}" name="select-career" />
              <datalist id="select-career-list-${dialogId}">
                 ${careers.map((c) => `<option value="${c.name}"></option>`)}
              </datalist>
              </div>
          </form>
          <script>
            function check() {
                const careers = [${careers.map((c) => `"${c.name}"`).join(',')}]
                const career = document.getElementById('select-career-${dialogId}').value;
                const yesButton = document.getElementById('yes-icon-${dialogId}').parentElement;
                yesButton.disabled=!careers.includes(career);
            }
            check()
          </script>
          `,
      buttons: {
        yes: {
          icon: `<i class="fas fa-check" id="yes-icon-${dialogId}"></i>`,
          label: game.i18n.localize('WFRP4NPCGEN.common.button.OK'),
          callback: (html: JQuery) => {
            const careerName = html.find(`#select-career-${dialogId}`).val();
            const career = careers.find((c) => c.name === careerName);
            if (career != null) {
              callback(career);
            }
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
