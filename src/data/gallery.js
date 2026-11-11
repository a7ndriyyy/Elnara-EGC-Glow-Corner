// Photo gallery (TZ step 10.1).
//
// TODO: уточнити в Ельнари — замінити на реальні фото робіт (до/після).
// The items below reuse the site's existing makeup illustrations as
// placeholders; they are not confirmed photos of Elnara's own work.
//
// Item shapes:
//   { id, category, src, alt }                         — single photo
//   { id, category, before, after, alt }               — before / after pair
// `category` is one of the keys in galleryCategories (filter chips are built
// only for categories that have photos). `alt` is { uk, en, fr, ru }.

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

export const galleryCategories = ["brows", "lips", "lashes", "makeup", "permanent"];

export const galleryItems = [
  {
    id: "makeup-bridal",
    category: "makeup",
    src: img("ImagesServices/makeup-brida.webp"),
    alt: { uk: "Весільний макіяж", en: "Bridal makeup", fr: "Maquillage de mariée", ru: "Свадебный макияж" },
  },
  {
    id: "makeup-evening",
    category: "makeup",
    src: img("ImagesServices/makeup-evening.webp"),
    alt: { uk: "Вечірній макіяж", en: "Evening makeup", fr: "Maquillage de soirée", ru: "Вечерний макияж" },
  },
  {
    id: "makeup-smokey",
    category: "makeup",
    src: img("ImagesServices/makeup-smokey.webp"),
    alt: { uk: "Смокі айс", en: "Smokey eyes", fr: "Smoky eyes", ru: "Смоки айс" },
  },
  {
    id: "makeup-day",
    category: "makeup",
    src: img("ImagesServices/makeup-day.webp"),
    alt: { uk: "Денний макіяж", en: "Day makeup", fr: "Maquillage de jour", ru: "Дневной макияж" },
  },
  {
    id: "makeup-editorial",
    category: "makeup",
    src: img("ImagesServices/makeup-editorial.webp"),
    alt: { uk: "Макіяж для фотосесії", en: "Photoshoot makeup", fr: "Maquillage photo", ru: "Макияж для фотосессии" },
  },
  {
    id: "makeup-natural",
    category: "makeup",
    src: img("ImagesServices/makeup-natural.webp"),
    alt: { uk: "Натуральний макіяж", en: "Natural makeup", fr: "Maquillage naturel", ru: "Натуральный макияж" },
  },
];
