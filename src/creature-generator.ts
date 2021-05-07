import CompendiumUtil from './util/compendium-util.js';
import CheckDependencies from './check-dependencies.js';
import CreatureModel from './creature-model.js';
import CreatureBuilder from './creature-builder.js';
import CreatureChooser from './util/creature-chooser.js';

export default class CreatureGenerator {
  public static creatureChooser = CreatureChooser;

  public static async generateCreature(
    callback?: (model: CreatureModel, actorData: any, actor: any) => void
  ) {
    await CompendiumUtil.initCompendium();
    await this.generateCreatureModel(async (model) => {
      const actorData = await CreatureBuilder.buildCreatureData(model);
      const actor = await CreatureBuilder.createCreature(model, actorData);
      ui.notifications.info(
        game.i18n.format('WFRP4NPCGEN.notification.creature.created', {
          name: actor.name,
        })
      );
      if (callback != null) {
        callback(model, actorData, actor);
      }
    });
  }

  public static async generateCreatureModel(
    callback: (model: CreatureModel) => void
  ) {
    const creatureModel = new CreatureModel();
    CheckDependencies.check((canRun) => {
      if (canRun) {
        this.selectCreature(creatureModel, callback);
      }
    });
  }

  private static async selectCreature(
    _model: CreatureModel,
    _callback: (model: CreatureModel) => void
  ) {}
}
