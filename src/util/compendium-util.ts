import WaiterUtil from './waiter-util.js';
import { i18n, modules, notifications, packs, wfrp4e } from '../constant.js';

export default class CompendiumUtil {
  private static compendiumItems: Item[];
  private static compendiumActors: { [pack: string]: Actor[] };
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
              this.getCompendiumItems(),
              this.getCompendiumActors(),
            ]);
            await Promise.all([
              this.getCompendiumTrappings(),
              this.getCompendiumBestiary(),
              this.getCompendiumSkills(),
              this.getCompendiumTalents(),
              this.getCompendiumTraits(),
            ]);
            await Promise.all([
              this.getCompendiumSizeTrait(),
              this.getCompendiumSwarmTrait(),
              this.getCompendiumWeaponTrait(),
              this.getCompendiumArmourTrait(),
              this.getCompendiumRangedTrait(),
            ]);
          } else {
            await this.getCompendiumItems();
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
      const itemsPacks = packs().filter(
        (p: any) => p.metadata.entity === 'Item'
      );
      const loaders: Promise<any>[] = [];
      for (let pack of itemsPacks) {
        loaders.push(this.loadCompendiumDocuments(pack));
      }
      const contents = await Promise.all(loaders);
      for (let items of contents) {
        this.compendiumItems.push(...items);
      }
    }
    return Promise.resolve(this.compendiumItems);
  }

  public static async getCompendiumActors() {
    if (this.compendiumActors == null) {
      this.compendiumActors = {};

      const moduleOrder = [
        'wfrp4e-core',
        'wfrp4e-starter-set',
        'wfrp4e-ua1',
        'wfrp4e-rnhd',
        'wfrp4e-eis',
        'wfrp4e-dotr',
        'wfrp4e-middenheim',
        'wfrp4e-archives1',
        'wfrp4e-unofficial-grimoire',
        'nations-of-mankind-wfrp4e',
        'ogre-kingdom-wfrp4e',
        'the-dwarf-empire-wfrp4e',
        'others',
      ];

      const packSort = (a: any, b: any) => {
        const g1 = a?.metadata?.package;
        const g2 = b?.metadata?.package;
        const key1 = moduleOrder.includes(g1) ? g1 : 'others';
        const key2 = moduleOrder.includes(g2) ? g2 : 'others';

        return moduleOrder.indexOf(key1) - moduleOrder.indexOf(key2);
      };

      const actorsPacks = packs()
        .filter((p: any) => p.metadata.entity === 'Actor')
        .sort(packSort);

      const packLoader = (pack: any) => {
        return new Promise(async (resolve) => {
          const module = modules().get(pack.metadata.package);
          let key = pack.metadata.label;

          if (key === pack.metadata.name) {
            key =
              module?.packs?.find((p: any) => p.name === pack.metadata.name)
                ?.label ?? pack.metadata.label;
          }

          console.info(`Start to load ${key} compendium`);

          const actors: Actor[] = (
            await this.loadCompendiumDocuments(pack)
          ).sort((c1: Actor, c2: Actor) => {
            return c1.name?.localeCompare(c2.name ?? '');
          });

          if (actors.length > 0) {
            this.compendiumActors[key] = actors;
          }

          console.info(`End to load ${key} compendium`);

          resolve(true);
        });
      };
      const loaders: Promise<any>[] = [];
      for (let pack of actorsPacks) {
        loaders.push(packLoader(pack));
      }
      await Promise.all(loaders);
    }
    return Promise.resolve(this.compendiumActors);
  }

  public static async getCompendiumCareers() {
    if (this.compendiumCareers == null) {
      this.compendiumCareers = [];
      this.compendiumCareers.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'career'
        )
      );
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
    return Object.keys(wfrp4e().config.trappingCategories);
  }

  public static async getCompendiumTrappings() {
    if (this.compendiumTrappings == null) {
      this.compendiumTrappings = [];
      const trappingCategories = CompendiumUtil.getTrappingCategories();
      this.compendiumTrappings.push(
        ...(await this.getCompendiumItems()).filter((t: Item) => {
          const type = (<any>t?.data?.data)?.trappingType?.value;
          return (
            trappingCategories.includes(t.type) ||
            trappingCategories.includes(type)
          );
        })
      );
    }
    return Promise.resolve(this.compendiumTrappings);
  }

  public static async getCompendiumBestiary() {
    if (this.compendiumBestiary == null) {
      this.compendiumBestiary = {};

      const actorsMap = await this.getCompendiumActors();

      for (let [key, actors] of Object.entries(actorsMap)) {
        const creatures = actors.filter((c) => c.data?.type === 'creature');
        if (creatures.length > 0) {
          this.compendiumBestiary[key] = creatures;
        }
      }
    }
    return Promise.resolve(this.compendiumBestiary);
  }

  public static async getCompendiumSkills() {
    if (this.compendiumSkills == null) {
      this.compendiumSkills = [];
      this.compendiumSkills.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'skill'
        )
      );
    }
    return Promise.resolve(this.compendiumSkills);
  }

  public static async getCompendiumTalents() {
    if (this.compendiumTalents == null) {
      this.compendiumTalents = [];
      this.compendiumTalents.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'talent'
        )
      );
    }
    return Promise.resolve(this.compendiumTalents);
  }

  public static async getCompendiumTraits() {
    if (this.compendiumTraits == null) {
      this.compendiumTraits = [];
      this.compendiumTraits.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'trait'
        )
      );
    }
    return Promise.resolve(this.compendiumTraits);
  }

  public static async getCompendiumSizeTrait() {
    if (this.compendiumSizeTrait == null) {
      this.compendiumSizeTrait = <Item>(
        (await this.getCompendiumTraits()).find(
          (t: Item & any) =>
            t.data.name === 'Size' ||
            t.data?.flags?.babele?.originalName === 'Size'
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
            t.data.name === 'Swarm' ||
            t.data?.flags?.babele?.originalName === 'Swarm'
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
            t.data.name === 'Weapon' ||
            t.data?.flags?.babele?.originalName === 'Weapon'
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
            t.data.name === 'Armour' ||
            t.data?.flags?.babele?.originalName === 'Armour'
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
            t.data?.flags?.babele?.originalName?.startsWith('Ranged')
        )
      );
    }
    return Promise.resolve(this.compendiumRangedTrait);
  }

  public static getSizes(): { [key: string]: string } {
    return wfrp4e().config.actorSizes;
  }

  public static async getCompendiumSpells() {
    if (this.compendiumSpells == null) {
      this.compendiumSpells = [];
      this.compendiumSpells.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'spell'
        )
      );
    }
    return Promise.resolve(this.compendiumSpells);
  }

  public static async getCompendiumPrayers() {
    if (this.compendiumPrayers == null) {
      this.compendiumPrayers = [];
      this.compendiumPrayers.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) => c.type === 'prayer'
        )
      );
    }
    return Promise.resolve(this.compendiumPrayers);
  }

  public static async getCompendiumPhysicalMutations() {
    if (this.compendiumPhysicalMutations == null) {
      this.compendiumPhysicalMutations = [];
      this.compendiumPhysicalMutations.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) =>
            c.type === 'mutation' &&
            (<any>c.data.data).mutationType.value === 'physical'
        )
      );
    }
    return Promise.resolve(this.compendiumPhysicalMutations);
  }

  public static async getCompendiumMentalMutations() {
    if (this.compendiumMentalMutations == null) {
      this.compendiumMentalMutations = [];
      this.compendiumMentalMutations.push(
        ...(await this.getCompendiumItems()).filter(
          (c: Item) =>
            c.type === 'mutation' &&
            (<any>c.data.data).mutationType.value === 'mental'
        )
      );
    }
    return Promise.resolve(this.compendiumMentalMutations);
  }

  private static loadCompendiumDocuments(pack: any): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        const docs = (await pack?.getDocuments()) ?? [];
        resolve(docs);
      } catch (e) {
        console.error(e);
        const title = pack.title;
        const collection = pack.collection;
        const message = i18n().format(
          'WFRP4NPCGEN.notification.compendium.load.error',
          {
            title: title,
            collection: collection,
          }
        );
        console.warn(message);
        notifications().warn(message);
        resolve([]);
      }
    });
  }
}
