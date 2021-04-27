export default class CompendiumUtil {
  private static compendiumCareerIndexes: Item[];
  private static compendiumCareers: Item[];
  private static compendiumTrappings: Item[];

  public static async getCompendiumCareerIndexes() {
    if (this.compendiumCareerIndexes == null) {
      const careersPack = game.packs.get('wfrp4e-core.careers');
      this.compendiumCareerIndexes = await careersPack.getIndex();
    }
    return Promise.resolve(this.compendiumCareerIndexes);
  }

  public static async getCompendiumCareers() {
    if (this.compendiumCareers == null) {
      const careersPack = game.packs.get('wfrp4e-core.careers');
      this.compendiumCareers = await careersPack.getContent();
    }
    return Promise.resolve(this.compendiumCareers);
  }

  public static async getCompendiumTrappings() {
    if (this.compendiumTrappings == null) {
      const trappingsPack = game.packs.get('wfrp4e-core.trappings');
      this.compendiumTrappings = await trappingsPack.getContent();
    }
    return Promise.resolve(this.compendiumTrappings);
  }
}
