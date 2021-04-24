import NpcGenerator from './npc-generator.js';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
});

Hooks.on('renderActorDirectory', (_app: ActorSheet, html: JQuery) => {
  const npcGenButton = document.createElement('button');
  npcGenButton.innerHTML = game.i18n.localize(
    'WFRP4NPCGEN.actor.directory.button'
  );
  npcGenButton.addEventListener('click', () => {
    NpcGenerator.generateNpc();
  });
  html.find('.directory-header').append(npcGenButton);
});
