import NpcGenerator from './npc-generator';

Hooks.once('init', () => {
  game.wfrp4e.npcGen = NpcGenerator;
});
