import { test } from "node:test";
import assert from "node:assert/strict";
import {
  easterSunday,
  frenchPublicHolidays,
  isFrenchPublicHoliday,
  frenchHolidayKey,
  isWeekend,
  timeInZone,
  bookingNotices,
} from "./schedule.js";

const rules = {
  timeZone: "Europe/Paris",
  workingHours: { start: "09:00", end: "18:00" },
  weekendMultiplier: 2,
  holidayMultiplier: 2,
};

test("Easter Sunday matches known dates (Meeus/Butcher)", () => {
  const known = {
    2000: [4, 23], 2019: [4, 21], 2024: [3, 31], 2025: [4, 20], 2026: [4, 5],
    2027: [3, 28], 2038: [4, 25], 1818: [3, 22], 2285: [3, 22], 1943: [4, 25],
  };
  for (const [year, [month, day]] of Object.entries(known)) {
    assert.deepEqual(easterSunday(Number(year)), { year: Number(year), month, day }, `Easter ${year}`);
  }
});

test("TZ example 2027: Easter 28.03 → Monday 29.03, Ascension 06.05, Whit Monday 17.05", () => {
  const y = Object.fromEntries(frenchPublicHolidays(2027).map((h) => [h.key, h.date]));
  assert.equal(y.easterMonday, "2027-03-29");
  assert.equal(y.ascension, "2027-05-06");
  assert.equal(y.whitMonday, "2027-05-17");
});

test("11 holidays per year, fixed ones on their dates", () => {
  for (const year of [2025, 2026, 2027, 2030]) {
    const list = frenchPublicHolidays(year);
    assert.equal(list.length, 11);
    assert.equal(new Set(list.map((h) => h.date)).size, 11, "no duplicate dates");
    for (const md of ["01-01", "05-01", "05-08", "07-14", "08-15", "11-01", "11-11", "12-25"]) {
      assert.ok(isFrenchPublicHoliday(`${year}-${md}`), `${year}-${md}`);
    }
  }
});

test("isFrenchPublicHoliday accepts strings and Date objects", () => {
  assert.equal(isFrenchPublicHoliday("2027-03-29"), true);
  assert.equal(isFrenchPublicHoliday("2027-03-28"), false, "Easter Sunday itself is not on the list");
  assert.equal(isFrenchPublicHoliday(new Date(2027, 4, 6)), true, "Ascension 2027 as a Date");
  assert.equal(isFrenchPublicHoliday("2026-11-12"), false);
  assert.equal(frenchHolidayKey("2026-05-14"), "ascension");
  assert.equal(frenchHolidayKey("2026-05-25"), "whitMonday");
});

test("isWeekend", () => {
  assert.equal(isWeekend("2027-03-27"), true, "Saturday");
  assert.equal(isWeekend("2027-03-28"), true, "Sunday");
  assert.equal(isWeekend("2027-03-29"), false, "Monday");
  assert.equal(isWeekend("2027-03-26"), false, "Friday");
});

test("timeInZone handles Paris summer and winter time", () => {
  assert.equal(timeInZone("2026-07-01T07:00:00Z", "Europe/Paris"), "09:00");
  assert.equal(timeInZone("2026-12-01T07:00:00Z", "Europe/Paris"), "08:00");
  assert.equal(timeInZone("2026-12-01T17:30:00Z", "Europe/Paris"), "18:30");
});

test("bookingNotices: working hours", () => {
  assert.equal(bookingNotices({ date: "2027-03-30", time: "08:30", rules }).early, true);
  assert.equal(bookingNotices({ date: "2027-03-30", time: "09:00", rules }).early, false);
  assert.equal(bookingNotices({ date: "2027-03-30", time: "18:00", rules }).late, false);
  assert.equal(bookingNotices({ date: "2027-03-30", time: "18:30", rules }).late, true);
  assert.equal(bookingNotices({ date: "2027-03-30", rules }).early, false, "no time chosen yet");
});

test("bookingNotices: weekend and holiday double the known price", () => {
  const weekday = bookingNotices({ date: "2027-03-30", price: 120, rules });
  assert.equal(weekday.rate, null);
  assert.equal(weekday.adjustedPrice, null);

  const sat = bookingNotices({ date: "2027-03-27", price: 120, rules });
  assert.equal(sat.rate, "weekend");
  assert.equal(sat.adjustedPrice, 240);

  const holiday = bookingNotices({ date: "2027-05-06", price: 120, rules });
  assert.equal(holiday.rate, "holiday");
  assert.equal(holiday.holidayKey, "ascension");
  assert.equal(holiday.adjustedPrice, 240);

  const weekendHoliday = bookingNotices({ date: "2027-08-15", rules }); // Sunday + Assumption
  assert.equal(weekendHoliday.rate, "holiday");
  assert.equal(weekendHoliday.adjustedPrice, null, "unknown price → no amount shown");
});

test("bookingNotices: home visit flag", () => {
  assert.equal(bookingNotices({ date: "2027-03-30", homeVisit: true, rules }).homeVisit, true);
  assert.equal(bookingNotices({ date: "2027-03-30", rules }).homeVisit, false);
});
