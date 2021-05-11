import CreatureAbilities from './creature-abilities.js';
import ReferentialUtil from './referential-util.js';
import EntityUtil from './entity-util.js';
import CompendiumUtil from './compendium-util.js';
import DialogUtil from './dialog-util.js';
import StringUtil from './string-util.js';

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

    const initSkillssNames = initAbilities.skills.map((s) => s.name);
    const skills = [
      ...initAbilities.skills.sort((s1, s2) => {
        return s1.name.localeCompare(s2.name);
      }),
      ...(await ReferentialUtil.getSkillEntities(true))
        .filter((s) => {
          return !StringUtil.arrayIncludesDeburrIgnoreCase(
            initSkillssNames,
            s.name
          );
        })
        .map((s) => s.data)
        .sort((s1, s2) => {
          return s1.name.localeCompare(s2.name);
        }),
    ];
    const initTalentsNames = initAbilities.talents.map((t) => t.name);
    const talents = [
      ...initAbilities.talents.sort((t1, t2) => {
        return t1.name.localeCompare(t2.name);
      }),
      ...(await ReferentialUtil.getTalentEntities(true))
        .filter((t) => {
          return !StringUtil.arrayIncludesDeburrIgnoreCase(
            initTalentsNames,
            t.name
          );
        })
        .map((t) => t.data)
        .sort((t1, t2) => {
          return t1.name.localeCompare(t2.name);
        }),
    ];
    const initTraitsNames = initAbilities.traits.map((t) => t.name);
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
            !EntityUtil.match(t, size) &&
            !StringUtil.arrayIncludesDeburrIgnoreCase(initTraitsNames, t.name)
          );
        })
        .map((t) => t.data)
        .sort((t1, t2) => {
          return t1.name.localeCompare(t2.name);
        }),
    ];

    const skillsId = `add-remove-skills-${dialogId}`;
    const talentsId = `add-remove-talents-${dialogId}`;
    const traitsId = `add-remove-traits-${dialogId}`;

    new Dialog({
      title: game.i18n.localize('WFRP4NPCGEN.creatures.abilities.select.title'),
      content: `<form>
              
              <div class="form-group">
              ${DialogUtil.getSelectAddRemoveScript({
                id: traitsId,
                title: 'WFRP4NPCGEN.creatures.abilities.select.traits.title',
                captions: `
                ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
                ${DialogUtil.getLabelScript(
                  'WFRP4NPCGEN.creatures.abilities.select.traits.included.label',
                  'max-width: 60px;'
                )}
                ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
                `,
                options: EntityUtil.toSelectOption(traits),
                initValues: initAbilities?.traits?.map((t: Item.Data & any) => {
                  return {
                    key: t._id,
                    value: t.displayName ?? t.name,
                    check: t.included,
                  };
                }),
                withCheck: true,
              })}
              </div>
              
              <div class="form-group">
              ${DialogUtil.getSelectAddRemoveScript({
                id: skillsId,
                title: 'WFRP4NPCGEN.creatures.abilities.select.skills.title',
                captions: `
                ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
                ${DialogUtil.getLabelScript(
                  'WFRP4NPCGEN.creatures.abilities.select.advances.label',
                  'max-width: 80px;'
                )}
                ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
                `,
                options: EntityUtil.toSelectOption(skills),
                initValues: initAbilities?.skills?.map((s: Item.Data & any) => {
                  return {
                    key: s._id,
                    value: s.displayName ?? s.name,
                    count: s.data.advances.value,
                  };
                }),
                withCount: true,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getSelectAddRemoveScript({
                id: talentsId,
                title: 'WFRP4NPCGEN.creatures.abilities.select.talents.title',
                captions: `
                ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
                ${DialogUtil.getLabelScript(
                  'WFRP4NPCGEN.creatures.abilities.select.advances.label',
                  'max-width: 80px;'
                )}
                ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
                `,
                options: EntityUtil.toSelectOption(talents),
                initValues: initAbilities?.talents?.map(
                  (t: Item.Data & any) => {
                    return {
                      key: t._id,
                      value: t.displayName ?? t.name,
                      count: t.data.advances.value,
                    };
                  }
                ),
                initCount: 1,
                withCount: true,
              })}
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
