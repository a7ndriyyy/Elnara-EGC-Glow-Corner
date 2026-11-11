import { test } from "node:test";
import assert from "node:assert/strict";
import {
  todayInZone,
  isPromotionLive,
  livePromotions,
  validatePromotion,
  formatEuro,
  formatDayMonth,
} from "./promotions.js";

const today = "2026-11-11";
const base = { is_active: true, start_date: null, end_date: null, created_at: "2026-11-01T10:00:00Z" };

test("todayInZone uses the salon's calendar day", () => {
  // 23:30 UTC on 10 Nov is already 11 Nov in Paris (UTC+1).
  assert.equal(todayInZone("Europe/Paris", new Date("2026-11-10T23:30:00Z")), "2026-11-11");
  assert.equal(todayInZone("Europe/Paris", new Date("2026-11-10T22:30:00Z")), "2026-11-10");
});

test("isPromotionLive: inactive, not started and expired are hidden", () => {
  assert.equal(isPromotionLive(base, today), true);
  assert.equal(isPromotionLive({ ...base, is_active: false }, today), false);
  assert.equal(isPromotionLive({ ...base, start_date: "2026-11-12" }, today), false);
  assert.equal(isPromotionLive({ ...base, end_date: "2026-11-10" }, today), false, "ended yesterday");
  assert.equal(isPromotionLive({ ...base, end_date: "2026-11-11" }, today), true, "last day still shown");
  assert.equal(isPromotionLive({ ...base, start_date: "2026-11-11", end_date: "2026-11-30" }, today), true);
});

test("livePromotions: newest first, limited", () => {
  const list = [
    { ...base, id: "a", created_at: "2026-11-01T10:00:00Z" },
    { ...base, id: "b", created_at: "2026-11-05T10:00:00Z" },
    { ...base, id: "c", created_at: "2026-11-03T10:00:00Z", end_date: "2026-11-02" },
    { ...base, id: "d", created_at: "2026-11-04T10:00:00Z" },
  ];
  assert.deepEqual(livePromotions(list, today).map((p) => p.id), ["b", "d", "a"]);
  assert.deepEqual(livePromotions(list, today, 2).map((p) => p.id), ["b", "d"]);
  assert.deepEqual(livePromotions(null, today), []);
});

test("validatePromotion: normalizes a good row", () => {
  const { errors, row } = validatePromotion({
    title: "  Знижка на брови ", description: " -20% ", type: "promotion",
    old_price: "100", new_price: "79,5", start_date: "2026-11-01", end_date: "2026-11-30", is_active: true,
  });
  assert.deepEqual(errors, {});
  assert.equal(row.title, "Знижка на брови");
  assert.equal(row.description, "-20%");
  assert.equal(row.old_price, 100);
  assert.equal(row.new_price, 79.5);
  assert.equal(row.image_url, null);
});

test("validatePromotion: reports field errors", () => {
  const { errors } = validatePromotion({
    title: "", type: "sale", old_price: "-5", new_price: "abc",
    start_date: "2026-11-30", end_date: "2026-11-01", image_url: "javascript:alert(1)",
  });
  assert.equal(errors.title, "required");
  assert.equal(errors.type, "invalidType");
  assert.equal(errors.old_price, "invalidPrice");
  assert.equal(errors.new_price, "invalidPrice");
  assert.equal(errors.end_date, "dateOrder");
  assert.equal(errors.image_url, "invalidUrl");
  assert.equal(validatePromotion({ title: "x".repeat(121), type: "new" }).errors.title, "tooLong");
  assert.equal(validatePromotion({ title: "ok", type: "new", description: "x".repeat(1001) }).errors.description, "tooLong");
});

test("formatting helpers", () => {
  assert.equal(formatEuro(250, "en"), "250 €");
  assert.equal(formatEuro(null), null);
  assert.equal(formatDayMonth("2026-11-30"), "30.11");
  assert.equal(formatDayMonth(null), null);
});
