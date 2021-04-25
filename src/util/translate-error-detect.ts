import SpeciesSkillsChooser from './species-skills-chooser.js';
import SpeciesTalentsChooser from './species-talents-chooser.js';

export default class TranslateErrorDetect {
  public static async detectRandomCareerTranslateError(
    callback: (errors: string[]) => void
  ) {
    const randomCareers: string[] = game.wfrp4e.tables.career.rows.map(
      (row: any) => row.name
    );
    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getIndex();
    const careersNames = careers.map((c) => c.name);

    const errors: string[] = [];
    randomCareers.forEach((c) => {
      if (!careersNames.includes(c)) {
        errors.push(c);
      }
    });
    callback(errors);
  }

  public static async detectSkillsAndTalentsTranslateError(
    callback: (errors: string[]) => void
  ) {
    const speciesSkillsMap = SpeciesSkillsChooser.getSpeciesSkillsMap();
    const speciesTalentsMap = SpeciesTalentsChooser.getSpeciesTalentsMap();
    const randomTalents = SpeciesTalentsChooser.getRandomTalents();

    const careersPack = game.packs.get('wfrp4e-core.careers');
    const careers: Item[] = await careersPack.getContent();

    const skills: string[] = [];
    const talents: string[] = [];
    const errors: string[] = [];

    Object.values(speciesSkillsMap).forEach((s) => {
      skills.push(...s);
    });

    Object.values(speciesTalentsMap).forEach((tl) => {
      tl.filter((_t, i) => i !== tl.length - 1).forEach((t: string) => {
        if (t.includes(',')) {
          talents.push(...t.split(','));
        } else {
          talents.push(t);
        }
      });
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

    for (let i = 0; i < skills.length; i++) {
      const s = skills[i];
      try {
        await game.wfrp4e.utility.findSkill(s);
      } catch (e) {
        errors.push(s);
        console.warn('Cant find Skill : ' + s);
      }
    }

    for (let i = 0; i < talents.length; i++) {
      const t = talents[i];
      try {
        await game.wfrp4e.utility.findTalent(t);
      } catch (e) {
        errors.push(t);
        console.warn('Cant find Talent : ' + t);
      }
    }

    callback(errors);
  }
}
