import NpcGenerator from './npc-generator.js';
import TrappingUtil from './util/trapping-util.js';
import RegisterSettings from './util/register-settings.js';
import CreatureGenerator from './creature-generator.js';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
  game.wfrp4e.creatureGen = CreatureGenerator;

  RegisterSettings.initSettings();
});

Hooks.on('renderActorDirectory', (_app: ActorSheet, html: JQuery) => {
  if ((<any>game.user).can('ACTOR_CREATE')) {
    addActorActionButton(html, 'WFRP4NPCGEN.creature.directory.button', () => {
      CreatureGenerator.generateCreature();
    });
    addActorActionButton(html, 'WFRP4NPCGEN.actor.directory.button', () => {
      NpcGenerator.generateNpc();
    });
  }
});

Hooks.on('createToken', async (scene: any, token: any) => {
  const actor: Actor = game.actors?.tokens[token._id];
  if (token?.actorLink || actor == null) {
    return;
  }
  const generateMoneyEffect = actor.effects.find(
    (eff) =>
      eff.data.label === game.i18n.localize('WFRP4NPCGEN.trappings.money.label')
  );
  const generateWeaponEffect = actor.effects.find(
    (eff) =>
      eff.data.label ===
      game.i18n.localize('WFRP4NPCGEN.trappings.weapon.label')
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
  button.innerHTML = game.i18n.localize(label);
  button.addEventListener('click', () => {
    onClick();
  });
  html.find('.header-actions').after(button);
}
