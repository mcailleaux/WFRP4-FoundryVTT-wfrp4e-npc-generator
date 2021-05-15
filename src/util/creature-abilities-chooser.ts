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

    const initSkillsNames = initAbilities.skills.map((s) => s.name);
    const skills = [
      ...initAbilities.skills.sort((s1, s2) => {
        return s1.name.localeCompare(s2.name);
      }),
      ...(await ReferentialUtil.getSkillEntities(true))
        .filter((s) => {
          return !StringUtil.arrayIncludesDeburrIgnoreCase(
            initSkillsNames,
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

    const skillsId = `creature-abilities-add-remove-skills-${dialogId}`;
    const talentsId = `creature-abilities-add-remove-talents-${dialogId}`;
    const traitsId = `creature-abilities-add-remove-traits-${dialogId}`;

    const speciesMap = duplicate(ReferentialUtil.getSpeciesMap());
    speciesMap['none'] = '';

    new Dialog(
      {
        title: game.i18n.localize(
          'WFRP4NPCGEN.creatures.abilities.select.title'
        ),
        content: `<form>
              
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.basic.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-basic-${dialogId}`,
                type: 'checkbox',
                checked: initAbilities.includeBasicSkills,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.swarm.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-swarm-${dialogId}`,
                type: 'checkbox',
                checked: initAbilities.isSwarm,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.weapon.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-weapon-${dialogId}`,
                type: 'checkbox',
                checked: initAbilities.hasWeaponTrait,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.weapon.damage.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-weapon-damage-${dialogId}`,
                type: 'number',
                initValue: initAbilities.weaponDamage,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.ranged.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-ranged-${dialogId}`,
                type: 'checkbox',
                checked: initAbilities.hasRangedTrait,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.ranged.range.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-ranged-range-${dialogId}`,
                type: 'number',
                initValue: initAbilities.rangedRange,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.ranged.damage.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-ranged-damage-${dialogId}`,
                type: 'number',
                initValue: initAbilities.rangedDamage,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.armour.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-armour-${dialogId}`,
                type: 'checkbox',
                checked: initAbilities.hasArmourTrait,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.armour.value.label'
              )}
              ${DialogUtil.getInputScript({
                id: `creature-abilities-armour-value-${dialogId}`,
                type: 'number',
                initValue: initAbilities.armourValue,
              })}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.size.label'
              )}
              ${DialogUtil.getSelectScript(
                `creature-abilities-size-${dialogId}`,
                CompendiumUtil.getSizes(),
                initAbilities.sizeKey
              )}
              </div>
              <div class="form-group">
              ${DialogUtil.getLabelScript(
                'WFRP4NPCGEN.creatures.abilities.select.species.label'
              )}
              ${DialogUtil.getSelectScript(
                `creature-abilities-species-${dialogId}`,
                speciesMap,
                initAbilities.speciesKey
              )}
              </div>
                
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
            initValues: initAbilities?.talents?.map((t: Item.Data & any) => {
              return {
                key: t._id,
                value: t.displayName ?? t.name,
                count: t.data.advances.value,
              };
            }),
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
          (html: JQuery) => {
            const abilities = new CreatureAbilities();
            html
              .find(`#creature-abilities-basic-${dialogId}`)
              .each((_i, r: HTMLInputElement) => {
                abilities.includeBasicSkills = r.checked;
              });
            abilities.sizeKey = <string>(
              html.find(`#creature-abilities-size-${dialogId}`).val()
            );
            html
              .find(`#creature-abilities-swarm-${dialogId}`)
              .each((_i, r: HTMLInputElement) => {
                abilities.isSwarm = r.checked;
              });
            html
              .find(`#creature-abilities-ranged-${dialogId}`)
              .each((_i, r: HTMLInputElement) => {
                abilities.hasRangedTrait = r.checked;
              });
            html
              .find(`#creature-abilities-armour-${dialogId}`)
              .each((_i, r: HTMLInputElement) => {
                abilities.hasArmourTrait = r.checked;
              });
            html
              .find(`#creature-abilities-weapon-${dialogId}`)
              .each((_i, r: HTMLInputElement) => {
                abilities.hasWeaponTrait = r.checked;
              });
            abilities.rangedRange = <string>(
              html.find(`#creature-abilities-ranged-range-${dialogId}`).val()
            );
            abilities.rangedDamage = <string>(
              html.find(`#creature-abilities-ranged-damage-${dialogId}`).val()
            );
            abilities.weaponDamage = <string>(
              html.find(`#creature-abilities-weapon-damage-${dialogId}`).val()
            );
            abilities.armourValue = <string>(
              html.find(`#creature-abilities-armour-value-${dialogId}`).val()
            );

            abilities.speciesKey = <string>(
              html.find(`#creature-abilities-species-${dialogId}`).val()
            );

            html.find(`.${traitsId}`).each((_i, r: HTMLInputElement) => {
              const id = r.id;
              const key = r.value;
              let included = false;
              html.find(`#${id}-check`).each((_i1, r1: HTMLInputElement) => {
                included = r1.checked;
              });
              const trait = <Item.Data & any>traits.find((t) => t._id === key);
              trait.included = included;
              abilities.traits.push(trait);
            });

            html.find(`.${skillsId}`).each((_i, r: HTMLInputElement) => {
              const id = r.id;
              const key = r.value;
              let count = 0;
              html.find(`#${id}-count`).each((_i1, r1: HTMLInputElement) => {
                count = Number(r1.value);
              });
              const skill = <Item.Data & any>skills.find((s) => s._id === key);
              skill.data.advances.value = count;
              abilities.skills.push(skill);
            });

            html.find(`.${talentsId}`).each((_i, r: HTMLInputElement) => {
              const id = r.id;
              const key = r.value;
              let count = 0;
              html.find(`#${id}-count`).each((_i1, r1: HTMLInputElement) => {
                count = Number(r1.value);
              });
              const talent = <Item.Data & any>(
                talents.find((t) => t._id === key)
              );
              talent.data.advances.value = count;
              abilities.talents.push(talent);
            });

            callback(abilities);
          },
          undo
        ),
        default: 'yes',
      },
      {
        resizable: true,
        classes: ['dialog', 'wfrp4e-npc-generator-dialog'],
      }
    ).render(true);
  }
}
