// Price / duration labels for price-list items and service cards.
import { fill, formatDuration, localize } from "./format.js";

const LOCALES = { uk: "uk-UA", en: "en-GB", fr: "fr-FR", ru: "ru-RU" };

/** 300 → "300 €" (locale grouping; cents only when needed). */
export function euros(value, lang = "uk") {
  const n = Number(value);
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${n.toLocaleString(LOCALES[lang] || "uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })} €`;
}

/**
 * Price label: fixed "300 €", from "від 120 €", add-on "+15 €".
 * `fromTemplate` is the translated "від {price}" pattern.
 */
export function priceLabel(item, lang, fromTemplate = "{price}") {
  if (item?.price == null) return null;
  const amount = euros(item.price, lang);
  if (item.priceKind === "from") return fill(fromTemplate, { price: amount });
  if (item.priceKind === "addon") return `+${amount}`;
  return amount;
}

/** Duration label: 150 → "2,5 год", [150, 180] → "2,5 год – 3 год", add-on → "+15 хв". */
export function durationLabel(item, lang) {
  const d = item?.duration;
  if (d == null) return null;
  if (Array.isArray(d)) return `${formatDuration(d[0], lang)} – ${formatDuration(d[1], lang)}`;
  const label = formatDuration(d, lang);
  return label && item.priceKind === "addon" ? `+${label}` : label;
}

/**
 * Props for <ServiceCard> from a price-list item or an older service object
 * ({ title, description, duration, priceFrom }).
 * @param {(key: string) => string} t translation function
 */
export function toCardProps(item, lang, t) {
  const price = item.price != null
    ? priceLabel(item, lang, t("priceList.from"))
    : item.priceFrom != null
      ? fill(t("priceList.from"), { price: euros(item.priceFrom, lang) })
      : null;
  return {
    title: localize(item.name ?? item.title, lang),
    description: item.correction ? t("priceList.correctionIncluded") : localize(item.description, lang) || undefined,
    duration: durationLabel(item, lang),
    price,
  };
}
