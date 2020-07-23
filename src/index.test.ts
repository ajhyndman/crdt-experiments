import diff from 'changeset';
import { Array, Doc } from 'yjs';

import { applyChangeset } from './index';

describe('applyChangeset', () => {
  it('adds keys to map and list', () => {
    const doc = new Doc();
    const map = doc.getMap();
    const array1 = new Array();
    array1.insert(0, ['abc']);
    map.set('array-one', array1);
    map.set('text', 'abc');

    const obj1 = map.toJSON();
    const obj2 = {
      ...obj1,
      'array-one': ['abc', 'def'],
      extra: true,
    };

    const changeset = diff(obj1, obj2);

    doc.transact(() => {
      applyChangeset(map, changeset);
    });

    expect(map.toJSON()).toEqual(obj2);
  });

  it('constructs new (modifiable) subtrees', () => {
    const doc = new Doc();
    const map = doc.getMap();

    const obj1 = map.toJSON();
    const obj2 = {
      text: 'abc',
      'array-one': ['abc'],
      extra: { foo: true },
    };

    const changeset = diff(obj1, obj2);

    doc.transact(() => {
      applyChangeset(map, changeset);
    });

    expect(map.toJSON()).toEqual(obj2);

    const obj3 = map.toJSON();
    const obj4 = {
      ...obj3,
      'array-one': ['abc', 'def'],
      extra: { foo: true, bar: false },
    };

    const changeset2 = diff(obj3, obj4);

    doc.transact(() => {
      applyChangeset(map, changeset2);
    });

    expect(map.toJSON()).toEqual(obj4);
  });

  it('modifies text', () => {
    const doc = new Doc();
    const map = doc.getMap();
    map.set('text', 'abc');

    const obj1 = map.toJSON();
    const obj2 = {
      ...obj1,
      text: 'abcdef',
    };

    const changeset = diff(obj1, obj2);

    doc.transact(() => {
      applyChangeset(map, changeset);
    });

    expect(map.toJSON()).toEqual(obj2);
  });

  it('deletes keys', () => {
    const doc = new Doc();
    const map = doc.getMap();
    map.set('text', 'abc');

    const obj1 = map.toJSON();
    const obj2 = {};

    const changeset = diff(obj1, obj2);

    doc.transact(() => {
      applyChangeset(map, changeset);
    });

    expect(map.toJSON()).toEqual(obj2);
  });
});
