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
                EntityUtil.toSelectOption(traits),
                initAbilities?.traits?.map((t: Item.Data & any) => {
                  return { key: t._id, value: t.displayName ?? t.name };
                })
              )}
              </div>
              
          </form>
          <script>  
              
              function addElement(id) {
                  const select = document.getElementById(id);
                  const key = select.value;
                  const value = select.querySelector('option[value="' + key + '"]').innerHTML;
                  
                  const idDiv = id + '-' + key + '-removable';                  
                  
                  const div = document.createElement('div');
                  div.id = idDiv;
                  div.style.display = 'flex';
                  div.style.flexDirection = 'row';
                  div.style.alignItems = 'stretch';
                  div.style.justifyContent = 'space-between';
                  const label = document.createElement('label');
                  label.innerHTML = value;
                  const input = document.createElement('input');
                  input.id = id + '-' + key;
                  input.type = 'hidden';
                  input.value = key;
                  input.classList.add(id);
                  const button = document.createElement('button');
                  button.value = key;
                  button.style.maxWidth = '32px';
                  button.type = 'button';
                  button.setAttribute('onclick', 'removeElementk(\\'' + id + '\\', \\'' + key + '\\')');
                  const icon = document.createElement('i');
                  icon.style.pointerEvents = 'none';
                  icon.classList.add('fa');
                  icon.classList.add('fa-trash-alt');
                  
                  button.append(icon);
                  div.append(label);
                  div.append(input);
                  div.append(button);
                  
                  document.getElementById(id + '-removables').append(div);
                  
              }
              
              function removeElement(id, key) {
                const removables = document.getElementById(id + '-removables');
                const div = document.getElementById(id + '-' + key + '-removable');
                removables.removeChild(div);
              }
                
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
