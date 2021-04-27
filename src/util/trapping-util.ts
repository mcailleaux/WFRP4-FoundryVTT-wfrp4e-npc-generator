import ReferentialUtil from './referential-util.js';

export default class TrappingUtil {
  public static async generateMoney(actor: Actor, tokenData: Actor.Data) {
    if (actor == null || tokenData?.items == null) {
      return;
    }

    const actorStatus = (<any>actor.data?.data)?.details?.status?.value;

    const statusTiers: {
      [key: string]: string;
    } = ReferentialUtil.getStatusTiers();

    const status = actorStatus?.split(' ')[0];
    const tierStr = actorStatus?.split(' ')[1];
    const tier: number =
      tierStr != null && Number.isNumeric(tierStr) ? Number(tierStr) : -1;
    let statusKey = null;
    Object.entries(statusTiers)?.forEach(([key, value]) => {
      if (value === status) {
        statusKey = key;
      }
    });

    if (tier < 0 || statusKey == null) {
      return;
    }

    let gold = 0;
    let silver = 0;
    let brass;

    if (statusKey === 'g') {
      gold = tier;
      silver = new Roll('5d10').roll().total;
      brass = new Roll('10d10').roll().total;
    } else if (statusKey === 's') {
      silver = new Roll(`${tier}d10`).roll().total;
      brass = new Roll('10d10').roll().total;
    } else {
      brass = new Roll(`${2 * tier}d10`).roll().total;
    }

    const coins = tokenData.items.filter((it) => it.type === 'money');
    let gCoin = coins.find((c: any) => c.data?.coinValue?.value === 240);
    let sCoin = coins.find((c: any) => c.data?.coinValue?.value === 12);
    let bCoin = coins.find((c: any) => c.data?.coinValue?.value === 1);

    if (gold > 0) {
      (<any>gCoin?.data).quantity.value = gold;
    }

    if (silver > 0) {
      (<any>sCoin?.data).quantity.value = silver;
    }

    if (brass > 0) {
      (<any>bCoin?.data).quantity.value = brass;
    }
  }
}
