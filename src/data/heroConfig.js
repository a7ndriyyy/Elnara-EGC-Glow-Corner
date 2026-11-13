// Home hero (TZ step 2). Change numbers / photo here — no component edits needed.
// Texts for every language live in src/i18n/hero.js.

export const heroConfig = {
  // Elnara's photo (file in public/Images). Set to null to show the monogram placeholder.
  // BASE_URL keeps the path working under the GitHub Pages sub-folder.
  // Cut-out (transparent background) made from Master/elnara-brushes-flying.jpg.
  photo: `${import.meta.env.BASE_URL}Images/elnara-cutout.webp`,

  counters: [
    { id: "years", value: 21, suffix: "" },
    { id: "clients", value: 20000, suffix: "+" },
    { id: "certificates", value: 50, suffix: "+" },
  ],

  // Count-up animation length in ms (TZ: ~2 s).
  countDuration: 2000,

  // Section the "Послуги" button scrolls to (id on the home page).
  servicesSectionId: "directions",
};
