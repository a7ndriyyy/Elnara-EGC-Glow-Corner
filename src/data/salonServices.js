// Beauty-salon services shown on /services and in the directions.
// Names, prices and durations come from Elnara's price list (./priceList.js);
// this file only adds photos and short descriptions.
import { priceItem, priceItems } from "./priceList";

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

/** Price-list item + extra card fields (image, description, popular…). */
const withExtras = (id, extras = {}) => ({ ...priceItem(id), slug: id, bookingId: id, ...extras });

// Photos/descriptions for makeup items that have them; the rest show the gold initial.
const makeupExtras = {
  "day-makeup": {
    image: img("ImagesServices/makeup-day.webp"),
    description: {
      uk: "Свіжий натуральний образ для роботи, зустрічей і щоденного життя.",
      en: "A fresh, natural look for work, meetings and everyday life.",
      fr: "Un look frais et naturel pour le travail, les rendez-vous et le quotidien.",
      ru: "Свежий натуральный образ для работы, встреч и повседневной жизни.",
    },
  },
  "evening-makeup": {
    image: img("ImagesServices/makeup-evening.webp"),
    popular: true,
    description: {
      uk: "Виразний стійкий макіяж для вечірок і свят.",
      en: "Expressive long-lasting makeup for parties and celebrations.",
      fr: "Un maquillage intense et tenace pour les soirées et les fêtes.",
      ru: "Выразительный стойкий макияж для вечеринок и праздников.",
    },
  },
  "photoshoot-makeup": {
    image: img("ImagesServices/makeup-editorial.webp"),
    description: {
      uk: "Макіяж, який гарно виглядає в кадрі та під студійним світлом.",
      en: "Makeup that looks great on camera and under studio lights.",
      fr: "Un maquillage qui rend parfaitement en photo et sous les projecteurs.",
      ru: "Макияж, который отлично смотрится в кадре и под студийным светом.",
    },
  },
  "graduation-makeup": { image: img("ImagesServices/makeup-natural.webp") },
  "bridal-makeup": {
    image: img("ImagesServices/makeup-brida.webp"),
    popular: true,
    description: {
      uk: "Ніжний образ, що тримається весь день.",
      en: "A soft look that lasts all day.",
      fr: "Un look tout en douceur qui tient toute la journée.",
      ru: "Нежный образ, который держится весь день.",
    },
  },
  "bridal-trial": { image: img("ImagesServices/makeup-smokey.webp") },
  "self-makeup-lesson": { image: img("ImagesServices/makeup-tools.webp") },
  "lifting-makeup": { image: img("ImagesServices/makeup-products.webp") },
};

/** Professional makeup — every item of the "makeup" price-list category. */
export const makeupTypes = priceItems("makeup").map((item) =>
  withExtras(item.id, { ...(makeupExtras[item.id] || {}), bookingId: item.bookable === false ? undefined : item.id }),
);

/** Brows & lashes (price-list categories "brows" + "lashes"). */
export const browAndLashServices = priceItems("brows", "lashes").map((item) =>
  withExtras(item.id, item.id === "brow-lift" ? { image: img("ImagesServices/lamination.webp") } : {}),
);

/** Beauty packages (price-list category "packages"). */
export const beautyPackages = priceItems("packages").map((item) => withExtras(item.id));

/** Laser tattoo removal (price-list category "tattoo-laser"). */
export const tattooRemovalServices = priceItems("tattoo-laser").map((item) => withExtras(item.id));

/** Permanent makeup removal with remover (price-list category "pmu-remover"). */
export const pmuRemoverServices = priceItems("pmu-remover").map((item) => withExtras(item.id));

/** Laser carbon peel (price-list category "carbon-peel"). */
export const carbonPeelServices = priceItems("carbon-peel").map((item) => withExtras(item.id));

/** Permanent makeup + touch-ups (price-list categories "permanent" + "retouch"). */
export const permanentServices = priceItems("permanent", "retouch").map((item) => withExtras(item.id));

// Massage procedures are NOT in Elnara's price list (12.11.2026): no price or
// duration is shown until she confirms them.
// TODO: уточнити в Ельнари — чи робить масажі, ціни та тривалість.
export const massageProcedures = [
  {
    slug: "classic-back",
    title: { uk: "Класичний масаж спини", en: "Classic back massage", fr: "Massage classique du dos", ru: "Классический массаж спины" },
    image: null,
    description: {
      uk: "Знімає напругу та втому м'язів спини.",
      en: "Relieves tension and fatigue in the back muscles.",
      fr: "Soulage les tensions et la fatigue du dos.",
      ru: "Снимает напряжение и усталость мышц спины.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "full-body",
    title: { uk: "Загальний масаж тіла", en: "Full-body massage", fr: "Massage corps entier", ru: "Общий массаж тела" },
    image: null,
    description: {
      uk: "Глибоке розслаблення та відновлення всього тіла.",
      en: "Deep relaxation and recovery for the whole body.",
      fr: "Détente profonde et récupération de tout le corps.",
      ru: "Глубокое расслабление и восстановление всего тела.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "anti-cellulite",
    title: { uk: "Антицелюлітний масаж", en: "Anti-cellulite massage", fr: "Massage anticellulite", ru: "Антицеллюлитный массаж" },
    image: null,
    description: {
      uk: "Покращує тонус шкіри та зменшує прояви целюліту.",
      en: "Improves skin tone and reduces the look of cellulite.",
      fr: "Améliore la tonicité de la peau et atténue la cellulite.",
      ru: "Улучшает тонус кожи и уменьшает проявления целлюлита.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "lymphatic",
    title: { uk: "Лімфодренажний масаж", en: "Lymphatic drainage massage", fr: "Massage lymphatique", ru: "Лимфодренажный массаж" },
    image: null,
    description: {
      uk: "Зменшує набряки та дарує відчуття легкості.",
      en: "Reduces swelling and leaves a feeling of lightness.",
      fr: "Réduit les gonflements et procure une sensation de légèreté.",
      ru: "Уменьшает отёки и дарит ощущение лёгкости.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "face-neck",
    title: { uk: "Масаж обличчя та шиї", en: "Face and neck massage", fr: "Massage visage et cou", ru: "Массаж лица и шеи" },
    image: null,
    description: {
      uk: "Розслабляє м'язи обличчя, покращує тонус і колір шкіри.",
      en: "Relaxes facial muscles and improves skin tone and radiance.",
      fr: "Détend les muscles du visage et ravive le teint.",
      ru: "Расслабляет мышцы лица, улучшает тонус и цвет кожи.",
    },
    duration: null,
    priceFrom: null,
  },
];
