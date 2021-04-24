import SpeciesSkillsChooser from './species-skills-chooser.js';
import SpeciesTalentsChooser from './species-talents-chooser.js';

export default class TranslateErrorDetect {
  public static async detectTranslateError() {
    const speciesSkillsMap = SpeciesSkillsChooser.getSpeciesSkillsMap();
    const speciesTalentsMap = SpeciesTalentsChooser.getSpeciesTalentsMap();
    const randomTalents = SpeciesTalentsChooser.getRandomTalents();

    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getContent();

    const skills: string[] = [];
    const talents: string[] = [];

    Object.values(speciesSkillsMap).forEach((s) => {
      skills.push(...s);
    });

    Object.values(speciesTalentsMap).forEach((tl) => {
      talents.push(...tl.filter((_t, i) => i !== tl.length - 1));
    });
    talents.push(...randomTalents);

    careers.forEach((career) => {
      const careerData: any = career?.data?.data;
      if (careerData.skills != null) {
        skills.push(...careerData.skills);
      }
      if (careerData.talents != null) {
        talents.push(...careerData.talents);
      }
    });

    skills.forEach(async (s) => {
      try {
        await game.wfrp4e.utility.findSkill(s);
      } catch (e) {
        console.warn('Cant find Skill : ' + s);
      }
    });

    talents.forEach(async (t) => {
      try {
        await game.wfrp4e.utility.findTalent(t);
      } catch (e) {
        console.warn('Cant find Talent : ' + t);
      }
    });
  }
}
