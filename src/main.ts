import NpcGenerator from './npc-generator.js';

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

Hooks.on('createToken', (data1: any, data2: any, data3: any) => {
  console.dir(data1);
  console.dir(data2);
  console.dir(data3);
});
