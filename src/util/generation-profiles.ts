export declare type GenerationSingleProfile = {
  name: string;
  genPath?: string;
  imagePath?: string;
  tokenPath?: string;
};

export declare type GenerationProfile = {
  profiles: GenerationSingleProfile[];
};

export default class GenerationProfiles {
  human: GenerationProfile = {
    profiles: [],
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
  creature: GenerationProfile = {
    profiles: [],
  };
}
