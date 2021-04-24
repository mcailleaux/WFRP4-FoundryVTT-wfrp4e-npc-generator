import NpcModel from './npc-model.js';

export class ActorBuilder {
  public static async buildActorData(model: NpcModel, type: string) {
    let moneyItems: Item.Data[] =
      (await game.wfrp4e.utility.allMoneyItems()) ?? [];
    moneyItems = moneyItems
      .map((mi) => {
        (<any>mi.data).quantity.value = 0;
        return mi;
      })
      .sort((a, b) => {
        const aData: any = a.data;
        const bData: any = b.data;
        return aData.coinValue.value > bData.coinValue.value ? -1 : 1;
      });
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
        // ...model.talents,
        ...model.careerPath,
        ...moneyItems,
      ],
      // effects: model.effects,
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
