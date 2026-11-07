import assert from "node:assert/strict";
import { test } from "node:test";

import { average, chunk, clamp, slugify, tail } from "../index.js";

test("slugify collapses separators", () => {
  assert.equal(slugify("  Hello, CI World! "), "hello-ci-world");
});

test("slugify handles already clean input", () => {
  assert.equal(slugify("already-clean"), "already-clean");
});

test("chunk splits evenly and keeps the remainder", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("chunk rejects a zero size", () => {
  assert.throws(() => chunk([1], 0), RangeError);
});

test("tail takes the last n items", () => {
  assert.deepEqual(tail([1, 2, 3, 4], 2), [3, 4]);
  assert.deepEqual(tail([1], 5), [1]);
});

test("clamp keeps values inside bounds", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.throws(() => clamp(1, 10, 0), RangeError);
});

test("average handles the basic case", () => {
  assert.equal(average([2, 4, 6]), 4);
});

test("average rejects an empty list", () => {
  assert.throws(() => average([]), RangeError);
});
