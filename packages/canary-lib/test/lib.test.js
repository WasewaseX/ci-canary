import assert from "node:assert/strict";
import { test } from "node:test";

import { chunk, snakeCase, unique } from "../lib.js";

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
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [
    [1, 2],
    [3, 4],
    [5],
  ]);
});

test("chunk rejects a non-positive size", () => {
  assert.throws(() => chunk([1], 0), RangeError);
});
