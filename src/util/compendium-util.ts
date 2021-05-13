import WaiterUtil from './waiter-util.js';

export default class CompendiumUtil {
  private static compendiumItems: Item[];
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
  private static compendiumSpells: Item[];
  private static compendiumPrayers: Item[];
  private static compendiumPhysicalMutations: Item[];
  private static compendiumMentalMutations: Item[];

  private static compendiumLoaded = false;
  private static creatureCompendiumLoaded = false;

  public static async initCompendium(
    callback: () => void,
    forCreatures = false
  ) {
    if (!this.compendiumLoaded || !this.creatureCompendiumLoaded) {
      await WaiterUtil.show(
        'WFRP4NPCGEN.compendium.load.title',
        'WFRP4NPCGEN.compendium.load.hint',
        async () => {
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

          if (!this.compendiumLoaded || !this.creatureCompendiumLoaded) {
            await WaiterUtil.hide();
          }
          if (forCreatures) {
            this.creatureCompendiumLoaded = true;
          } else {
            this.compendiumLoaded = true;
          }

          callback();
        }
      );
    } else {
      callback();
    }
  }

  public static async getCompendiumItems() {
    if (this.compendiumItems == null) {
      this.compendiumItems = [];
      const itemsPacks = game.packs.filter((p) => p.metadata.entity === 'Item');
      const loaders: Promise<any>[] = [];
      for (let pack of itemsPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let items of contents) {
        this.compendiumItems.push(...items);
      }
    }
    return Promise.resolve(this.compendiumItems);
  }

  public static async getCompendiumCareers() {
    if (this.compendiumCareers == null) {
      this.compendiumCareers = [];
      const careersPacks = game.packs.filter(
        (p) =>
          (p.metadata.tags && p.metadata.tags.includes('career')) ||
          p.metadata.entity === 'Item'
      );
      const loaders: Promise<any>[] = [];
      for (let pack of careersPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let careers of contents) {
        this.compendiumCareers.push(
          ...careers.filter((c: Item) => c.type === 'career')
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
      const loaders: Promise<any>[] = [];
      for (let pack of trappingsPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let trappings of contents) {
        this.compendiumTrappings.push(
          ...trappings.filter((t: Item) => {
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
      const packLoader = (pack: any) => {
        return new Promise(async (resolve) => {
          const module = game.modules.get(pack.metadata.package);
          let key = pack.metadata.label;

          if (key === pack.metadata.name) {
            key =
              module?.packs?.find((p: any) => p.name === pack.metadata.name)
                ?.label ?? pack.metadata.label;
          }

          console.info(`Start to load ${key} compendium`);

          const actor: Actor[] = (await pack.getContent()).sort(
            (c1: Actor, c2: Actor) => {
              return c1.name.localeCompare(c2.name);
            }
          );

          this.compendiumBestiary[key] = actor.filter(
            (c) => c.data?.type === 'creature'
          );

          console.info(`End to load ${key} compendium`);

          resolve();
        });
      };
      const loaders: Promise<any>[] = [];
      for (let pack of actorsPacks) {
        loaders.push(packLoader(pack));
      }
      await Promise.all(loaders);
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
      const loaders: Promise<any>[] = [];
      for (let pack of skillsPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let skills of contents) {
        this.compendiumSkills.push(
          ...skills.filter((c: Item) => c.type === 'skill')
        );
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

      const loaders: Promise<any>[] = [];
      for (let pack of talentsPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let talents of contents) {
        this.compendiumTalents.push(
          ...talents.filter((c: Item) => c.type === 'talent')
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

      const loaders: Promise<any>[] = [];
      for (let pack of traitsPacks) {
        loaders.push(pack.getContent());
      }
      const contents = await Promise.all(loaders);
      for (let traits of contents) {
        this.compendiumTraits.push(
          ...traits.filter((c: Item) => c.type === 'trait')
        );
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
            t.data.originalName?.startsWith('Ranged')
        )
      );
    }
    return Promise.resolve(this.compendiumRangedTrait);
  }

  public static getSizes(): { [key: string]: string } {
    return game.wfrp4e.config.actorSizes;
  }
}
