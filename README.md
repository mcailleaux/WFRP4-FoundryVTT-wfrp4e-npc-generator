# WFRP 4 NPC generator

This module allow to generate npcs or creatures.

# Authors

Skeroujvapluvit

Deutsch : ivan-hr

## Supported language

- EN
- FR
- DE (Not tested)

**IMPORTANT : If a translate module is used, it's very important to wait the end of the translate module patching**

## System and dependencies

This module need the Warhammer Fantasy Roleplay 4e system and the wrfp4e-core module from C7

- System : https://foundryvtt.com/packages/wfrp4e
- wrfp4e-core : https://foundryvtt.com/packages/wfrp4e-core/

### Optional dependencies

For other language than English, if you want the generate NPC have his Native Tongue as Skill, you have to install the
translate module of wfrp4e-core and have the system language same as your translate module

- FR : https://gitlab.com/LeRatierBretonnien/foundryvtt-wh4-lang-fr-fr
- DE : https://github.com/StefanMasz/WFRP4e-de

## Data initialisation

On the first usage of NPC or Creature generator, All Items and Actors (Actors are not loaded for NPC generator) from
compendium are loaded in memory. This initial load can take a few time depend of the numbers of Compendium you have and
the quality of your internet connection

Estimation :

- Down : 8 Mb/s
- Up : 1 Mb/s
- NPC Generator => About 3 seconds
- Creature Generator => About 11 seconds

## Usage

[NPC Generator Doc](USAGE-NPC.md)

[Creature Generator Doc](USAGE-CREATURE.md)

[Settings Doc](USAGE-SETTINGS.md)

## Generation rules

### NPC

- Actor is created with npc template
- Actor have the following career path :
  - If only one career is selected during the career chooser step :
    - The career path is the selected career and all the career at the same career group before the career level of
      selected career
  - If more than one career are selected during the career chooser step :
    - The career path is your selections of careers in the same order
- All careers are completed and the last career of the career path is the current
- Actor have all his career skills, species skills, native tongue skill, basic skills and Lore(Birth Place) if choosing
  - All career skills have 5 x career level advance
  - Majors species skill have 5 advance if not present in career
  - Minors species skill have 3 advance if not present in career
- Actor have all his career talent since the level 1 career and species talents
  - Only one advance by talent
  - Talent are added after Actor creation to attach effect
- Actor have adverage characteristic
  - Each characteristics have +/- 0-5
  - All career characteristics have 5 x career level advance
- If active, actor have all his class trappings
- If active and if items are found by equal or partial match, actor have all his career trappings
- If active, actor have an effect to indicate if you want to generate random money on token creation
- If active, actor have an effect to indicate if you want to generate random weapons, corresponding to you Melee or
  Ranged Skill, on token creation
- If active, actor can be linked to his token
- If active, actor can be generated with random money
- If active, actor can be generated with random weapons
- If active, skills/talents/traits can be edited just before generation
  - Advance and groups can be edited in this step
- If active, Trappings can be edited just before generation
- If active, Spells, Prayers and mutations can be added just before generation

### Creature

- Actor is created with creature template
- Actor is created from an existing creature template from Compendiums or World
- Actor abilities can be change :
  - Generate with basic skill or not
  - Generate with Swarm trait
  - Generate with Weapon trait and specifie his base value
  - Generate with Armour trait and specifie his base value
  - Generate with Ranged trait and specifie his base value and range
  - Generate with a size from all existing system size
  - Add/Remove traits from all Compendiums or World Items or Compendium or world Actors traits
  - Add/Remove skills (and specifie advance) from all Compendiums or World Items or Compendium or world Actors skills
  - Add/Remove talents (and specifie advance) from all Compendiums or World Items or Compendium or world Actors talents
- Actor have adverage characteristic
  - Each characteristics have +/- 0-5
  - S, T and Ag are modified by the new Size if changed
- If active, actor have an effect to indicate if you want to generate random money on token creation
- If active, actor can be linked to his token
- If active, actor can be generated with random money
- If active, Trappings can be edited just before generation
- If active, Spells, Prayers and mutations can be added just before generation

## Token Generation rules

![Effects](media/wfrp4e-npc-gen-effects.png)

- All function fired during token generation work only if token is not link with actor data
- Those effect can be manualy created on existing NPC to activate this function, not only by the NPC generator

### Random money generation

If this effect is present and active on passive effect :

- en : "Generate money on token creation"
- fr : "Générer l'argent à la création du Token"
- de : "Geld bei der Token-Erstellung generieren"

Money is added to token data during creation with this rules :

- Gold standing : tier x GC + 5D10 SS + 10D10 BP
- Silver standing : tier x 1D10 SS + 10D10 BP
- Brass standing : tier x 2D10 BP
- Money is finaly consolidate to have the fewest coins

For Creature, a status is randomly generated

### Random weapons generation

If this effect is present and active on passive effect :

- en : "Generate weapons on token creation"
- fr : "Générer des armes à la création du Token"
- de : "Waffen bei der Token-Erstellung generieren"

Weapons are added to token data during creation with this rules :

- One random weapon per each Melee or Ranged Skills, Two weapons for Melee (Basic), existing actor weapons are counting to determinate if a new weapon is generate
- Melee (any) and Ranged (any) are replaced by a random other group and a weapon is generate
- For Ranged, a random ammunition for this weapon is added with a minimum quantity of 10 (apply for existing weapon, not only the generated ones)

## Comming soon

- Add a create button on folder
- create a chat command
- Manage other language

## Module link

https://raw.githubusercontent.com/mcailleaux/WFRP4-FoundryVTT-wfrp4e-npc-generator/dist/module.json

## Module Beta link

https://raw.githubusercontent.com/mcailleaux/WFRP4-FoundryVTT-wfrp4e-npc-generator/dist-beta-v4/module-beta.json
