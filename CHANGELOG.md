## In development

- create a chat command
- Manage other language

## 1.6.2

### Bugfix

- World First for trappings
- Bug init existing profiles dont includes new species
- Bug with Creature Order
- Bug with Species Order

## 1.6.1

### New features

- Deutsch support for 1.6.0

## 1.6.0

### New features

- Add optional Step to edit NPC abilities after generation
- Select a subspecies on species choosing step (wfrp-core 3.6.0 +)
- Use cache skills and Talents when find for npc generator
- Add optional Step to edit specialisations after generation
- Add city born to first step

## 1.5.1

### Bugfix

- Remove empty group on grouped select
- bug with Career skills when more than one career

## 1.5.0

### New features

- Generate Creature from an existing compendium/world creature
  - Can add/remove traits, skills, talents, swarm
  - Can change Size
  - Can add/remove trappings, spells, prayers, mutations
- Settings for creature generator
- Settings profiles for creatures
- Adding optional steps to NPC generator
  - Can add/remove trappings, spells, prayers, mutations
- Allow to resize Dialogs
- Add wait message during generation

## 1.4.0

### New features

- Allow to select many careers to create a career path instead of de automatic career path
- Adding Gnomes native tongue

### Bugfix

- Search by tag trapping result other items that are not trappings, add filter on type items

## 1.3.1

### Bugfix

- On profiles settings, the path image and token were not persisted when selected from the foundry filepicker

## 1.3.0

### New features

- Settings to configure generation species profiles contain directory path, image path and token image path
- Default setting to configure directory path
- Setting to enable suffix directory path by current career name
- Setting to enable linked npc generation
- Setting to enable money at generation
- Setting to enable weapons at generation
- Add selection off species profile on option chooser step
- Optimize the trappings search
- Manage trapping to be equiped/wearing by default
- add deutsch compatibility
- Limit generation button fore those who can create actor

### Bugfix

- ignore world career with same career group from compendium
- add item type filter for items career reading by tag from compendium
- infinite delete ecumbrance effect loop

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
