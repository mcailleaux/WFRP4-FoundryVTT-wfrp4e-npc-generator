import { i18n, modules } from './constant.js';

export default class CheckDependencies {
  public static check(callback: (canRun: boolean) => void) {
    const active = modules?.get('wfrp4e-core')?.active ?? false;
    if (active) {
      callback(true);
    } else {
      new Dialog({
        title: i18n.localize('WFRP4NPCGEN.dependencies.miss.title'),
        content: `<form>
              <div class="form-group">
              <label>
                  ${i18n.localize(
                    'WFRP4NPCGEN.dependencies.miss.label'
                  )}          
              </label> 
              <input type="text" readonly value="wfrp4e-core"/>
              </div>
          </form>`,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label: i18n.localize('WFRP4NPCGEN.common.button.OK'),
            callback: () => {
              callback(false);
            },
          },
        },
        default: 'yes',
      }).render(true);
    }
  }
}
