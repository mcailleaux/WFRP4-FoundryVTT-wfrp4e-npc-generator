import NpcGenerator from './npc-generator.js';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
});
