import StringUtil from './string-util.js';
import deburr from './lodash/deburr.js';
import RandomUtil from './random-util.js';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { babele } from '../constant.js';
import { DocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/module.mjs.js';

export default class EntityUtil {
  public static match(item: any, ref: Item & any): boolean {
    return (
      StringUtil.getSimpleName(item.name) ===
        StringUtil.getSimpleName(ref.name) ||
      StringUtil.getSimpleName(item.name) ===
        StringUtil.getSimpleName(ref.data?.flags?.babele?.originalName)
    );
  }

  public static toSelectOption(
    items: (ItemData & any)[]
  ): { [key: string]: string } {
    if (items == null) {
      return {};
    }
    const map: { [key: string]: string } = {};
    for (let item of items) {
      if (map[item._id] == null) {
        try {
          map[item._id] = item.displayName ?? item.DisplayName ?? item.name;
        } catch (e) {
          map[item._id] = item.displayName ?? item.name;
        }
      }
    }
    return map;
  }

  public static toSelectOptionGroup(items: {
    [group: string]: (ItemData & any)[];
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

  public static find(name: string, entities: Item[]): ItemData | null {
    if (name == null || entities?.length <= 0) {
      return null;
    }
    const matchName = StringUtil.toDeburrLowerCase(name).trim();
    let findByVo = false;
    let findByVoExactMatch = false;
    const hasBabele = babele()?.modules?.length > 0 ?? false;
    let result = entities.find(
      (e: Item & any) =>
        (!hasBabele || e.data?.flags?.babele?.hasTranslation) &&
        StringUtil.equalsDeburrIgnoreCase(e.name.trim(), matchName)
    );
    if (result == null) {
      result = entities.find((e: Item & any) =>
        StringUtil.equalsDeburrIgnoreCase(
          e.data?.flags?.babele?.originalName?.trim(),
          matchName
        )
      );
      findByVo = result != null;
      findByVoExactMatch = result != null;
    }
    if (result == null) {
      const simpleMatchName = StringUtil.toDeburrLowerCase(
        StringUtil.getSimpleName(name)
      ).trim();
      result = entities.find(
        (e: Item & any) =>
          (!hasBabele || e.data?.flags?.babele?.hasTranslation) &&
          StringUtil.equalsDeburrIgnoreCase(
            StringUtil.getSimpleName(e.name).trim(),
            simpleMatchName
          )
      );
      if (result == null) {
        result = entities.find((e: Item & any) =>
          StringUtil.equalsDeburrIgnoreCase(
            StringUtil.getSimpleName(
              e.data?.flags?.babele?.originalName
            )?.trim(),
            simpleMatchName
          )
        );
        findByVo = result != null;
      }
    }
    if (result != null) {
      const data = duplicate(result.data);
      data._id = RandomUtil.getRandomId();
      if (findByVo) {
        if (!findByVoExactMatch && name.includes('(')) {
          const tradSimpleName = StringUtil.getSimpleName(data.name).trim();
          const groupName = StringUtil.getGroupName(name).trim();
          data.name = `${tradSimpleName} (${groupName})`;
        }
      } else {
        data.name = name;
      }
      return <ItemData>(<unknown>data);
    }
    return null;
  }

  public static hasGroupName(name: string): boolean {
    return name?.includes('(') && name?.includes(')');
  }

  public static toRecords<E, F extends object>(
    arrays: (DocumentData<E, F> & any)[]
  ): Record<string, unknown>[] {
    return arrays.map((d) => (d.toObject != null ? d.toObject() : d));
  }
}
