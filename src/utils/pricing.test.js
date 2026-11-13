import { test } from "node:test";
import assert from "node:assert/strict";
import { durationLabel, euros, priceLabel, toCardProps } from "./pricing.js";

test("price labels: fixed, from, add-on", () => {
  assert.equal(priceLabel({ price: 300 }, "en"), "300 €");
  assert.equal(priceLabel({ price: 120, priceKind: "from" }, "uk", "від {price}"), "від 120 €");
  assert.equal(priceLabel({ price: 15, priceKind: "addon" }, "fr"), "+15 €");
  assert.equal(priceLabel({ price: null }, "uk"), null);
  assert.equal(euros(19.5, "en"), "19.50 €");
});

test("duration labels: single, range, add-on, unknown", () => {
  assert.equal(durationLabel({ duration: 150 }, "uk"), "2,5 год");
  assert.equal(durationLabel({ duration: [150, 180] }, "uk"), "2,5 год – 3 год");
  assert.equal(durationLabel({ duration: 15, priceKind: "addon" }, "uk"), "+15 хв");
  assert.equal(durationLabel({ duration: 75 }, "fr"), "1 h 15 min");
  assert.equal(durationLabel({ duration: null }, "uk"), null);
});

test("toCardProps works for price-list items and older service objects", () => {
  const t = (k) => ({ "priceList.from": "від {price}", "priceList.correctionIncluded": "Корекція включена" })[k];
  const pl = toCardProps({ name: { uk: "Пудрові брови" }, price: 300, duration: 150, correction: true }, "uk", t);
  assert.deepEqual(pl, { title: "Пудрові брови", description: "Корекція включена", duration: "2,5 год", price: "300 €" });
  const old = toCardProps({ title: { uk: "Пресотерапія" }, description: { uk: "Лімфодренаж" }, duration: null, priceFrom: null }, "uk", t);
  assert.deepEqual(old, { title: "Пресотерапія", description: "Лімфодренаж", duration: null, price: null });
});
