export declare type GenerationProfile = {
  [name: string]: {
    genPath?: string;
    imagePath?: string;
    tokenPath?: string;
  };
};

export default class GenerationProfiles {
  human: GenerationProfile;
  halfling: GenerationProfile;
  dwarf: GenerationProfile;
  welf: GenerationProfile;
  helf: GenerationProfile;
}
