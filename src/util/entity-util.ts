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

  public static toSelectOption(items: Item[]): { [key: string]: string } {
    if (items == null) {
      return {};
    }
    const map: { [key: string]: string } = {};
    for (let item of items) {
      map[item._id] = item.name;
    }
    return map;
  }
}
