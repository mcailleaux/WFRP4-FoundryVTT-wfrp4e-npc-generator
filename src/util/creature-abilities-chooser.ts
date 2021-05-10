import CreatureAbilities from './creature-abilities.js';
import ReferentialUtil from './referential-util.js';
import EntityUtil from './entity-util.js';
import CompendiumUtil from './compendium-util.js';
import DialogUtil from './dialog-util.js';

export default class CreatureAbilitiesChooser {
  public static async selectCreatureAbilities(
    initAbilities: CreatureAbilities,
    callback: (abilities: CreatureAbilities) => void,
    undo: () => void
  ) {
    const dialogId = new Date().getTime();
    const swarm: Item & any = await CompendiumUtil.getCompendiumSwarmTrait();
    const weapon: Item & any = await CompendiumUtil.getCompendiumWeaponTrait();
    const armour: Item & any = await CompendiumUtil.getCompendiumArmourTrait();
    const ranged: Item & any = await CompendiumUtil.getCompendiumRangedTrait();
    const size: Item & any = await CompendiumUtil.getCompendiumSizeTrait();

    // const skills = await ReferentialUtil.getSkillEntities(true);
    // const talents = await ReferentialUtil.getTalentEntities(true);
    const traits = [
      ...initAbilities.traits.sort(
        (t1: Item.Data & any, t2: Item.Data & any) => {
          return t1.displayName.localeCompare(t2.displayName);
        }
      ),
      ...(await ReferentialUtil.getTraitEntities(true))
        .filter((t) => {
          return (
            !EntityUtil.match(t, swarm) &&
            !EntityUtil.match(t, weapon) &&
            !EntityUtil.match(t, armour) &&
            !EntityUtil.match(t, ranged) &&
            !EntityUtil.match(t, size)
          );
        })
        .map((t) => t.data)
        .sort((t1, t2) => {
          return t1.name.localeCompare(t2.name);
        }),
    ];

    // const skillsId = `add-remove-skills-${dialogId}`;
    // const talentsId = `add-remove-talents-${dialogId}`;
    const traitsId = `add-remove-traits-${dialogId}`;

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.creatures.abilities.select.title'),
      content: `<form>
              
              <div class="form-group">
              ${DialogUtil.getSelectAddRemoveScript(
                traitsId,
                'WFRP4NPCGEN.creatures.abilities.select.traits.title',
                `
                ${DialogUtil.getLabelScript(
                  'WFRP4NPCGEN.creatures.abilities.select.traits.title'
                )}
                ${DialogUtil.getLabelScript('')}
                `,
                EntityUtil.toSelectOption(traits),
                initAbilities?.traits?.map((t: Item.Data & any) => {
                  return { key: t._id, value: t.displayName ?? t.name };
                })
              )}
              </div>
              
          </form>
          <script>  
              
              ${DialogUtil.getAddRemoveElementScript()}
                
            </script>
            `,
      buttons: DialogUtil.getDialogButtons(
        dialogId,
        (_html: JQuery) => {
          callback(initAbilities);
        },
        undo
      ),
      default: 'yes',
    }).render(true);
  }
}
