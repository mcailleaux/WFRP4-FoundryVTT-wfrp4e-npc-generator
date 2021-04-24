## In development

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
