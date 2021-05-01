export declare type GenerationProfile = {
  profiles: {
    name: string;
    genPath?: string;
    imagePath?: string;
    tokenPath?: string;
  }[];
};

export default class GenerationProfiles {
  human: GenerationProfile = {
    profiles: [
      {
        name: 'test',
        genPath: 'test',
      },
    ],
  };
  halfling: GenerationProfile = {
    profiles: [],
  };
  dwarf: GenerationProfile = {
    profiles: [],
  };
  welf: GenerationProfile = {
    profiles: [],
  };
  helf: GenerationProfile = {
    profiles: [],
  };
}
