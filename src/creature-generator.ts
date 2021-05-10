import CompendiumUtil from './util/compendium-util.js';
import CheckDependencies from './check-dependencies.js';
import CreatureModel from './creature-model.js';
import CreatureChooser from './util/creature-chooser.js';
import NameChooser from './util/name-chooser.js';
import ReferentialUtil from './util/referential-util.js';
import TranslateErrorDetect from './util/translate-error-detect.js';
import StringUtil from './util/string-util.js';

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
      model.creatureTemplate.creatureData?._id,
      async (creature: Actor.Data & any) => {
        model.creatureTemplate.creatureData = creature;

        const swarm: Item &
          any = await CompendiumUtil.getCompendiumSwarmTrait();
        const weapon: Item &
          any = await CompendiumUtil.getCompendiumWeaponTrait();
        const armour: Item &
          any = await CompendiumUtil.getCompendiumArmourTrait();
        const ranged: Item &
          any = await CompendiumUtil.getCompendiumRangedTrait();

        const findTraits = (item: any, ref: Item & any) => {
          return (
            StringUtil.getSimpleName(item.name) ===
              StringUtil.getSimpleName(ref.name) ||
            StringUtil.getSimpleName(item.name) ===
              StringUtil.getSimpleName(ref.data.originalName)
          );
        };

        model.creatureTemplate.swarm = creature.traits?.find((t: any) =>
          findTraits(t, swarm)
        );

        model.creatureTemplate.weapon = creature.traits?.find((t: any) =>
          findTraits(t, weapon)
        );

        model.creatureTemplate.armour = creature.traits?.find((t: any) =>
          findTraits(t, armour)
        );

        model.creatureTemplate.ranged = creature.traits?.find((t: any) =>
          findTraits(t, ranged)
        );

        if (model.creatureTemplate.armour != null) {
          model.creatureTemplate.armorValue = StringUtil.getGroupName(
            model.creatureTemplate.armour.displayName
          );
        }

        if (model.creatureTemplate.ranged != null) {
          model.creatureTemplate.rangedValue = StringUtil.getGroupName(
            model.creatureTemplate.ranged.name
          );
        }

        model.abilities.includeBasicSkills = creature.basicSkills?.length > 0;
        model.abilities.sizeKey = creature.data?.details?.size?.value;
        model.abilities.isSwarm =
          model.creatureTemplate.swarm != null &&
          model.creatureTemplate.swarm.included;
        model.abilities.hasWeaponTrait =
          model.creatureTemplate.weapon != null &&
          model.creatureTemplate.weapon.included;
        model.abilities.hasArmourTrait =
          model.creatureTemplate.armour != null &&
          model.creatureTemplate.armour.included;
        model.abilities.hasRangedTrait =
          model.creatureTemplate.ranged != null &&
          model.creatureTemplate.ranged.included;

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
