export enum GenerateEffectOptionEnum {
  NONE = 'NONE',
  DEFAULT_DISABLED = 'DEFAULT_DISABLED',
  DEFAULT_ENABLED = 'DEFAULT_ENABLED',
}

export function getGenerateEffectOptionEnum(
  value: string
): GenerateEffectOptionEnum {
  switch (value) {
    case GenerateEffectOptionEnum.DEFAULT_DISABLED:
      return GenerateEffectOptionEnum.DEFAULT_DISABLED;
    case GenerateEffectOptionEnum.DEFAULT_ENABLED:
      return GenerateEffectOptionEnum.DEFAULT_ENABLED;
    default:
      return GenerateEffectOptionEnum.NONE;
  }
}
