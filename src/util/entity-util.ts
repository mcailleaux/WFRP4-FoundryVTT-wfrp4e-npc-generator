import StringUtil from './string-util.js';

export default class EntityUtil {
  public static match(item: any, ref: Item & any) {
    return (
      StringUtil.getSimpleName(item.name) ===
        StringUtil.getSimpleName(ref.name) ||
      StringUtil.getSimpleName(item.name) ===
        StringUtil.getSimpleName(ref.data.originalName)
    );
  }

  public static toSelectOption(
    items: (Item.Data & any)[]
  ): { [key: string]: string } {
    if (items == null) {
      return {};
    }
    const map: { [key: string]: string } = {};
    for (let item of items) {
      if (map[item._id] == null) {
        map[item._id] = item.displayName ?? item.name;
      }
    }
    return map;
  }
}
