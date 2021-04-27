import NpcGenerator from './npc-generator.js';
import TrappingUtil from './util/trapping-util.js';
import CompendiumUtil from './util/compendium-util.js';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
});

Hooks.on('ready', () => {
  console.log('init cache compendium');
  CompendiumUtil.initCompendium().then();
});

Hooks.on('renderActorDirectory', (_app: ActorSheet, html: JQuery) => {
  const npcGenButton = document.createElement('button');
  npcGenButton.style.width = '95%';
  npcGenButton.innerHTML = game.i18n.localize(
    'WFRP4NPCGEN.actor.directory.button'
  );
  npcGenButton.addEventListener('click', () => {
    NpcGenerator.generateNpc();
  });
  html.find('.header-actions').after(npcGenButton);
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
  const generateArmorEffect = actor.effects.find(
    (eff) =>
      eff.data.label === game.i18n.localize('WFRP4NPCGEN.trappings.armor.label')
  );
  const updateScene =
    (generateMoneyEffect != null && !generateMoneyEffect.data.disabled) ||
    (generateWeaponEffect != null && !generateWeaponEffect.data.disabled) ||
    (generateArmorEffect != null && !generateArmorEffect.data.disabled);
  if (generateMoneyEffect != null && !generateMoneyEffect.data.disabled) {
    await TrappingUtil.generateMoney(actor);
  }
  if (updateScene) {
    await scene.updateEmbeddedEntity('Token', actor);
  }
});
