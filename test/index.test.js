import { test } from 'node:test';
import assert from 'node:assert/strict';

import { chunk, slugify, tail } from '../index.js';

test('slugify collapses separators', () => {
  assert.equal(slugify('  Hello, CI World! '), 'hello-ci-world');
});

test('slugify handles already clean input', () => {
  assert.equal(slugify('already-clean'), 'already-clean');
});

test('chunk splits evenly and keeps the remainder', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [
    [1, 2],
    [3, 4],
    [5],
  ]);
});

test('chunk rejects a zero size', () => {
  assert.throws(() => chunk([1], 0), RangeError);
});

test('tail takes the last n items', () => {
  assert.deepEqual(tail([1, 2, 3, 4], 2), [3, 4]);
  assert.deepEqual(tail([1], 5), [1]);
});
