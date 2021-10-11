import NpcGenerator from './npc-generator.js';
import TrappingUtil from './util/trapping-util.js';
import RegisterSettings from './util/register-settings.js';
import CreatureGenerator from './creature-generator.js';
import { actors, i18n, initTemplates, user, wfrp4e } from './constant.js';
import { NpcGenerator as NewNpcGenerator } from './generators/npc/npc-generator.js';

Hooks.once('init', () => {
  wfrp4e().npcGen = NpcGenerator;
  wfrp4e().newNpcGen = NewNpcGenerator;
  wfrp4e().creatureGen = CreatureGenerator;

  RegisterSettings.initSettings();

  initTemplates([
    `modules/${RegisterSettings.moduleName}/templates/generation-profiles.html`,
    `modules/${RegisterSettings.moduleName}/templates/species-chooser.html`,
    `modules/${RegisterSettings.moduleName}/templates/chooser-action.html`,
    `modules/${RegisterSettings.moduleName}/templates/career-chooser.html`,
    `modules/${RegisterSettings.moduleName}/templates/species-skills-chooser.html`,
    `modules/${RegisterSettings.moduleName}/templates/species-others-chooser.html`,
  ]);
});

Hooks.on('renderActorDirectory', (_app: ActorSheet, html: JQuery) => {
  if (user().can('ACTOR_CREATE')) {
    addActorActionButton(html, 'WFRP4NPCGEN.creature.directory.button', () => {
      CreatureGenerator.generateCreature();
    });
    addActorActionButton(html, 'WFRP4NPCGEN.actor.directory.button', () => {
      NpcGenerator.generateNpc();
    });
    addActorActionButton(html, 'Tmp New NPC Gen', () => {
      NewNpcGenerator.generateNpc();
    });
  }
});

Hooks.on('createToken', async (token: any) => {
  const scene = token.parent;
  const actor: Actor = actors()?.tokens[token.id];
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
    await scene.updateEmbeddedDocuments(Token.embeddedName, [actor]);
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
