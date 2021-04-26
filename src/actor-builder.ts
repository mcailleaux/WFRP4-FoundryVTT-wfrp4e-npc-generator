import NpcModel from './npc-model.js';
import ReferentialUtil from './util/referential-util.js';

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
      items: [...model.skills, ...model.careerPath, ...moneyItems],
      effects: [
        {
          name: 'Generate Money On Token Creation',
        },
      ],
    };
    return Promise.resolve(actorData);
  }

  public static async createActor(model: NpcModel, data: any) {
    const actor: Actor = <Actor>await Actor.create(data);
    for (let i = 0; i < model.talents.length; i++) {
      await actor.createOwnedItem(model.talents[i]);
    }

    return Promise.resolve(actor);
  }
}
