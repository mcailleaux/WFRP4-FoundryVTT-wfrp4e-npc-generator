// import {i18n, notifications} from "../../constant.js";
import WaiterUtil from '../../util/waiter-util.js';
import CheckDependencies from '../../check-dependencies.js';
import { NpcModel } from '../../models/npc/npc-model.js';
import CompendiumUtil from '../../util/compendium-util.js';
import { SpeciesChooser } from '../../components/species-chooser.js';
import { CareerChooser } from '../../components/career-chooser.js';
import { SpeciesSkillsChooser } from '../../components/species-skills-chooser.js';
import ReferentialUtil from '../../util/referential-util.js';
import { SpeciesOthersChooser } from '../../components/species-others-chooser.js';
import { SpeciesOthers } from '../../models/npc/species-others.js';
import { SpeciesSkills } from '../../models/npc/species-skills.js';

export class NpcGenerator {
  public static readonly compendium = CompendiumUtil;
  public static readonly referential = ReferentialUtil;
  public static readonly speciesChooser = SpeciesChooser;
  public static readonly careerChooser = CareerChooser;
  public static readonly speciesSkillsChooser = SpeciesSkillsChooser;
  public static readonly speciesOthersChooser = SpeciesOthersChooser;

  public static async generateNpc(
    _callback?: (model: NpcModel, actorData: any, actor: any) => void
  ) {
    await this.referential.initReferential(async () => {
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
        if (model.speciesKey !== key || model.subSpeciesKey !== subKey) {
          model.speciesSkills = new SpeciesSkills();
          model.speciesOthers = new SpeciesOthers();
        }
        model.speciesKey = key;
        model.subSpeciesKey = subKey;
        model.cityBorn = cityBorn;

        this.selectCareer(model, callback);
      }
    );
  }

  private static async selectCareer(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.careerChooser.selectCareer(
      model.careers,
      model.speciesKey,
      model.subSpeciesKey,
      (careers: string[]) => {
        model.careers = careers;

        this.selectSpeciesSkills(model, callback);
      },
      () => {
        this.selectSpecies(model, callback);
      }
    );
  }

  private static async selectSpeciesSkills(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesSkillsChooser.selectSpeciesSkills(
      model.speciesSkills.majors,
      model.speciesSkills.minors,
      model.speciesKey,
      model.subSpeciesKey,
      (majors: string[], minors: string[]) => {
        model.speciesSkills.majors = majors;
        model.speciesSkills.minors = minors;

        this.selectSpeciesOthers(model, callback);
      },
      () => {
        this.selectCareer(model, callback);
      }
    );
  }

  private static async selectSpeciesOthers(
    model: NpcModel,
    callback: (model: NpcModel) => void
  ) {
    await this.speciesOthersChooser.selectSpeciesOthers(
      model.speciesOthers.others,
      model.speciesOthers.randomTalents,
      model.speciesOthers.originKey,
      model.speciesOthers.origin,
      model.speciesKey,
      model.subSpeciesKey,
      (
        others: string[],
        randomTalents: string[],
        originKey: string,
        origin: string[]
      ) => {
        model.speciesOthers.others = others;
        model.speciesOthers.randomTalents = randomTalents;
        model.speciesOthers.originKey = originKey;
        model.speciesOthers.origin = origin;

        this.selectSpeciesOthers(model, callback);

        // this.selectName(model, callback);
      },
      () => {
        this.selectSpeciesSkills(model, callback);
      }
    );
  }
}
