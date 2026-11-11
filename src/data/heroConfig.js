// Home hero (TZ step 2). Change numbers / photo here — no component edits needed.
// Texts for every language live in src/i18n/hero.js.

export const heroConfig = {
  // Elnara's photo (file in public/Images). Set to null to show the monogram placeholder.
  // BASE_URL keeps the path working under the GitHub Pages sub-folder.
  photo: `${import.meta.env.BASE_URL}Images/elnara-hero.jpg`,
  // Which part of the photo stays visible inside the arch (CSS object-position).
  photoPosition: "50% 30%",

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
