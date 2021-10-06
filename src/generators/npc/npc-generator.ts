// import {i18n, notifications} from "../../constant.js";
import WaiterUtil from '../../util/waiter-util.js';
import CheckDependencies from '../../check-dependencies.js';
import { NpcModel } from '../../models/npc/npc-model.js';
import CompendiumUtil from '../../util/compendium-util.js';
import { SpeciesChooser } from '../../components/species-chooser.js';

export class NpcGenerator {
  public static readonly compendium = CompendiumUtil;
  public static readonly speciesChooser = SpeciesChooser;

  public static async generateNpc(
    _callback?: (model: NpcModel, actorData: any, actor: any) => void
  ) {
    await this.compendium.initCompendium(async () => {
      await this.generateNpcModel(async (_model) => {
        // const actorData = await ActorBuilder.buildActorData(model, 'npc');
        // const actor = await ActorBuilder.createActor(model, actorData);
        // notifications().info(
        //     i18n().format('WFRP4NPCGEN.notification.actor.created', {
        //         name: actor.name,
        //     })
        // );
        await WaiterUtil.hide();
        // if (callback != null) {
        //     callback(model, actorData, actor);
        // }
      });
    });
  }

  public static async generateNpcModel(callback: (model: NpcModel) => void) {
    const npcModel = new NpcModel();
    CheckDependencies.check((canRun) => {
      if (canRun) {
        this.selectSpecies(npcModel, callback);
      }
    });
  }

  private static async selectSpecies(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesChooser.selectSpecies(
      model.speciesKey,
      model.subSpeciesKey,
      model.cityBorn,
      (key: string, subKey: string, cityBorn: string) => {
        if (model.speciesKey != null && model.speciesKey !== key) {
          // model.speciesSkills = {
          //     major: [],
          //     minor: [],
          // };
          // model.speciesTalents = [];
        }
        model.speciesKey = key;
        model.subSpeciesKey = subKey;
        model.cityBorn = cityBorn;

        this.selectSpecies(model, callback);

        // this.selectCareer(model, callback);
      }
    );
  }
}
