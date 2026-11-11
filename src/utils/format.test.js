import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration, localize } from "./format.js";

test("formatDuration per language", () => {
  assert.equal(formatDuration(45, "uk"), "45 хв");
  assert.equal(formatDuration(60, "uk"), "1 год");
  assert.equal(formatDuration(90, "uk"), "1,5 год");
  assert.equal(formatDuration(75, "uk"), "1 год 15 хв");
  assert.equal(formatDuration(120, "ru"), "2 ч");
  assert.equal(formatDuration(90, "en"), "1.5 h");
  assert.equal(formatDuration(90, "fr"), "1,5 h");
  assert.equal(formatDuration(20, "fr"), "20 min");
});

test("formatDuration hides unknown values", () => {
  assert.equal(formatDuration(null), null);
  assert.equal(formatDuration(undefined), null);
  assert.equal(formatDuration(0), null);
});

test("localize falls back to uk, then en", () => {
  assert.equal(localize({ uk: "Брови", en: "Brows" }, "fr"), "Брови");
  assert.equal(localize({ en: "Brows" }, "fr"), "Brows");
  assert.equal(localize({ uk: "Брови", fr: "Sourcils" }, "fr"), "Sourcils");
  assert.equal(localize("plain", "fr"), "plain");
  assert.equal(localize(null, "fr"), "");
});
