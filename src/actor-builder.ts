import NpcModel from './npc-model.js';
import ReferentialUtil from './util/referential-util.js';
import { GenerateEffectOptionEnum } from './util/generate-effect-option.enum.js';
import FolderUtil from './util/folder-util.js';

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
      items: [...model.careerPath, ...moneyItems, ...model.trappings],
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
      const folder = await FolderUtil.createNamedFolder(
        model?.options?.genPath
      );
      data.folder = folder?._id;
    }

    const actor: Actor = <Actor>await Actor.create(data);
    for (let skill of model.skills) {
      await actor.createOwnedItem(skill);
    }
    for (let talent of model.talents) {
      await actor.createOwnedItem(talent);
    }

    const token = actor.data?.token;
    if (
      token != null &&
      model.options?.tokenPath != null &&
      model.options.tokenPath.length > 0
    ) {
      token.img = model.options.tokenPath;
      token.actorLink = token.img.includes('*');
      await actor.updateOwnedItem(token);
    }

    if (GenerateEffectOptionEnum.NONE !== model.options.generateMoneyEffect) {
      await this.addGenerateTokenEffect(
        actor,
        'WFRP4NPCGEN.trappings.money.label',
        GenerateEffectOptionEnum.DEFAULT_DISABLED ===
          model.options.generateMoneyEffect,
        'modules/wfrp4e-core/art/other/gold.webp'
      );
    }

    if (GenerateEffectOptionEnum.NONE !== model.options.generateWeaponEffect) {
      await this.addGenerateTokenEffect(
        actor,
        'WFRP4NPCGEN.trappings.weapon.label',
        GenerateEffectOptionEnum.DEFAULT_DISABLED ===
          model.options.generateWeaponEffect,
        'modules/wfrp4e-core/art/other/weapons.webp'
      );
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
