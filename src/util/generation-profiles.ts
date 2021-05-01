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
        name: 'Citoyen',
        genPath: 'PNJs/Citoyen',
        imagePath: 'modules/wfrp4e-core/art/careers/witch-hunter.webp',
        tokenPath: 'token/uploads/Pnjs/Humans/City/human-*.png',
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
