import NpcGenerator from './npc-generator.js';
import TrappingUtil from './util/trapping-util.js';
import RegisterSettings from './util/register-settings.js';
import CreatureGenerator from './creature-generator.js';
import { actors, i18n, user, wfrp4e } from './constant.js';

Hooks.once('init', () => {
  wfrp4e().npcGen = NpcGenerator;
  wfrp4e().creatureGen = CreatureGenerator;

  RegisterSettings.initSettings();
});

Hooks.on('renderActorDirectory', (_app: ActorSheet, html: JQuery) => {
  if (user().can('ACTOR_CREATE')) {
    addActorActionButton(html, 'WFRP4NPCGEN.creature.directory.button', () => {
      CreatureGenerator.generateCreature();
    });
    addActorActionButton(html, 'WFRP4NPCGEN.actor.directory.button', () => {
      NpcGenerator.generateNpc();
    });
  }
});

Hooks.on('createToken', async (token: any) => {
  const scene = token.parent;
  const actor: Actor = actors()?.tokens[token._id];
  if (token?.actorLink || actor == null) {
    return;
  }
  const generateMoneyEffect = actor.effects.find(
    (eff) =>
      eff.data.label === i18n().localize('WFRP4NPCGEN.trappings.money.label')
  );
  const generateWeaponEffect = actor.effects.find(
    (eff) =>
      eff.data.label === i18n().localize('WFRP4NPCGEN.trappings.weapon.label')
  );
  const updateScene =
    (generateMoneyEffect != null && !generateMoneyEffect.data.disabled) ||
    (generateWeaponEffect != null && !generateWeaponEffect.data.disabled);

  if (generateMoneyEffect != null && !generateMoneyEffect.data.disabled) {
    await TrappingUtil.generateMoney(actor);
  }

  if (generateWeaponEffect != null && !generateWeaponEffect.data.disabled) {
    await TrappingUtil.generateWeapons(actor);
  }

  if (updateScene) {
    await scene.updateEmbeddedEntity('Token', actor);
  }
});

function addActorActionButton(
  html: JQuery,
  label: string,
  onClick: () => void
) {
  const button = document.createElement('button');
  button.style.width = '95%';
  button.innerHTML = i18n().localize(label);
  button.addEventListener('click', () => {
    onClick();
  });
  html.find('.header-actions').after(button);
}
