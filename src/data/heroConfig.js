// Home hero (TZ step 2). Change numbers / photo here — no component edits needed.
// Texts for every language live in src/i18n/hero.js.

export const heroConfig = {
  // TODO: уточнити в Ельнари — шлях до фото Ельнари, напр. "/Images/elnara-hero.webp"
  // (покласти файл у public/Images). Поки null — показується заглушка.
  photo: null,

  counters: [
    { id: "years", value: 21, suffix: "" },
    { id: "clients", value: 20000, suffix: "+" },
    { id: "certificates", value: 50, suffix: "+" },
  ],

  // Count-up animation length in ms (TZ: ~2 s).
  countDuration: 2000,

  // Section the "Послуги" button scrolls to (id on the home page).
  // Will point to the "Головні напрямки" section after step 4.
  servicesSectionId: "treatments",
};
