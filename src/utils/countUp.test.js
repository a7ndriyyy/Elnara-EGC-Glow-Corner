import { test } from "node:test";
import assert from "node:assert/strict";
import { easeOutCubic, formatThousands, countValueAt } from "./countUp.js";

test("formatThousands groups digits with non-breaking spaces", () => {
  assert.equal(formatThousands(20000), "20 000");
  assert.equal(formatThousands(1234567), "1 234 567");
  assert.equal(formatThousands(21), "21");
  assert.equal(formatThousands(0), "0");
});

test("easeOutCubic is clamped and monotonic", () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(2), 1);
  assert.equal(easeOutCubic(-1), 0);
  assert.ok(easeOutCubic(0.5) > 0.5, "eases out: fast start");
});

test("countValueAt starts at 0 and lands exactly on the target", () => {
  assert.equal(countValueAt(20000, 0, 2000), 0);
  assert.equal(countValueAt(20000, 2000, 2000), 20000);
  assert.equal(countValueAt(20000, 5000, 2000), 20000);
  assert.equal(countValueAt(50, 100, 0), 50);
});
