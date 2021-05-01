## In development

- Create a function to Prompt a generation mode (simple or advanced)
  - Simple generator Prompt only Species, Career and Name select and une random for species and talent skill
- Add Gnome if rnhd module is present
- Update Settings (defaut trapping option on simple mode, manage token images path):
  - A String defaultGenDirectory to specify a path where generate new NPC
  - A Object { [type: string]: {genDirectory: string, tokenIconPath: string}} to allow user create type of npc generation with specific path and icon
- Create a function to Prompt select an npc type (used with settings to set a spcific generation path and a token icon path)
- Create a simpliest generator with creature template
- Allow to select many careers to create a career path instead of de automatic career path
- create a chat command
- Manage other language
- Allow linked pnj
- Allow money and weapons generation at creation

## 1.3.0

### New features

- Settings to configure generation species profiles contain directory path, image path and token image path
- Default setting to configure directory path
- Setting to enable suffix directory path by current career name
- Add selection off species profile on option chooser step
- Optimize the trappings search
- Manage trapping to be equiped/wearing by default

### Bugfix

- ignore world carreer with same carreer group from compendium
- add item type filter for items career reading by tag from compendium

## 1.2.1

### Bugfix

- Init compendium on first usage of generate function

## 1.2.0

### New features

- Create a function to Prompt options to generate trappings or not
- Generate actor with trapping
- Generate trappings on token placement
- Add World settings to set options chooser default selected options

## 1.1.0

### New features

- Add a button "Random {Species}" on career chooser to limit random career allowed for selected species

## 1.0.0

### New features

- Create a generation tools with function to be used inside macro
- Create a button on ActorDirectory to generate NPC
- Create a function to Prompt select a species
- Create a function to Prompt select a career
- Create a function to Prompt select species skills
- Create a function to Prompt select talent species
- Create a function to Prompt select name
- Generate actor with :
  - Name
  - Species, Move and Status
  - Characteristics with advances
  - Basic skill, native tongue skill, species skill, career skill, with advances
  - Species and career talents with effects
  - Complete career path with completed and current
  - Basic money trappings
