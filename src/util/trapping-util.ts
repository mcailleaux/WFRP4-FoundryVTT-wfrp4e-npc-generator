import ReferentialUtil from './referential-util.js';

export default class TrappingUtil {
  public static readonly GENERATE_MONEY_KEY = 'GENERATE_MONEY_KEY';

  public static async generateMoney(actor: Actor) {
    if (actor == null) {
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

    const moneyItems = await ReferentialUtil.getAllMoneyItems();
    const coins = (<any>actor.data)?.money?.coins;
    let gCoin = coins.find((c: any) => c.data?.coinValue?.value === 240);
    let sCoin = coins.find((c: any) => c.data?.coinValue?.value === 12);
    let bCoin = coins.find((c: any) => c.data?.coinValue?.value === 1);

    const isGoldCreate = gCoin == null;
    const isSilverCreate = sCoin == null;
    const isBrassCreate = bCoin == null;

    const createGCoin = moneyItems[0];
    const createSCoin = moneyItems[1];
    const createBCoin = moneyItems[2];

    if (gold > 0 || isGoldCreate) {
      if (isGoldCreate) {
        (<any>createGCoin.data).quantity.value = gold;
        await actor.createOwnedItem(createGCoin);
      } else {
        await actor.updateOwnedItem({
          _id: gCoin._id,
          'data.quantity.value': gold,
        });
      }
    }

    if (silver > 0 || isSilverCreate) {
      if (isSilverCreate) {
        (<any>createSCoin.data).quantity.value = silver;
        await actor.createOwnedItem(createSCoin);
      } else {
        await actor.updateOwnedItem({
          _id: sCoin._id,
          'data.quantity.value': silver,
        });
      }
    }

    if (brass > 0 || isBrassCreate) {
      if (isBrassCreate) {
        (<any>createBCoin.data).quantity.value = brass;
        await actor.createOwnedItem(createBCoin);
      } else {
        await actor.updateOwnedItem({
          _id: bCoin._id,
          'data.quantity.value': brass,
        });
      }
    }
  }
}
