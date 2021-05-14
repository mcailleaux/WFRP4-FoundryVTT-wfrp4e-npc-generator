import CompendiumUtil from './util/compendium-util.js';
import CheckDependencies from './check-dependencies.js';
import CreatureModel from './creature-model.js';
import CreatureChooser from './util/creature-chooser.js';
import NameChooser from './util/name-chooser.js';
import ReferentialUtil from './util/referential-util.js';
import TranslateErrorDetect from './util/translate-error-detect.js';
import StringUtil from './util/string-util.js';
import EntityUtil from './util/entity-util.js';
import CreatureAbilitiesChooser from './util/creature-abilities-chooser.js';
import CreatureAbilities from './util/creature-abilities.js';
import CreatureTemplate from './util/creature-template.js';
import Options from './util/options.js';
import OptionsChooser from './util/options.chooser.js';
import WaiterUtil from './util/waiter-util.js';
import TrappingChooser from './util/trapping-chooser.js';
import MagicsChooser from './util/magics-chooser.js';
import MutationsChooser from './util/mutations-chooser.js';

export default class CreatureGenerator {
  public static readonly creatureChooser = CreatureChooser;
  public static readonly creatureAbilitiesChooser = CreatureAbilitiesChooser;
  public static readonly nameChooser = NameChooser;
  public static readonly optionsChooser = OptionsChooser;
  public static readonly trappingChooser = TrappingChooser;
  public static readonly magicsChooser = MagicsChooser;
  public static readonly mutationsChooser = MutationsChooser;
  public static readonly referential = ReferentialUtil;
  public static readonly translateErrorDetect = TranslateErrorDetect;

  public static async generateCreature(
    callback?: (model: CreatureModel, actorData: any, actor: any) => void
  ) {
    await CompendiumUtil.initCompendium(async () => {
      await this.generateCreatureModel(async (model) => {
        // const actorData = await CreatureBuilder.buildCreatureData(model);
        // const actor = await CreatureBuilder.createCreature(model, actorData);
        // ui.notifications.info(
        //   game.i18n.format('WFRP4NPCGEN.notification.creature.created', {
        //     name: actor.name,
        //   })
        // );
        console.dir(model);
        if (callback != null) {
          // callback(model, actorData, actor);
          callback(model, null, null);
        }
      });
    }, true);
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
        model.creatureTemplate = new CreatureTemplate();
        model.abilities = new CreatureAbilities();
        model.trappings = [];
        model.spells = [];
        model.prayers = [];
        model.physicalMutations = [];
        model.mentalMutations = [];
        model.creatureTemplate.creatureData = creature;

        const swarm: Item &
          any = await CompendiumUtil.getCompendiumSwarmTrait();
        const weapon: Item &
          any = await CompendiumUtil.getCompendiumWeaponTrait();
        const armour: Item &
          any = await CompendiumUtil.getCompendiumArmourTrait();
        const ranged: Item &
          any = await CompendiumUtil.getCompendiumRangedTrait();
        const size: Item & any = await CompendiumUtil.getCompendiumSizeTrait();

        model.creatureTemplate.swarm = duplicate(
          creature.traits
        )?.find((t: any) => EntityUtil.match(t, swarm));

        model.creatureTemplate.weapon = duplicate(
          creature.traits
        )?.find((t: any) => EntityUtil.match(t, weapon));

        model.creatureTemplate.armour = duplicate(
          creature.traits
        )?.find((t: any) => EntityUtil.match(t, armour));

        model.creatureTemplate.ranged = duplicate(
          creature.traits
        )?.find((t: any) => EntityUtil.match(t, ranged));

        if (model.creatureTemplate.armour != null) {
          model.creatureTemplate.armourValue = StringUtil.getGroupName(
            model.creatureTemplate.armour.displayName
          );
        }

        if (model.creatureTemplate.weapon != null) {
          model.creatureTemplate.weaponDamage = String(
            model.creatureTemplate.weapon.damage -
              model.creatureTemplate.weapon.bonus
          );
        }

        if (model.creatureTemplate.ranged != null) {
          model.creatureTemplate.rangedRange = StringUtil.getGroupName(
            model.creatureTemplate.ranged.name
          );
          model.creatureTemplate.rangedDamage = StringUtil.getGroupName(
            model.creatureTemplate.ranged.displayName.substring(
              model.creatureTemplate.ranged.displayName.indexOf(')') + 1
            )
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
        model.abilities.weaponDamage = model.creatureTemplate.weaponDamage;
        model.abilities.rangedRange = model.creatureTemplate.rangedRange;
        model.abilities.rangedDamage = model.creatureTemplate.rangedDamage;
        model.abilities.armourValue = model.creatureTemplate.armourValue;

        const traits = creature.traits.filter((t: any) => {
          return (
            !EntityUtil.match(t, swarm) &&
            !EntityUtil.match(t, weapon) &&
            !EntityUtil.match(t, armour) &&
            !EntityUtil.match(t, ranged) &&
            !EntityUtil.match(t, size)
          );
        });
        const compendiumTraits = await ReferentialUtil.getTraitEntities(true);
        for (let trait of traits) {
          const finalTrait = duplicate(
            compendiumTraits.find(
              (t: Item & any) =>
                t.data.name === trait.displayName ||
                t.data.originalName === trait.displayName
            )?.data ?? trait
          );
          finalTrait.displayName = trait.displayName;
          finalTrait.included = trait.included;
          model.abilities.traits.push(finalTrait);
        }

        const skills = creature.skills.filter((s: any) => {
          return s.data.advances.value > 0;
        });
        const compendiumSkills = await ReferentialUtil.getSkillEntities(true);
        for (let skill of skills) {
          const finalSkill =
            compendiumSkills.find(
              (s: Item & any) =>
                s.data.name === skill.name || s.data.originalName === skill.name
            )?.data ?? skill;
          finalSkill.data.advances.value = skill.data.advances.value;
          model.abilities.skills.push(duplicate(finalSkill));
        }

        const talents = creature.talents;
        const compendiumTalents = await ReferentialUtil.getTalentEntities(true);
        for (let talent of talents) {
          const finalTalent =
            compendiumTalents.find(
              (t: Item & any) =>
                t.data.name === talent.name ||
                t.data.originalName === talent.name
            )?.data ?? talent;
          finalTalent.data.advances.value = talent.data.advances.value;
          model.abilities.talents.push(duplicate(finalTalent));
        }

        for (let inventory of Object.values(creature.inventory)) {
          model.trappings.push(...(<any>inventory).items);
        }

        model.spells = creature.spells;
        model.prayers = creature.prayers;
        model.physicalMutations = creature.mutations.filter(
          (m: Item.Data) => (<any>m.data).mutationType.value === 'physical'
        );
        model.mentalMutations = creature.mutations.filter(
          (m: Item.Data) => (<any>m.data).mutationType.value === 'mental'
        );

        await this.selectCreatureAbilities(model, callback);
      }
    );
  }

