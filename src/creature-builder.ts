import CreatureModel from './creature-model.js';
import FolderUtil from './util/folder-util.js';
import TrappingUtil from './util/trapping-util.js';
import { GenerateEffectOptionEnum } from './util/generate-effect-option.enum.js';
import CompendiumUtil from './util/compendium-util.js';
import StringUtil from './util/string-util.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { i18n } from './constant.js';
import EntityUtil from './util/entity-util.js';

export default class CreatureBuilder {
  public static async buildCreatureData(model: CreatureModel) {
    const actorData: any = {
      name: model.name,
      type: 'creature',
      flags: {
        autoCalcRun: true,
        autoCalcWalk: true,
        autoCalcWounds: true,
        autoCalcCritW: true,
        autoCalcCorruption: true,
        autoCalcEnc: true,
        autoCalcSize: true,
      },
      data: {
        characteristics: model.chars,
        details: {
          move: {
            value: model.creatureTemplate.creatureData.data.details.move.value,
          },
          size: {
            value: model.abilities.sizeKey,
          },
          species: {
            value:
              model.creatureTemplate.creatureData.data.details.species?.value,
          },
          biography: {
            value:
              model.creatureTemplate.creatureData.data.details.biography?.value,
          },
          gender: {
            value:
              model.creatureTemplate.creatureData.data.details.gender?.value,
          },
          hitLocationTable: {
            value:
              model.creatureTemplate.creatureData.data.details.hitLocationTable
                ?.value,
          },
          status: {
            value:
              model.creatureTemplate.creatureData.data.details.status?.value,
          },
        },
      },
      img: model.options.imagePath,
    };
    return Promise.resolve(actorData);
  }

  public static async createCreature(model: CreatureModel, data: any) {
    if (model?.options?.genPath?.length > 0) {
      const genPaths = model?.options?.genPath
        .split('/')
        .filter((p) => p != null && p.length > 0);
      const folder = await FolderUtil.createNamedFolder(genPaths.join('/'));
      data.folder = folder?.id;
    }

    let actor: Actor = <Actor>await Actor.create(data);
    if (model.abilities.skills.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.abilities.skills)
      );
    }
    if (model.abilities.talents.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.abilities.talents)
      );
    }
    if (model.abilities.traits.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.abilities.traits)
      );
    }
    const weapon = await CompendiumUtil.getCompendiumWeaponTrait();
    const ranged = await CompendiumUtil.getCompendiumRangedTrait();
    const swarm = await CompendiumUtil.getCompendiumSwarmTrait();
    const armour = await CompendiumUtil.getCompendiumArmourTrait();
    const excludedTraitIds = model.abilities.traits
      .filter((t: ItemData & any) => !t.included)
      .map((t: ItemData & any) => {
        let actorTrait;
        if (weapon.name === t.name) {
          actorTrait = (<any>actor.data).traits.find(
            (at: ItemData & any) => at.name === weapon.name
          );
        } else if (
          StringUtil.getSimpleName(ranged.name ?? '') ===
          StringUtil.getSimpleName(t.name)
        ) {
          actorTrait = (<any>actor.data).traits.find(
            (at: ItemData & any) =>
              StringUtil.getSimpleName(at.name) ===
              StringUtil.getSimpleName(ranged.name ?? '')
          );
        } else if (swarm.name === t.name) {
          actorTrait = (<any>actor.data).traits.find(
            (at: ItemData & any) => at.name === swarm.name
          );
        } else if (armour.name === t.name) {
          actorTrait = (<any>actor.data).traits.find(
            (at: ItemData & any) => at.name === armour.name
          );
        } else {
          actorTrait = (<any>actor.data).traits.find(
            (at: ItemData & any) => at.displayName === t.displayName
          );
        }
        return actorTrait?._id ?? t._id;
      });
    if (excludedTraitIds.length > 0) {
      actor = <Actor>await actor.update({
        'data.excludedTraits': excludedTraitIds,
      });
    }
    if (model.trappings.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.trappings)
      );
    }
    if (model.spells.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.spells)
      );
    }
    if (model.prayers.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.prayers)
      );
    }
    if (model.physicalMutations.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.physicalMutations)
      );
    }
    if (model.mentalMutations.length > 0) {
      await actor.createEmbeddedDocuments(
        Item.metadata.name,
        EntityUtil.toRecords(model.mentalMutations)
      );
    }

    if (model?.options?.withInitialMoney) {
      await TrappingUtil.generateMoney(actor);
    }

    if (
      !model?.options?.withLinkedToken &&
      !model?.options?.withInitialMoney &&
      GenerateEffectOptionEnum.NONE !== model.options.generateMoneyEffect
    ) {
      await this.addGenerateTokenEffect(
        actor,
        'WFRP4NPCGEN.trappings.money.label',
        GenerateEffectOptionEnum.DEFAULT_DISABLED ===
          model.options.generateMoneyEffect,
        'modules/wfrp4e-core/art/other/gold.webp'
      );
    }

    const token = actor.data?.token;
    const update: any = {};
    let performUpdate = false;

    if (
      token != null &&
      model.options?.tokenPath != null &&
      model.options.tokenPath.length > 0
    ) {
      performUpdate = true;
      update.img = model.options.tokenPath;
      update.randomImg = model.options.tokenPath.includes('*');
    }

    if (token != null && model.options?.withLinkedToken) {
      performUpdate = true;
      update.actorLink = model.options?.withLinkedToken;
    }

    if (performUpdate) {
      actor = <Actor>await actor.update({
        token: mergeObject(token, update, { inplace: false }),
      });
    }

    return Promise.resolve(actor);
  }

  private static async addGenerateTokenEffect(
    actor: Actor,
    label: string,
    disabled: boolean,
    icon?: string
  ) {
    const generateEffect: any = {
      icon: icon,
      label: i18n().localize(label),
      disabled: disabled,
    };
    generateEffect['flags.wfrp4e.effectApplication'] = 'actor';
    await actor.createEmbeddedDocuments(
      ActiveEffect.metadata.name,
      generateEffect
    );
  }
}
