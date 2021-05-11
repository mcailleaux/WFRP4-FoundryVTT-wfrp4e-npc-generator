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
  private static compendiumRangedTrait: Item;

  private static compendiumLoaded = false;
  private static creatureCompendiumLoaded = false;

  public static async initCompendium(forCreatures = false) {
    let loadDialog: Dialog | null = null;
    if (!this.compendiumLoaded || !this.creatureCompendiumLoaded) {
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

    if (forCreatures) {
      await Promise.all([
        this.getCompendiumTrappings(),
        this.getCompendiumBestiary(),
        this.getCompendiumSkills(),
        this.getCompendiumTalents(),
        this.getCompendiumTraits(),
      ]);
      await this.getCompendiumSizeTrait();
      await this.getCompendiumSwarmTrait();
      await this.getCompendiumWeaponTrait();
      await this.getCompendiumArmourTrait();
      await this.getCompendiumRangedTrait();
    } else {
      await Promise.all([
        this.getCompendiumCareers(),
        this.getCompendiumTrappings(),
      ]);
      await this.getCompendiumCareersGroups();
    }

    if (
      (!this.compendiumLoaded || !this.creatureCompendiumLoaded) &&
      loadDialog != null
    ) {
      setTimeout(async () => {
        await loadDialog?.close();
      });
    }
    if (forCreatures) {
      this.creatureCompendiumLoaded = true;
    } else {
      this.compendiumLoaded = true;
    }
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

        const module = game.modules.get(pack.metadata.package);
        const key =
          module?.packs?.find((p: any) => p.name === pack.metadata.name)
            ?.label ?? pack.metadata.label;

        this.compendiumBestiary[key] = actor.filter(
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
          (t: Item & any) =>
            t.data.name === 'Size' || t.data.originalName === 'Size'
        )
      );
    }
    return Promise.resolve(this.compendiumSizeTrait);
  }

  public static async getCompendiumSwarmTrait() {
    if (this.compendiumSwarmTrait == null) {
      this.compendiumSwarmTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) =>
            t.data.name === 'Swarm' || t.data.originalName === 'Swarm'
        )
      );
    }
    return Promise.resolve(this.compendiumSwarmTrait);
  }

  public static async getCompendiumWeaponTrait() {
    if (this.compendiumWeaponTrait == null) {
      this.compendiumWeaponTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) =>
            t.data.name === 'Weapon' || t.data.originalName === 'Weapon'
        )
      );
    }
    return Promise.resolve(this.compendiumWeaponTrait);
  }

  public static async getCompendiumArmourTrait() {
    if (this.compendiumArmorTrait == null) {
      this.compendiumArmorTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) =>
            t.data.name === 'Armour' || t.data.originalName === 'Armour'
        )
      );
    }
    return Promise.resolve(this.compendiumArmorTrait);
  }

  public static async getCompendiumRangedTrait() {
    if (this.compendiumRangedTrait == null) {
      this.compendiumRangedTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) =>
            t.data.name.startsWith('Ranged') ||
            t.data.originalName.startsWith('Ranged')
        )
      );
    }
    return Promise.resolve(this.compendiumRangedTrait);
  }
}
