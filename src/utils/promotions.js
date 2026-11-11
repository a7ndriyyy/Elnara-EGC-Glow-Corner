// Promotions helpers (TZ step 9). Pure functions — see promotions.test.js.

export const PROMOTION_TYPES = ["promotion", "new"];
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 1000;

/** Today's calendar day ("YYYY-MM-DD") in a time zone — promotions end at the salon's midnight. */
export function todayInZone(timeZone, now = new Date()) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Active and inside its (optional) start/end window. Dates are "YYYY-MM-DD" strings. */
export function isPromotionLive(promotion, today) {
  if (!promotion?.is_active) return false;
  if (promotion.start_date && promotion.start_date > today) return false;
  if (promotion.end_date && promotion.end_date < today) return false;
  return true;
}

/** Live promotions, newest first, optionally limited. */
export function livePromotions(list, today, limit) {
  const live = (list || [])
    .filter((p) => isPromotionLive(p, today))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  return limit ? live.slice(0, limit) : live;
}

const parsePrice = (raw) => {
  if (raw === null || raw === undefined || String(raw).trim() === "") return { value: null };
  const n = Number(String(raw).replace(",", ".").replace(/\s/g, ""));
  if (!Number.isFinite(n) || n < 0 || n > 100000) return { error: "invalidPrice" };
  return { value: Math.round(n * 100) / 100 };
};

const isIsoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

/**
 * Validates admin form input and returns a row ready for the database.
 * @returns {{ errors: Record<string,string>, row: object }} errors keyed by field
 */
export function validatePromotion(input) {
  const errors = {};
  const title = String(input.title ?? "").trim();
  const description = String(input.description ?? "").trim();

  if (!title) errors.title = "required";
  else if (title.length > TITLE_MAX) errors.title = "tooLong";
  if (description.length > DESCRIPTION_MAX) errors.description = "tooLong";

  const type = PROMOTION_TYPES.includes(input.type) ? input.type : null;
  if (!type) errors.type = "invalidType";

  const oldPrice = parsePrice(input.old_price);
  const newPrice = parsePrice(input.new_price);
  if (oldPrice.error) errors.old_price = oldPrice.error;
  if (newPrice.error) errors.new_price = newPrice.error;

  const start = input.start_date || null;
  const end = input.end_date || null;
  if (start && !isIsoDate(start)) errors.start_date = "invalidDate";
  if (end && !isIsoDate(end)) errors.end_date = "invalidDate";
  if (start && end && isIsoDate(start) && isIsoDate(end) && end < start) errors.end_date = "dateOrder";

  const image = input.image_url ? String(input.image_url) : null;
  if (image && !/^https:\/\//.test(image)) errors.image_url = "invalidUrl";

  return {
    errors,
    row: {
      title,
      description,
      type: type ?? "promotion",
      old_price: oldPrice.value ?? null,
      new_price: newPrice.value ?? null,
      start_date: start,
      end_date: end,
      image_url: image,
      is_active: Boolean(input.is_active),
    },
  };
}

/** 250 → "250 €", 19.9 → "19,90 €" (locale aware, no trailing zeros for whole euros). */
export function formatEuro(value, locale = "uk") {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })} €`;
}

/** "2026-11-30" → "30.11" (day.month, as in the spec). */
export function formatDayMonth(isoDate) {
  if (!isoDate) return null;
  const [, m, d] = isoDate.split("-");
  return `${d}.${m}`;
}
