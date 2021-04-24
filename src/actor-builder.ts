import NpcModel from './npc-model.js';

export class ActorBuilder {
  public static async buildActorData(model: NpcModel, type: string) {
    let moneyItems: Item.Data[] =
      (await game.wfrp4e.utility.allMoneyItems()) ?? [];
    moneyItems = moneyItems.sort((a, b) => {
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
      },
      items: [
        ...model.skills,
        ...model.talents,
        ...model.careerPath,
        ...moneyItems,
      ],
    };
    return Promise.resolve(actorData);
  }
}
