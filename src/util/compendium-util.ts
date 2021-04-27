export default class CompendiumUtil {
  private static compendiumCareerIndexes: Item[];
  private static compendiumCareers: Item[];
  private static compendiumTrappings: Item[];
  private static compendiumSkillIndexes: Item[];
  private static compendiumSkills: Item[];
  private static compendiumTalentIndexes: Item[];
  private static compendiumTalents: Item[];

  public static async initCompendium() {
    this.getCompendiumCareerIndexes().then();
    this.getCompendiumCareers().then();
    this.getCompendiumTrappings().then();
    this.getCompendiumSkillIndexes().then();
    this.getCompendiumSkills().then();
    this.getCompendiumTalentIndexes().then();
    this.getCompendiumTalents().then();
    return Promise.resolve();
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
