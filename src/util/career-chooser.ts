import DialogUtil from './dialog-util.js';

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

  public static async selectCareer(
    initCareer: string,
    callback: (item: Item) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const careers = await this.getCareers();
    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.career.select.title'),
      content: `<form>
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.career.select.label')}
              ${DialogUtil.getInputScript(
                `select-career-${dialogId}`,
                'text',
                initCareer,
                'select-career',
                'check()',
                `select-career-list-${dialogId}`,
                careers.map((c) => c.name)
              )}
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
