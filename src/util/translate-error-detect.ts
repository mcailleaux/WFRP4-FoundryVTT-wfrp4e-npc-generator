import ReferentialUtil from './referential-util.js';
import StringUtil from './string-util.js';

export default class TranslateErrorDetect {
  public static async detectRandomCareerTranslateError(
    callback: (errors: string[]) => void
  ) {
    const randomCareers: string[] = game.wfrp4e.tables.career.rows.map(
      (row: any) => row.name
    );

    const careers = await ReferentialUtil.getCareerEntities();

    const errors: string[] = [];

    randomCareers.forEach((rc) => {
      let cs = careers.filter((c) =>
        StringUtil.includesDeburrIgnoreCase(
          (<any>c.data?.data)?.careergroup?.value,
          rc
        )
      );

      if (cs.length !== 4) {
        const strictCareer = careers.find((c) =>
          StringUtil.equalsDeburrIgnoreCase(c.name, rc)
        );
        if (strictCareer != null) {
          cs = careers.filter((c) =>
            StringUtil.includesDeburrIgnoreCase(
              (<any>c.data?.data)?.careergroup?.value,
              (<any>strictCareer.data?.data)?.careergroup?.value
            )
          );
        }
      }

      if (cs.length !== 4) {
        errors.push('Random : ' + rc);
        errors.push(...cs.map((c) => c.name));
      }
    });
    callback(errors);
  }

  public static async detectSkillsAndTalentsTranslateError(
    callback: (errors: string[]) => void
  ) {
    const speciesSkillsMap = ReferentialUtil.getSpeciesSkillsMap();
    const speciesTalentsMap = ReferentialUtil.getSpeciesTalentsMap();
    const randomTalents = ReferentialUtil.getRandomTalents();

    const careers: Item[] = await ReferentialUtil.getCareerEntities();

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
        await ReferentialUtil.findSkill(s);
      } catch (e) {
        errors.push(s);
        console.warn('Cant find Skill : ' + s);
      }
    }

    for (let i = 0; i < talents.length; i++) {
      const t = talents[i];
      try {
        await ReferentialUtil.findTalent(t);
      } catch (e) {
        errors.push(t);
        console.warn('Cant find Talent : ' + t);
      }
    }

    callback(errors);
  }
}
