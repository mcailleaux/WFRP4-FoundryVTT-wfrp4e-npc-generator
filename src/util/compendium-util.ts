import DialogUtil from './dialog-util.js';

export default class CompendiumUtil {
  private static compendiumCareers: Item[];
  private static compendiumCareerGroups: string[];
  private static compendiumTrappings: Item[];
  private static compendiumBestiary: { [pack: string]: Actor[] };
  private static compendiumSkills: Item[];
  private static compendiumTalents: Item[];
  private static compendiumTraits: Item[];
  private static compendiumSizeTrait: Item;
  private static compendiumSwarmTrait: Item;
  private static compendiumWeaponTrait: Item;
  private static compendiumArmorTrait: Item;

  private static compendiumLoaded = false;

  public static async initCompendium(forCreatures = false) {
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
    if (!forCreatures) {
      await this.getCompendiumCareers();
      await this.getCompendiumCareersGroups();
    }
    await this.getCompendiumTrappings();
    if (forCreatures) {
      await this.getCompendiumBestiary();
      await this.getCompendiumSkills();
      await this.getCompendiumTalents();
      await this.getCompendiumTraits();
      await this.getCompendiumSizeTrait();
      await this.getCompendiumSwarmTrait();
      await this.getCompendiumWeaponTrait();
      await this.getCompendiumArmorTrait();
    }
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
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('career')) ||
          p.metadata.entity === 'Item'
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
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('trapping')) ||
          p.metadata.entity === 'Item'
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
      this.compendiumBestiary = {};
      const actorsPacks = game.packs.filter(
        (p) => p.metadata.entity === 'Actor'
      );
      for (let pack of actorsPacks) {
        const actor: Actor[] = (await pack.getContent()).sort(
          (c1: Actor, c2: Actor) => {
            return c1.name.localeCompare(c2.name);
          }
        );
        this.compendiumBestiary[pack.metadata.label] = actor.filter(
          (c) => c.data?.type === 'creature'
        );
      }
    }
    return Promise.resolve(this.compendiumBestiary);
  }

  public static async getCompendiumSkills() {
    if (this.compendiumSkills == null) {
      this.compendiumSkills = [];
      const skillsPacks = game.packs.filter(
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('skill')) ||
          p.metadata.entity === 'Item'
      );
      for (let pack of skillsPacks) {
        const career: Item[] = await pack.getContent();
        this.compendiumSkills.push(...career.filter((c) => c.type === 'skill'));
      }
    }
    return Promise.resolve(this.compendiumSkills);
  }

  public static async getCompendiumTalents() {
    if (this.compendiumTalents == null) {
      this.compendiumTalents = [];
      const talentsPacks = game.packs.filter(
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('talent')) ||
          p.metadata.entity === 'Item'
      );
      for (let pack of talentsPacks) {
        const career: Item[] = await pack.getContent();
        this.compendiumTalents.push(
          ...career.filter((c) => c.type === 'talent')
        );
      }
    }
    return Promise.resolve(this.compendiumTalents);
  }

  public static async getCompendiumTraits() {
    if (this.compendiumTraits == null) {
      this.compendiumTraits = [];
      const traitsPacks = game.packs.filter(
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('trait')) ||
          p.metadata.entity === 'Item'
      );
      for (let pack of traitsPacks) {
        const career: Item[] = await pack.getContent();
        this.compendiumTraits.push(...career.filter((c) => c.type === 'trait'));
      }
    }
    return Promise.resolve(this.compendiumTraits);
  }

  public static async getCompendiumSizeTrait() {
    if (this.compendiumSizeTrait == null) {
      this.compendiumSizeTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) => t.name === 'Size' || t.originalName === 'Size'
        )
      );
    }
    return Promise.resolve(this.compendiumSizeTrait);
  }

  public static async getCompendiumSwarmTrait() {
    if (this.compendiumSwarmTrait == null) {
      this.compendiumSwarmTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) => t.name === 'Swarm' || t.originalName === 'Swarm'
        )
      );
    }
    return Promise.resolve(this.compendiumSwarmTrait);
  }

  public static async getCompendiumWeaponTrait() {
    if (this.compendiumWeaponTrait == null) {
      this.compendiumWeaponTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) => t.name === 'Weapon' || t.originalName === 'Weapon'
        )
      );
    }
    return Promise.resolve(this.compendiumWeaponTrait);
  }

  public static async getCompendiumArmorTrait() {
    if (this.compendiumArmorTrait == null) {
      this.compendiumArmorTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) => t.name === 'Armour' || t.originalName === 'Armour'
        )
      );
    }
    return Promise.resolve(this.compendiumArmorTrait);
  }
}
