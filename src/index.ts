import { Array as YArray, Map as YMap, Text as YText } from 'yjs';

type YContainer = YArray<any> | YMap<any>;

type Path = string[];

type Change =
  | {
      type: 'put';
      key: Path;
      value: string | number | boolean;
    }
  | {
      type: 'del';
      key: Path;
      value: undefined;
    };

type ChangeSet = Array<Change>;

const getPath = (container: YContainer, path: Path) => {
  let currentContainer = container;
  path.forEach((key) => {
    if (currentContainer instanceof YArray) {
      container = currentContainer.get(parseInt(key));
    } else {
      container = currentContainer.get(key);
    }
  });
  return container;
};

const fromJSON = (json: unknown) => {
  if (json == null || ['boolean', 'number'].includes(typeof json)) {
    return json;
  }
  if (typeof json === 'string') {
    const text = new YText();
    text.insert(0, json);
    return text;
  }
  if (Array.isArray(json)) {
    const elements = json.map(fromJSON);
    const array = new YArray();
    array.insert(0, elements);
    return array;
  }
  if (Object.keys(json).length > 0) {
    const values = Object.values(json).map(fromJSON);
    const map = new YMap();
    Object.keys(json).forEach((key, i) => {
      map.set(key, values[i]);
    });
    return map;
  }
};

export const applyChangeset = (container: YContainer, changeset: ChangeSet) => {
  console.log(changeset);
  changeset.forEach(({ type, key: path, value }) => {
    // console.log(type, path, value);
    const lastKey = path[path.length - 1];
    const containerToUpdate = getPath(container, path.slice(0, -1));
    const yValue = fromJSON(value);
    switch (type) {
      case 'put':
        if (containerToUpdate instanceof YArray) {
          containerToUpdate.insert(parseInt(lastKey), [yValue]);
        } else {
          containerToUpdate.set(lastKey, yValue);
        }
        break;
      case 'del':
        if (containerToUpdate instanceof YArray) {
          containerToUpdate.delete(parseInt(lastKey));
        } else {
          containerToUpdate.delete(lastKey);
        }
        break;
      default:
        throw new Error();
    }
  });
};
