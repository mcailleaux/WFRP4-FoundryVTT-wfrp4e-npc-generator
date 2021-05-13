export default class MutationsChooser {
  public static async selectMutations(
    initPhysicals: Item.Data[],
    initMentals: Item.Data[],
    callback: (physicals: Item.Data[], mentals: Item.Data[]) => void,
    _undo?: () => void
  ) {
    callback(initPhysicals, initMentals);
  }
}
