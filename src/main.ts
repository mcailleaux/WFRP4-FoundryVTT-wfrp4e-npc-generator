import NpcGenerator from './npc-generator.js';
import TrappingUtil from './util/trapping-util.js';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
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
  console.dir(scene);
  console.dir(token);
  const actor = game.actors.get(token.actorId);
  if (actor != null) {
    console.dir(actor);
    const generateMoneyEffect = actor.effects.find(
      (eff) => eff.data.label === 'Generate Money On Token Creation'
    );
    const generateWeaponEffect = actor.effects.find(
      (eff) => eff.data.label === 'Generate Weapons On Token Creation'
    );
    const generateArmorEffect = actor.effects.find(
      (eff) => eff.data.label === 'Generate Armors On Token Creation'
    );
    if (
      generateMoneyEffect != null ||
      generateWeaponEffect != null ||
      generateArmorEffect != null
    ) {
      token.actorData = {
        effects: actor.effects,
        items: actor.items,
      };
    }
    if (generateMoneyEffect != null) {
      await TrappingUtil.generateMoney(actor, token.actorData);
    }
  }
});
