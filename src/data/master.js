// "Майстер" block on the home page — Elnara's own photos (sent 13.11.2026).
// `main` is the large photo; `more` are the small ones underneath.
// `alt` / `caption` are { uk, en, fr, ru }.

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

export const masterPhotos = {
  main: {
    src: img("Master/elnara-brushes.jpg"),
    alt: {
      uk: "Ельнара з пензлями для макіяжу",
      en: "Elnara with makeup brushes",
      fr: "Elnara avec ses pinceaux de maquillage",
      ru: "Эльнара с кистями для макияжа",
    },
  },
  more: [
    {
      src: img("Master/elnara-wulop.jpg"),
      alt: {
        uk: "Ельнара за роботою на WULOP France 2026",
        en: "Elnara at work at WULOP France 2026",
        fr: "Elnara au travail au WULOP France 2026",
        ru: "Эльнара за работой на WULOP France 2026",
      },
      caption: "WULOP France 2026",
    },
    {
      src: img("Master/elnara-pearls.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-hat.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-studio.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-smile.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-brushes-flying.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-brush.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
    {
      src: img("Master/elnara-brushes-eyes.jpg"),
      alt: { uk: "Ельнара", en: "Elnara", fr: "Elnara", ru: "Эльнара" },
    },
  ],
};
