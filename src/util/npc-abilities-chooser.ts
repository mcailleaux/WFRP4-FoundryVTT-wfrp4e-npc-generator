import ReferentialUtil from './referential-util.js';
import EntityUtil from './entity-util.js';
import DialogUtil from './dialog-util.js';
import StringUtil from './string-util.js';
import RandomUtil from './random-util.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { i18n } from '../constant.js';

export default class NpcAbilitiesChooser {
  public static async selectNpcAbilities(
    initSkills: ItemData[],
    initTalents: ItemData[],
    initTraits: ItemData[],
    callback: (
      skills: ItemData[],
      talents: ItemData[],
      traits: ItemData[]
    ) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const correctDataName = (data: ItemData & any, key: string = 'name') => {
      if (data[key].includes('*')) {
        data[key] = data[key].replace(/\*/g, '');
      }
      if (data[key].includes('(') && !data[key].includes(')')) {
        data[key] = data[key] + ')';
      }
    };

    const initSkillsNames = initSkills.map((s) => s.name);
    const skills = [
      ...initSkills.sort((s1, s2) => {
        return s1.name.localeCompare(s2.name);
      }),
      ...[
        ...(await ReferentialUtil.getSkillEntities(true))
          .filter((s) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initSkillsNames,
              s.name ?? ''
            );
          })
          .map((s) => {
            const data = duplicate(s.data);
            data._id = RandomUtil.getRandomId();
            return data;
          }),
        ...(await ReferentialUtil.getCompendiumActorSkills())
          .filter((s) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initSkillsNames,
              s.name
            );
          })
          .map((s) => {
            const data = duplicate(s);
            correctDataName(data);
            data._id = RandomUtil.getRandomId();
            return data;
          }),
      ].sort((s1, s2) => {
        return s1.name.localeCompare(s2.name);
      }),
    ];
    const initTalentsNames = initTalents.map((t) => t.name);
    const talents = [
      ...initTalents.sort((t1, t2) => {
        return t1.name.localeCompare(t2.name);
      }),
      ...[
        ...(await ReferentialUtil.getTalentEntities(true))
          .filter((t) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initTalentsNames,
              t.name ?? ''
            );
          })
          .map((t) => {
            const data = duplicate(t.data);
            data._id = RandomUtil.getRandomId();
            return data;
          }),
        ...(await ReferentialUtil.getCompendiumActorTalents())
          .filter((t) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initTalentsNames,
              t.name
            );
          })
          .map((t) => {
            const data = duplicate(t);
            correctDataName(data);
            data._id = RandomUtil.getRandomId();
            return data;
          }),
      ].sort((t1, t2) => {
        return t1.name.localeCompare(t2.name);
      }),
    ];
    const initTraitsNames = initTraits.map((t) => t.name);
    const initTraitsDisplayNames = initTraits.map((t: any) => t.displayName);
    const traits = [
      ...initTraits.sort((t1: ItemData & any, t2: ItemData & any) => {
        return t1.displayName.localeCompare(t2.displayName);
      }),
      ...[
        ...(await ReferentialUtil.getTraitEntities(true))
          .filter((t) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initTraitsNames,
              t.name ?? ''
            );
          })
          .map((t) => {
            const data = duplicate(t.data);
            data._id = RandomUtil.getRandomId();
            return data;
          }),
        ...(await ReferentialUtil.getCompendiumActorTraits())
          .filter((t: any) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initTraitsDisplayNames,
              t.displayName
            );
          })
          .map((t) => {
            const data = duplicate(t);
            correctDataName(data);
            correctDataName(data, 'displayName');
            data._id = RandomUtil.getRandomId();
            return data;
          }),
      ].sort((t1, t2) => {
        return t1.name.localeCompare(t2.name);
      }),
    ];

    const skillsId = `npc-abilities-add-remove-skills-${dialogId}`;
    const talentsId = `npc-abilities-add-remove-talents-${dialogId}`;
    const traitsId = `npc-abilities-add-remove-traits-${dialogId}`;

    new Dialog(
      {
        title: i18n.localize('WFRP4NPCGEN.creatures.abilities.select.title'),
        content: `<form>     
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
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.creatures.abilities.select.group.label',
              'max-width: 80px;'
            )}
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            options: EntityUtil.toSelectOption(skills),
            initValues: initSkills?.map((s: ItemData & any) => {
              return {
                key: s._id,
                value: s.displayName ?? s.name,
                count: s.data.advances.value,
                withText: EntityUtil.hasGroupName(s.displayName ?? s.name),
                text: EntityUtil.hasGroupName(s.displayName ?? s.name)
                  ? StringUtil.getGroupName(s.displayName ?? s.name)
                  : '',
              };
            }),
            withCount: true,
            withText: true,
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
            ${DialogUtil.getLabelScript(
              'WFRP4NPCGEN.creatures.abilities.select.group.label',
              'max-width: 80px;'
            )}
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            options: EntityUtil.toSelectOption(talents),
            initValues: initTalents?.map((t: ItemData & any) => {
              return {
                key: t._id,
                value: t.displayName ?? t.name,
                count: t.data.advances.value,
                withText: EntityUtil.hasGroupName(t.displayName ?? t.name),
                text: EntityUtil.hasGroupName(t.displayName ?? t.name)
                  ? StringUtil.getGroupName(t.displayName ?? t.name)
                  : '',
              };
            }),
            initCount: 1,
            withCount: true,
            withText: true,
          })}
          </div>                                   
            <div class="form-group">
            ${DialogUtil.getSelectAddRemoveScript({
              id: traitsId,
              title: 'WFRP4NPCGEN.creatures.abilities.select.traits.title',
              captions: `
                ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
                ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
                            `,
              options: EntityUtil.toSelectOption(traits),
              initValues: initTraits?.map((t: ItemData & any) => {
                return {
                  key: t._id,
                  value: t.displayName ?? t.name,
                };
              }),
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
            const resultSkills: ItemData[] = [];
            const resultTalents: ItemData[] = [];
            const resultTraits: ItemData[] = [];

            html.find(`.${traitsId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;
              const trait = <ItemData & any>traits.find((t) => t._id === key);
              resultTraits.push(trait);
            });

            html.find(`.${skillsId}`).each((_i, r: HTMLInputElement) => {
              const id = r.id;
              const key = r.value;
              let count = 0;
              let text = '';
              html.find(`#${id}-count`).each((_i1, r1: HTMLInputElement) => {
                count = Number(r1.value);
              });
              html.find(`#${id}-text`).each((_i1, r1: HTMLInputElement) => {
                text = r1.value;
              });
              const skill = <ItemData & any>skills.find((s) => s._id === key);
              skill.data.advances.value = count;
              if (text != null && text.length > 0) {
                skill.name = `${StringUtil.getSimpleName(
                  skill.name
                )} (${text})`;
              }
              resultSkills.push(skill);
            });

            html.find(`.${talentsId}`).each((_i, r: HTMLInputElement) => {
              const id = r.id;
              const key = r.value;
              let count = 0;
              let text = '';
              html.find(`#${id}-count`).each((_i1, r1: HTMLInputElement) => {
                count = Number(r1.value);
              });
              html.find(`#${id}-text`).each((_i1, r1: HTMLInputElement) => {
                text = r1.value;
              });
              const talent = <ItemData & any>talents.find((t) => t._id === key);
              talent.data.advances.value = count;
              if (text != null && text.length > 0) {
                talent.name = `${StringUtil.getSimpleName(
                  talent.name
                )} (${text})`;
              }
              resultTalents.push(talent);
            });

            callback(resultSkills, resultTalents, resultTraits);
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
