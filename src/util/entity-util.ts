import StringUtil from './string-util.js';
import deburr from './lodash/deburr.js';

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

  public static toSelectOptionGroup(items: {
    [group: string]: (Item.Data & any)[];
  }): { [group: string]: { [key: string]: string } } {
    if (items == null) {
      return {};
    }
    const map: { [group: string]: { [key: string]: string } } = {};
    for (let group of Object.keys(items)) {
      map[group] = this.toSelectOption(items[group]);
    }
    return map;
  }

  public static toMinimalName(value: string): string {
    let result = deburr(value).toLowerCase().trim();
    result = result.replace(/\s/g, '');
    result = result.replace(/\(/g, '');
    result = result.replace(/\)/g, '');
    return result;
  }
}
