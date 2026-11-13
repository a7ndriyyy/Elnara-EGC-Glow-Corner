// Calendar and tariff rules for bookings (TZ step 7). Pure functions — see schedule.test.js.

const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

/**
 * Easter Sunday (Gregorian) — Meeus/Jones/Butcher algorithm.
 * @returns {{ year: number, month: number, day: number }} month is 1-12
 */
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

// Date arithmetic in UTC so local time zones / DST never shift a calendar day.
function addDays({ year, month, day }, days) {
  const t = new Date(Date.UTC(year, month - 1, day + days));
  return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/**
 * The 11 French public holidays of a year, computed (never hard-coded per year).
 * @returns {{ date: string, key: string }[]} date as "YYYY-MM-DD"
 */
export function frenchPublicHolidays(year) {
  const easter = easterSunday(year);
  return [
    { date: iso(year, 1, 1), key: "newYear" },
    { date: addDays(easter, 1), key: "easterMonday" },
    { date: iso(year, 5, 1), key: "labourDay" },
    { date: iso(year, 5, 8), key: "victoryDay" },
    { date: addDays(easter, 39), key: "ascension" },
    { date: addDays(easter, 50), key: "whitMonday" },
    { date: iso(year, 7, 14), key: "bastilleDay" },
    { date: iso(year, 8, 15), key: "assumption" },
    { date: iso(year, 11, 1), key: "allSaints" },
    { date: iso(year, 11, 11), key: "armistice" },
    { date: iso(year, 12, 25), key: "christmas" },
  ];
}

/** "YYYY-MM-DD" or a Date (its local calendar day) → "YYYY-MM-DD". */
function toIsoDay(date) {
  if (typeof date === "string") return date.slice(0, 10);
  return iso(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** Holiday key ("ascension", …) for that calendar day, or null. */
export function frenchHolidayKey(date) {
  const day = toIsoDay(date);
  const year = Number(day.slice(0, 4));
  return frenchPublicHolidays(year).find((h) => h.date === day)?.key ?? null;
}

/** TZ 7.2: true when the day is one of the 11 French public holidays. */
export function isFrenchPublicHoliday(date) {
  return frenchHolidayKey(date) !== null;
}

/** Saturday or Sunday for a "YYYY-MM-DD" day (time-zone independent). */
export function isWeekend(date) {
  const day = toIsoDay(date);
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  return weekday === 0 || weekday === 6;
}

/** Wall-clock "HH:MM" of an instant in a time zone (e.g. a booking slot in Paris). */
export function timeInZone(instant, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get("hour")}:${get("minute")}`;
}

/**
 * Notices for a booking choice (TZ 7.2).
 * @param {object} p
 * @param {string} p.date        "YYYY-MM-DD" (salon calendar day)
 * @param {string} [p.time]      "HH:MM" start time in the salon time zone
 * @param {boolean} [p.homeVisit]
 * @param {number|null} [p.price] base price in € when known
 * @param {object} p.rules       src/data/pricingRules.js
 */
export function bookingNotices({ date, time, homeVisit = false, price = null, rules }) {
  const { start, end } = rules.workingHours;
  const holidayKey = date ? frenchHolidayKey(date) : null;
  const weekend = date ? isWeekend(date) : false;

  // A holiday wins over a weekend (both double, but the holiday name is more useful).
  const rate = holidayKey ? "holiday" : weekend ? "weekend" : null;
  const multiplier = holidayKey ? rules.holidayMultiplier : weekend ? rules.weekendMultiplier : 1;

  return {
    // "HH:MM" strings compare correctly as text.
    early: Boolean(time) && time < start,
    late: Boolean(time) && time > end,
    rate,
    holidayKey,
    multiplier,
    adjustedPrice: rate && Number.isFinite(price) ? price * multiplier : null,
    homeVisit: Boolean(homeVisit),
  };
}
