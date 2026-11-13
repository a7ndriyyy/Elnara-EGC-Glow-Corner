// Gallery of Elnara's own work (photos & videos sent 13.11.2026).
//
// Item shapes:
//   { id, category, src, alt }               — photo
//   { id, category, before, after, alt }     — before / after photo pair
//   { id, category, video, alt }             — short video (mp4 in public/Videos)
// `category` is one of galleryCategories (filter chips appear only for
// categories that have items). `alt` is { uk, en, fr, ru }.

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;
const video = (path) => `${import.meta.env.BASE_URL}Videos/${path}`;

export const galleryCategories = ["brows", "lips", "eyeliner", "lashes", "makeup", "permanent"];

export const galleryItems = [
  {
    id: "brows-powder-1",
    category: "brows",
    src: img("Works/brows-powder-1.webp"),
    alt: { uk: "Пудрові брови", en: "Powder brows", fr: "Sourcils poudrés", ru: "Пудровые брови" },
  },
  {
    id: "brows-before-after-video",
    category: "brows",
    video: video("work-1.mp4"),
    alt: { uk: "Пудрові брови: до і після", en: "Powder brows: before and after", fr: "Sourcils poudrés : avant / après", ru: "Пудровые брови: до и после" },
  },
  {
    id: "lips-watercolor",
    category: "lips",
    src: img("Works/lips-watercolor.webp"),
    alt: { uk: "Акварельні губи", en: "Watercolour lips", fr: "Lèvres aquarelle", ru: "Акварельные губы" },
  },
  {
    id: "eyeliner-shaded",
    category: "eyeliner",
    src: img("Works/eyeliner-shaded.webp"),
    alt: { uk: "Міжвійка з розтушовкою", en: "Shaded lash line", fr: "Ras de cils estompé", ru: "Межресничка с растушёвкой" },
  },
  {
    id: "brows-powder-2",
    category: "brows",
    src: img("Works/brows-powder-2.webp"),
    alt: { uk: "Пудрові брови", en: "Powder brows", fr: "Sourcils poudrés", ru: "Пудровые брови" },
  },
  {
    id: "lips-lipstick-brows",
    category: "lips",
    src: img("Works/lips-lipstick-brows.webp"),
    alt: { uk: "Помадний ефект губ і брови", en: "Lipstick-effect lips and brows", fr: "Effet rouge à lèvres et sourcils", ru: "Помадный эффект губ и брови" },
  },
  {
    id: "lash-lift-before-after-video",
    category: "lashes",
    video: video("work-2.mp4"),
    alt: { uk: "Ламінування вій: до і після", en: "Lash lift: before and after", fr: "Rehaussement de cils : avant / après", ru: "Ламинирование ресниц: до и после" },
  },
  {
    id: "makeup-bridal",
    category: "makeup",
    src: img("Works/makeup-bridal.webp"),
    alt: { uk: "Весільний макіяж", en: "Bridal makeup", fr: "Maquillage de mariée", ru: "Свадебный макияж" },
  },
  {
    id: "brows-portrait",
    category: "brows",
    src: img("Works/brows-portrait.webp"),
    alt: { uk: "Брови", en: "Brows", fr: "Sourcils", ru: "Брови" },
  },
];
