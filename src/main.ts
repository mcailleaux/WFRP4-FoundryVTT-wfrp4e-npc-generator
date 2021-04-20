import NpcGenerator from './npc-generator.js';
import CheckDependencies from './check-dependencies.js';

Hooks.once('init', () => {
  CheckDependencies.check((canRun) => {
    if (canRun) {
      game.wfrp4e.npcGen = NpcGenerator;
    }
  });
});
