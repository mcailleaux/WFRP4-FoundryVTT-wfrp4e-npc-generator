import { AbstractChooser } from './abstract-chooser.js';
import { i18n } from '../constant.js';
import RegisterSettings from '../util/register-settings.js';
import ReferentialUtil from '../util/referential-util.js';
import RandomUtil from '../util/random-util.js';

class Model {
  public majors: string[];
  public minors: string[];

  constructor(majors: string[], minors: string[]) {
    this.majors = majors;
    this.minors = minors;
  }
}

class SkillModel {
  public label: string;
  public major: boolean;
  public minor: boolean;

  constructor(label: string, major: boolean, minor: boolean) {
    this.label = label;
    this.major = major;
    this.minor = minor;
  }
}

export class SpeciesSkillsChooser extends AbstractChooser<
  Model,
  {
    skills: SkillModel[];
  }
> {
  private skills: string[];

  private callback: (majors: string[], minors: string[]) => void;

  constructor(
    object: Model,
    skills: string[],
    callback: (majors: string[], minors: string[]) => void,
    previousCallback: (() => void) | null,
    options?: Partial<FormApplication.Options>
  ) {
    super(object, previousCallback, options);

    this.skills = skills;
    this.callback = callback;

    this.updateSkillModel(
      skills,
      this.model.data.majors,
      this.model.data.minors
    );
  }

  public static get defaultOptions(): FormApplication.Options {
    return mergeObject(super.defaultOptions, {
      id: 'species-skills-chooser',
      title: i18n().localize('WFRP4NPCGEN.species.skills.select.title'),
      template: `modules/${RegisterSettings.moduleName}/templates/species-skills-chooser.html`,
      width: 400,
    });
  }

  public static async selectSpeciesSkills(
    initMajors: string[],
    initMinors: string[],
    speciesKey: string,
    subSpeciesKey: string,
    callback: (major: string[], minor: string[]) => void,
    undo: () => void
  ) {
    const speciesSkills: string[] = [];
    const skills =
      subSpeciesKey != null
        ? ReferentialUtil.getSubSpeciesMap()[speciesKey][subSpeciesKey].skills
        : await ReferentialUtil.getSpeciesSkills(speciesKey);
    for (let skill of skills) {
      try {
        const refSkill = await ReferentialUtil.findSkill(skill);
        if (refSkill != null) {
          speciesSkills.push(refSkill.name);
        } else {
          speciesSkills.push(skill);
        }
      } catch (e) {
        console.warn('Cant find Skill : ' + skill);
      }
    }

    new SpeciesSkillsChooser(
      new Model(initMajors ?? [], initMinors ?? []),
      speciesSkills,
      callback,
      undo
    ).render(true);
  }

  public activateListeners(html: JQuery) {
    super.activateListeners(html);
    this.handleClick(html, '#randomSpeciesSkillsButton', (_event) => {
      this.toggleRandom();
      this.render();
    });
    this.handleClick(html, '.species-skill-major-radio', (event) => {
      this.toggleMajor(event.currentTarget.value);
      this.render();
    });
    this.handleClick(html, '.species-skill-minor-radio', (event) => {
      this.toggleMinor(event.currentTarget.value);
      this.render();
    });
  }

  protected isValid(data: Model): boolean {
    return data.majors.length === 3 && data.minors.length === 3;
  }

  protected yes(data: Model) {
    this.callback(data?.majors ?? [], data?.minors ?? []);
  }

  private toggleRandom() {
    const randomSkills = RandomUtil.getRandomValues(this.skills, 6);
    const randomMajors = RandomUtil.getRandomValues(randomSkills, 3);
    const randomMinors = randomSkills.filter((s) => !randomMajors.includes(s));
    this.model.data.majors = randomMajors;
    this.model.data.minors = randomMinors;
    this.updateSkillModel(
      this.skills,
      this.model.data.majors,
      this.model.data.minors
    );
  }

  private toggleMajor(skill: string) {
    if (this.model.data.majors.includes(skill)) {
      this.model.data.majors = this.model.data.majors.filter(
        (s) => s !== skill
      );
    } else {
      this.model.data.majors.push(skill);
      if (this.model.data.minors.includes(skill)) {
        this.model.data.minors = this.model.data.minors.filter(
          (s) => s !== skill
        );
      }
      if (this.model.data.majors.length > 3) {
        this.model.data.majors = this.model.data.majors.filter(
          (_s, idx) => idx > 0
        );
      }
    }
    this.updateSkillModel(
      this.skills,
      this.model.data.majors,
      this.model.data.minors
    );
  }

  private toggleMinor(skill: string) {
    if (this.model.data.minors.includes(skill)) {
      this.model.data.minors = this.model.data.minors.filter(
        (s) => s !== skill
      );
    } else {
      this.model.data.minors.push(skill);
      if (this.model.data.majors.includes(skill)) {
        this.model.data.majors = this.model.data.majors.filter(
          (s) => s !== skill
        );
      }
      if (this.model.data.minors.length > 3) {
        this.model.data.minors = this.model.data.minors.filter(
          (_s, idx) => idx > 0
        );
      }
    }
    this.updateSkillModel(
      this.skills,
      this.model.data.majors,
      this.model.data.minors
    );
  }

  private updateSkillModel(
    skills: string[],
    majors: string[],
    minors: string[]
  ) {
    const initSkills = skills ?? [];
    const initMajors = majors ?? [];
    const initMinors = minors ?? [];
    this.model.skills = initSkills.map((skill) => {
      return new SkillModel(
        skill,
        initMajors.includes(skill),
        initMinors.includes(skill)
      );
    });
  }
}
