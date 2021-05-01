export declare type GenerationProfile = {
  [name: string]: {
    genPath?: string;
    imagePath?: string;
    tokenPath?: string;
  };
};

export default class GenerationProfiles {
  human: GenerationProfile = {
    test: {
      genPath: 'test',
    },
  };
  halfling: GenerationProfile = {};
  dwarf: GenerationProfile = {};
  welf: GenerationProfile = {};
  helf: GenerationProfile = {};
}
