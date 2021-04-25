# WFRP 4 NPC generator

This module allow to generate npcs.

## Supported language

- EN
- FR

## System and dependencies

This module need the Warhammer Fantasy Roleplay 4e system and the wrfp4e-core module from C7

- System : https://foundryvtt.com/packages/wfrp4e
- wrfp4e-core : https://foundryvtt.com/packages/wfrp4e-core/

### Optional dependencies

For other language than English, if you want the generate NPC have his Native Tongue as Skill,
you have to install the translate module of wfrp4e-core and have the system language same as your translate module

- FR : https://gitlab.com/LeRatierBretonnien/foundryvtt-wh4-lang-fr-fr

## Usage

### From Actor Sidebar

![Actor Sidebar button](./media/wfre4e-npc-gen-sidebar-button.png)

#### 1 you choose a species

![Species Chooser](./media/wfrp4e-species-chooser.png)

#### 2 you choose a career

![Career Chooser](./media/wfrp4e-career-chooser.png)

#### 3 you choose the species skills

![Species Skills Chooser](./media/wfrp4e-species-skills-chooser.png)

#### 4 you choose the species talents

![Species Talents Chooser](./media/wfrp4e-species-talents-chooser.png)

#### 5 you choose a name

![Name Chooser](./media/wfrp4e-name-chooser.png)

### From Macro

```
game.wfrp4e.npcGen.generateNpc((model, data, actor) => {
    console.dir(model) // The generating model
    console.dir(data)  // The initial Actor Data
    console.dir(actor) // The generated Actor
})
```

### Other macro Functions

#### Species Chooser

```
game.wfrp4e.npcGen.speciesChooser.selectSpecies(
    'human', // default selected speciesKey
    (speciesKey, speciesValue) => {
    console.dir(speciesKey)     // The chosen species key (string)
    console.dir(speciesValue)   // The choser species value (string)
})
```

#### career Chooser

```
game.wfrp4e.npcGen.careerChooser.selectCareer(
    'Advisor', // default selected Career
    'human', // The species key for get random career from species career table
    (career) => {
    console.dir(career)     // The chosen career Item
})
```

#### Species Skills Chooser

```
game.wfrp4e.npcGen.speciesSkillsChooser.selectSpeciesSkills(
    ['Ranged (Bow)', 'Melee (Basic)', 'Evaluate'], // The initial selected majors skill
    ['Gossip', 'Haggle', 'Cool'], // The initial selected minors skill
    'human', // The species key
    (majors, minors) => {
    console.dir(majors)     // The 3 chosen species skills for +5 (string[])
    console.dir(minors)     // The 3 chosen species skills for +3 (string[])
})
```

#### Species Talents Chooser

```
game.wfrp4e.npcGen.speciesTalentsChooser.selectSpeciesTalents(
    ['Suave', 'Flee!', 'Luck', 'Mimic'], // The initial selected talents
    'human', // The species key
    (talents) => {
    console.dir(talents)     // The chosen species talents (string[])
})
```

#### Name Chooser

```
game.wfrp4e.npcGen.nameChooser.selectName(
    'Default Name', // The initial selected name
    'human', // The species key
    (name) => {
    console.dir(name)     // The chosen name (string)
})
```

## Generation rules

- Actor is created with npc template (creature template comming soon)
- Actor have all his career skills, species skills, native tongue skill and basic skills
  - All career skills have 5 x career level advance
  - Majors species skill have 5 advance if not present in career
  - Minors species skill have 3 advance if not present in career
- Actor have all his career talent since the level 1 career and species talents
  - Only one advance by talent
  - Talent are added after Actor creation to attach effect
- Actor have adverage characteristic
  - Each characteristics have +/- 0-5
  - All career characteristics have 5 x career level advance

## Comming soon

- Add option to limit career choices by species career random table
- Create a function to Prompt option to generate trappings or not
- Generate actor with trapping
- Create a function to Prompt a generation mode (simple or advanced)
  - Simple generator Prompt only Species, Career and Name select and une random for species and talent skill
- Add Gnome if rnhd module is present
- Creates Settings (defaut trapping option on simple mode, manage token images path):
  - A boolean askForTrapping to enable/disable Prompt option to ask if you want to generate trapping
  - A boolean withTrapping to generate trapping on simpliest mode or if askForTrapping=false
  - A String defaultGenDirectory to specify a path where generate new NPC
  - A Object { [type: string]: {genDirectory: string, tokenIconPath: string}} to allow user create type of npc generation with specific path and icon
- Create a function to Prompt select an npc type (used with settings to set a spcific generation path and a token icon path)
- Create a simpliest generator with creature template

## Module link

https://raw.githubusercontent.com/mcailleaux/WFRP4-FoundryVTT-wfrp4e-npc-generator/dist/module.json

## Module Beta link

https://raw.githubusercontent.com/mcailleaux/WFRP4-FoundryVTT-wfrp4e-npc-generator/dist-beta/module-beta.json
