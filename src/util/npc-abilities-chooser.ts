import ReferentialUtil from './referential-util.js';
import EntityUtil from './entity-util.js';
import DialogUtil from './dialog-util.js';
import StringUtil from './string-util.js';
import RandomUtil from './random-util.js';

export default class NpcAbilitiesChooser {
  public static async selectNpcAbilities(
    initSkills: Item.Data[],
    initTalents: Item.Data[],
    initTraits: Item.Data[],
    callback: (
      skills: Item.Data[],
      talents: Item.Data[],
      traits: Item.Data[]
    ) => void,
    undo?: () => void
  ) {
    const dialogId = new Date().getTime();

    const correctDataName = (data: Item.Data & any, key: string = 'name') => {
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
              s.name
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
              t.name
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
      ...initTraits.sort((t1: Item.Data & any, t2: Item.Data & any) => {
        return t1.displayName.localeCompare(t2.displayName);
      }),
      ...[
        ...(await ReferentialUtil.getTraitEntities(true))
          .filter((t) => {
            return !StringUtil.arrayIncludesDeburrIgnoreCase(
              initTraitsNames,
              t.name
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
        title: game.i18n.localize(
          'WFRP4NPCGEN.creatures.abilities.select.title'
        ),
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
            ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
            `,
            options: EntityUtil.toSelectOption(skills),
            initValues: initSkills?.map((s: Item.Data & any) => {
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
            initValues: initTalents?.map((t: Item.Data & any) => {
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
            <div class="form-group">
            ${DialogUtil.getSelectAddRemoveScript({
              id: traitsId,
              title: 'WFRP4NPCGEN.creatures.abilities.select.traits.title',
              captions: `
                ${DialogUtil.getLabelScript('WFRP4NPCGEN.name.select.label')}
                ${DialogUtil.getLabelScript('', 'max-width: 38px;')}
                            `,
              options: EntityUtil.toSelectOption(traits),
              initValues: initTraits?.map((t: Item.Data & any) => {
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
            const skills: Item.Data[] = [];
            const talents: Item.Data[] = [];
            const traits: Item.Data[] = [];

            html.find(`.${traitsId}`).each((_i, r: HTMLInputElement) => {
              const key = r.value;
              const trait = <Item.Data & any>traits.find((t) => t._id === key);
              traits.push(trait);
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
              skills.push(skill);
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
              talents.push(talent);
            });

            callback(skills, talents, traits);
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
