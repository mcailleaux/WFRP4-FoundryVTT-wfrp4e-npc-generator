import DialogUtil from './dialog-util.js';

export default class CompendiumUtil {
  private static compendiumCareers: Item[];
  private static compendiumCareerGroups: string[];
  private static compendiumTrappings: Item[];
  private static compendiumBestiary: Item[];

  private static compendiumLoaded = false;

  public static async initCompendium() {
    let loadDialog: Dialog | null = null;
    if (!this.compendiumLoaded) {
      loadDialog = new Dialog({
        title: game.i18n.localize('WFRP4NPCGEN.compendium.load.title'),
        content: `<form> 
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.compendium.load.hint')}
              </div>
          </form>
            `,
        buttons: {},
      });
      loadDialog.render(true);
    }
    await this.getCompendiumCareers();
    await this.getCompendiumCareersGroups();
    await this.getCompendiumTrappings();
    await this.getCompendiumBestiary();
    if (!this.compendiumLoaded && loadDialog != null) {
      setTimeout(async () => {
        await loadDialog?.close();
      });
    }
    this.compendiumLoaded = true;
  }

  public static async getCompendiumCareers() {
    if (this.compendiumCareers == null) {
      this.compendiumCareers = [];
      const careersPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('career')
      );
      for (let pack of careersPacks) {
        const career: Item[] = await pack.getContent();
        this.compendiumCareers.push(
          ...career.filter((c) => c.type === 'career')
        );
      }
    }
    return Promise.resolve(this.compendiumCareers);
  }

  public static async getCompendiumCareersGroups() {
    if (this.compendiumCareerGroups == null) {
      this.compendiumCareerGroups = [];
      const careers = await this.getCompendiumCareers();
      for (let career of careers) {
        const group = (<any>career?.data?.data)?.careergroup?.value;
        if (group != null && !this.compendiumCareerGroups.includes(group)) {
          this.compendiumCareerGroups.push(group);
        }
      }
    }
    return Promise.resolve(this.compendiumCareerGroups);
  }

  public static getTrappingCategories(): string[] {
    return Object.keys(game.wfrp4e.config.trappingCategories);
  }

  public static async getCompendiumTrappings() {
    if (this.compendiumTrappings == null) {
      this.compendiumTrappings = [];
      const trappingsPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('trapping')
      );
      const trappingCategories = CompendiumUtil.getTrappingCategories();
      for (let pack of trappingsPacks) {
        const trappings: Item[] = await pack.getContent();
        this.compendiumTrappings.push(
          ...trappings.filter((t) => {
            const type = (<any>t?.data?.data)?.trappingType?.value;
            return (
              trappingCategories.includes(t.type) ||
              trappingCategories.includes(type)
            );
          })
        );
      }
    }
    return Promise.resolve(this.compendiumTrappings);
  }

  public static async getCompendiumBestiary() {
    if (this.compendiumBestiary == null) {
      this.compendiumBestiary = [];
      const actorsPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('actor')
      );
      for (let pack of actorsPacks) {
        const actor: Item[] = await pack.getContent();
        this.compendiumBestiary.push(
          ...actor.filter(
            (c) => c.type === 'actor' && c.data?.type === 'creature'
          )
        );
      }
    }
    return Promise.resolve(this.compendiumBestiary);
  }
}
