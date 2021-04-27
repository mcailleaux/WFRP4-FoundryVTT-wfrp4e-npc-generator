import NpcModel from './npc-model.js';
import ReferentialUtil from './util/referential-util.js';
import { GenerateEffectOptionEnum } from './util/generate-effect-option.enum.js';

export class ActorBuilder {
  public static async buildActorData(model: NpcModel, type: string) {
    const moneyItems = await ReferentialUtil.getAllMoneyItems();
    const actorData = {
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
      items: [
        ...model.skills,
        ...model.careerPath,
        ...moneyItems,
        ...model.trappings,
      ],
    };
    return Promise.resolve(actorData);
  }

  public static async createActor(model: NpcModel, data: any) {
    const actor: Actor = <Actor>await Actor.create(data);
    // for (let i = 0; i < model.skills.length; i++) {
    //   await actor.createOwnedItem(model.skills[i]);
    // }
    for (let i = 0; i < model.talents.length; i++) {
      await actor.createOwnedItem(model.talents[i]);
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

    if (GenerateEffectOptionEnum.NONE !== model.options.generateArmorEffect) {
      await this.addGenerateTokenEffect(
        actor,
        'WFRP4NPCGEN.trappings.armor.label',
        GenerateEffectOptionEnum.DEFAULT_DISABLED ===
          model.options.generateArmorEffect,
        'modules/wfrp4e-core/art/other/anvil.webp'
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
