import NpcModel from './npc-model.js';
import ReferentialUtil from './util/referential-util.js';
import { GenerateEffectOptionEnum } from './util/generate-effect-option.enum.js';
import FolderUtil from './util/folder-util.js';
import TrappingUtil from './util/trapping-util.js';

export class ActorBuilder {
  public static async buildActorData(model: NpcModel, type: string) {
    const moneyItems = await ReferentialUtil.getAllMoneyItems();
    const actorData: any = {
      name: model.name,
      type: type,
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
            value: model.move,
          },
          species: {
            value: model.speciesValue,
          },
          status: {
            value: model.status,
          },
        },
      },
      items: [...model.careerPath, ...moneyItems],
    };
    if (
      model.options?.imagePath != null &&
      model.options.imagePath.length > 0
    ) {
      actorData.img = model.options.imagePath;
    }
    return Promise.resolve(actorData);
  }

  public static async createActor(model: NpcModel, data: any) {
    if (model?.options?.genPath?.length > 0) {
      const genPaths = model?.options?.genPath
        .split('/')
        .filter((p) => p != null && p.length > 0);
      if (model?.options?.withGenPathCareerName) {
        genPaths.push(model.career.name);
      }
      const folder = await FolderUtil.createNamedFolder(genPaths.join('/'));
      data.folder = folder?._id;
    }

    let actor: Actor = <Actor>await Actor.create(data);
    for (let skill of model.skills) {
      await actor.createOwnedItem(skill);
    }
    for (let talent of model.talents) {
      await actor.createOwnedItem(talent);
    }
    for (let trapping of model.trappings) {
      await actor.createOwnedItem(trapping);
    }

    if (model?.options?.withInitialMoney) {
      await TrappingUtil.generateMoney(actor);
    }

    if (model?.options?.withInitialWeapons) {
      await TrappingUtil.generateWeapons(actor);
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

    if (
      !model?.options?.withLinkedToken &&
      !model?.options?.withInitialWeapons &&
      GenerateEffectOptionEnum.NONE !== model.options.generateWeaponEffect
    ) {
      await this.addGenerateTokenEffect(
        actor,
        'WFRP4NPCGEN.trappings.weapon.label',
        GenerateEffectOptionEnum.DEFAULT_DISABLED ===
          model.options.generateWeaponEffect,
        'modules/wfrp4e-core/art/other/weapons.webp'
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
      label: game.i18n.localize(label),
      disabled: disabled,
    };
    generateEffect['flags.wfrp4e.effectApplication'] = 'actor';
    await (<any>actor).createEmbeddedEntity('ActiveEffect', generateEffect);
  }
}
