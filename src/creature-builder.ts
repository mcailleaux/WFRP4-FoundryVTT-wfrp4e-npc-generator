import CreatureModel from './creature-model.js';

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
            value: model.move,
          },
          species: {
            value: model.speciesValue,
          },
        },
      },
      img: model.creatureData.img,
    };
    return Promise.resolve(actorData);
  }

  public static async createCreature(_model: CreatureModel, data: any) {
    let actor: Actor = <Actor>await Actor.create(data);
    return Promise.resolve(actor);
  }
}
