import assert from "node:assert/strict";
import { test } from "node:test";

import { chunk, snakeCase, truncate, unique } from "../lib.js";

test("snakeCase splits camelCase boundaries", () => {
  assert.equal(snakeCase("parseHTTPResponse"), "parse_http_response");
});

test("snakeCase collapses separators and trims noise", () => {
  assert.equal(snakeCase("  already-snake--case  "), "already_snake_case");
});

test("unique keeps first occurrences in order", () => {
  assert.deepEqual(unique([3, 1, 3, 2, 1]), [3, 1, 2]);
});

test("chunk splits even and uneven runs", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("chunk rejects a non-positive size", () => {
  assert.throws(() => chunk([1], 0), RangeError);
});

test("truncate keeps short strings intact", () => {
  assert.equal(truncate("short", 10), "short");
});

test("truncate cuts and marks long strings", () => {
  assert.equal(truncate("abcdefgh", 5), "abcde...");
});

test("truncate rejects a non-positive max", () => {
  assert.throws(() => truncate("x", 0), RangeError);
});
