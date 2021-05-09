import CompendiumUtil from './util/compendium-util.js';
import CheckDependencies from './check-dependencies.js';
import CreatureModel from './creature-model.js';
import CreatureChooser from './util/creature-chooser.js';
import NameChooser from './util/name-chooser.js';
import ReferentialUtil from './util/referential-util.js';
import TranslateErrorDetect from './util/translate-error-detect.js';

export default class CreatureGenerator {
  public static readonly creatureChooser = CreatureChooser;
  public static readonly nameChooser = NameChooser;
  public static readonly referential = ReferentialUtil;
  public static readonly translateErrorDetect = TranslateErrorDetect;

  public static async generateCreature(
    callback?: (model: CreatureModel, actorData: any, actor: any) => void
  ) {
    await CompendiumUtil.initCompendium(true);
    await this.generateCreatureModel(async (model) => {
      // const actorData = await CreatureBuilder.buildCreatureData(model);
      // const actor = await CreatureBuilder.createCreature(model, actorData);
      // ui.notifications.info(
      //   game.i18n.format('WFRP4NPCGEN.notification.creature.created', {
      //     name: actor.name,
      //   })
      // );
      if (callback != null) {
        // callback(model, actorData, actor);
        callback(model, null, null);
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
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    await this.creatureChooser.selectCreature(
      model.creatureData?._id,
      async (creature: Actor.Data & any) => {
        model.creatureData = creature;

        const swarm: Item &
          any = await CompendiumUtil.getCompendiumSwarmTrait();
        const weapon: Item &
          any = await CompendiumUtil.getCompendiumWeaponTrait();
        const armor: Item &
          any = await CompendiumUtil.getCompendiumArmorTrait();

        model.abilities.includeBasicSkills = creature.basicSkills?.length > 0;
        model.abilities.sizeKey = creature.data?.details?.size?.value;
        model.abilities.isSwarm =
          creature.traits?.find(
            (t: any) =>
              (t.name === swarm.name || t.name === swarm.data.originalName) &&
              t.included
          ) != null;
        model.abilities.hasWeaponTrait =
          creature.traits?.find(
            (t: any) =>
              (t.name === weapon.name || t.name === weapon.data.originalName) &&
              t.included
          ) != null;
        model.abilities.hasArmourTrait =
          creature.traits?.find(
            (t: any) =>
              (t.name === armor.name || t.name === armor.data.originalName) &&
              t.included
          ) != null;

        await this.selectCreatureAbilities(model, callback);
      }
    );
  }

  private static async selectCreatureAbilities(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    console.dir(model);
    callback(model);
  }
}