  private static async selectCreatureAbilities(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    await this.creatureAbilitiesChooser.selectCreatureAbilities(
      model.abilities,
      (abilities) => {
        model.abilities = abilities;
        callback(model);
      },
      () => {
        this.selectCreature(model, callback);
      }
    );
  }

  private static async selectName(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    if (model.name == null) {
      const swarm = await CompendiumUtil.getCompendiumSwarmTrait();
      const swarmLabel = model.abilities.isSwarm ? `, ${swarm.name}` : '';

      model.name = `${model.creatureTemplate.creatureData.name} (${
        CompendiumUtil.getSizes()[model.abilities.sizeKey]
      }${swarmLabel})`;
    }
    await this.nameChooser.selectName(
      model.name,
      model.abilities.speciesKey,
      model.abilities.speciesKey != null,
      (name: string) => {
        model.name = name;
        this.selectOptions(model, callback);
      },
      () => {
        this.selectCreatureAbilities(model, callback);
      }
    );
  }

  private static async selectOptions(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    model.options.imagePath = model.creatureTemplate.creatureData.img ?? '';
    model.options.tokenPath =
      model.creatureTemplate.creatureData.token?.img ?? '';

    await this.optionsChooser.selectOptions(
      true,
      model.options,
      'creature',
      (options: Options) => {
        model.options = options;
        this.finalize(model, callback);
      },
      () => {
        this.selectName(model, callback);
      }
    );
  }

  private static async finalize(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    await WaiterUtil.show(
      'WFRP4NPCGEN.creature.generation.inprogress.title',
      'WFRP4NPCGEN.creature.generation.inprogress.hint',
      async () => {
        await this.editTrappings(model, callback);
      }
    );
  }

  private static async editTrappings(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    if (model.options.editTrappings) {
      await WaiterUtil.hide(false);
      await this.trappingChooser.selectTrappings(
        model.trappings,
        async (trappings) => {
          model.trappings = trappings;
          await this.editMagics(model, callback);
        }
      );
    } else {
      await this.editMagics(model, callback);
    }
  }

  private static async editMagics(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    if (model.options.addMagics) {
      await WaiterUtil.hide(false);
      await this.magicsChooser.selectMagics(
        model.spells,
        model.prayers,
        async (spells, prayers) => {
          model.spells = spells;
          model.prayers = prayers;
          await this.editMutations(model, callback);
        }
      );
    } else {
      await this.editMutations(model, callback);
    }
  }

  private static async editMutations(
    model: CreatureModel,
    callback: (model: CreatureModel) => void
  ) {
    if (model.options.addMutations) {
      await WaiterUtil.hide(false);
      await this.mutationsChooser.selectMutations(
        model.physicalMutations,
        model.mentalMutations,
        async (physicals, mentals) => {
          await WaiterUtil.show(
            'WFRP4NPCGEN.creature.generation.inprogress.title',
            'WFRP4NPCGEN.creature.generation.inprogress.hint',
            async () => {
              model.physicalMutations = physicals;
              model.mentalMutations = mentals;
              callback(model);
            }
          );
        }
      );
    } else {
      await WaiterUtil.show(
        'WFRP4NPCGEN.creature.generation.inprogress.title',
        'WFRP4NPCGEN.creature.generation.inprogress.hint',
        async () => {
          callback(model);
        }
      );
    }
  }
}
