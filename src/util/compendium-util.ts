import DialogUtil from './dialog-util.js';

export default class CompendiumUtil {
  private static compendiumCareerIndexes: Item[];
  private static compendiumCareers: Item[];
  private static compendiumTrappings: Item[];
  private static compendiumSkillIndexes: Item[];
  private static compendiumSkills: Item[];
  private static compendiumTalentIndexes: Item[];
  private static compendiumTalents: Item[];

  public static compendiumloaded = false;

  public static async initCompendium() {
    let loadDialog;
    if (!this.compendiumloaded) {
      loadDialog = new Dialog({
        title: game.i18n.localize('WFRP4NPCGEN.compendium.load.title'),
        content: `<form> 
              <div class="form-group">
              ${DialogUtil.getLabelScript('WFRP4NPCGEN.compendium.load.hint')}}
              </div>
          </form>
            `,
      });
      loadDialog.render(true);
    }
    await this.getCompendiumCareerIndexes();
    await this.getCompendiumCareers();
    await this.getCompendiumTrappings();
    await this.getCompendiumSkillIndexes();
    await this.getCompendiumSkills();
    await this.getCompendiumTalentIndexes();
    await this.getCompendiumTalents();
    if (!this.compendiumloaded && loadDialog != null) {
      await loadDialog.close();
    }
    this.compendiumloaded = true;
  }

  public static async getCompendiumCareerIndexes() {
    if (this.compendiumCareerIndexes == null) {
      this.compendiumCareerIndexes = [];
      const careersPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('career')
      );
      for (let pack of careersPacks) {
        this.compendiumCareerIndexes.push(...(await pack.getIndex()));
      }
    }
    return Promise.resolve(this.compendiumCareerIndexes);
  }

  public static async getCompendiumCareers() {
    if (this.compendiumCareers == null) {
      this.compendiumCareers = [];
      const careersPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('career')
      );
      for (let pack of careersPacks) {
        this.compendiumCareers.push(...(await pack.getContent()));
      }
    }
    return Promise.resolve(this.compendiumCareers);
  }

  public static async getCompendiumTrappings() {
    if (this.compendiumTrappings == null) {
      this.compendiumTrappings = [];
      const trappingsPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('trapping')
      );
      for (let pack of trappingsPacks) {
        this.compendiumTrappings.push(...(await pack.getContent()));
      }
    }
    return Promise.resolve(this.compendiumTrappings);
  }

  public static async getCompendiumSkillIndexes() {
    if (this.compendiumSkillIndexes == null) {
      this.compendiumSkillIndexes = [];
      const skillPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('skill')
      );
      for (let pack of skillPacks) {
        this.compendiumSkillIndexes.push(...(await pack.getIndex()));
      }
    }
    return Promise.resolve(this.compendiumSkillIndexes);
  }

  public static async getCompendiumSkills() {
    if (this.compendiumSkills == null) {
      this.compendiumSkills = [];
      const skillPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('skill')
      );
      for (let pack of skillPacks) {
        this.compendiumSkills.push(...(await pack.getContent()));
      }
    }
    return Promise.resolve(this.compendiumSkills);
  }

  public static async getCompendiumTalentIndexes() {
    if (this.compendiumTalentIndexes == null) {
      this.compendiumTalentIndexes = [];
      const skillPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('talent')
      );
      for (let pack of skillPacks) {
        this.compendiumTalentIndexes.push(...(await pack.getIndex()));
      }
    }
    return Promise.resolve(this.compendiumTalentIndexes);
  }

  public static async getCompendiumTalents() {
    if (this.compendiumTalents == null) {
      this.compendiumTalents = [];
      const skillPacks = game.packs.filter(
        (p) => p.metadata.tags && p.metadata.tags.includes('talent')
      );
      for (let pack of skillPacks) {
        this.compendiumTalents.push(...(await pack.getContent()));
      }
    }
    return Promise.resolve(this.compendiumTalents);
  }
}
