// Locale helpers shared by data-driven sections.

const UNITS = {
  uk: { h: "год", min: "хв", dec: "," },
  ru: { h: "ч", min: "мин", dec: "," },
  en: { h: "h", min: "min", dec: "." },
  fr: { h: "h", min: "min", dec: "," },
};

/**
 * 45 → "45 хв", 60 → "1 год", 90 → "1,5 год", 75 → "1 год 15 хв" (uk).
 * Returns null for unknown durations so callers can hide the field.
 */
export function formatDuration(minutes, lang = "uk") {
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  const u = UNITS[lang] || UNITS.en;
  if (minutes < 60) return `${minutes} ${u.min}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} ${u.h}`;
  if (rest === 30) return `${hours}${u.dec}5 ${u.h}`;
  return `${hours} ${u.h} ${rest} ${u.min}`;
}

/** Replaces {name} placeholders in a translated string; unknown names are left as-is. */
export function fill(text, vars = {}) {
  return String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/** Picks the current language from a { uk, en, fr, ru } object (falls back to uk, then en). */
export function localize(value, lang = "uk") {
  if (value == null || typeof value !== "object") return value ?? "";
  return value[lang] ?? value.uk ?? value.en ?? "";
}
