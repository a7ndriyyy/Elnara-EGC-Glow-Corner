// Beauty-salon services (TZ step 6): makeup types and massage procedures.
// Shown on the salon services page (/services) and reused by the "Макіяж" and
// "Масаж" directions in src/data/directions.js — defined once, here.
//
// Shape matches a sub-direction: { slug, title, image, description,
// duration (minutes), priceFrom (€), bookingId?, popular? }. Text: { uk, en, fr, ru }.
// Prices/durations come from the existing price list; `null` = unknown (hidden).

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

// TODO: уточнити в Ельнари — підтвердити список типів макіяжу.
export const makeupTypes = [
  {
    slug: "day",
    title: { uk: "Денний", en: "Day makeup", fr: "Maquillage de jour", ru: "Дневной" },
    image: img("ImagesServices/makeup-day.webp"),
    description: {
      uk: "Свіжий натуральний образ для роботи, зустрічей і щоденного життя.",
      en: "A fresh, natural look for work, meetings and everyday life.",
      fr: "Un look frais et naturel pour le travail, les rendez-vous et le quotidien.",
      ru: "Свежий натуральный образ для работы, встреч и повседневной жизни.",
    },
    duration: 60,
    priceFrom: 120,
    bookingId: "day-makeup",
  },
  {
    slug: "evening",
    title: { uk: "Вечірній", en: "Evening makeup", fr: "Maquillage de soirée", ru: "Вечерний" },
    image: img("ImagesServices/makeup-evening.webp"),
    description: {
      uk: "Виразний стійкий макіяж для вечірок і свят.",
      en: "Expressive long-lasting makeup for parties and celebrations.",
      fr: "Un maquillage intense et tenace pour les soirées et les fêtes.",
      ru: "Выразительный стойкий макияж для вечеринок и праздников.",
    },
    duration: 90,
    priceFrom: 180,
    bookingId: "evening-makeup",
    popular: true,
  },
  {
    slug: "bridal",
    title: { uk: "Весільний", en: "Bridal makeup", fr: "Maquillage de mariée", ru: "Свадебный" },
    image: img("ImagesServices/makeup-brida.webp"),
    description: {
      uk: "Ніжний образ, що тримається весь день. Пробний макіяж включено.",
      en: "A soft look that lasts all day. Trial makeup included.",
      fr: "Un look tout en douceur qui tient toute la journée. Essai inclus.",
      ru: "Нежный образ, который держится весь день. Пробный макияж включён.",
    },
    duration: 120,
    priceFrom: 250,
    bookingId: "bridal-makeup",
    popular: true,
  },
  {
    slug: "smokey",
    title: { uk: "Smokey Eyes", en: "Smokey Eyes", fr: "Smokey Eyes", ru: "Smokey Eyes" },
    image: img("ImagesServices/makeup-smokey.webp"),
    description: {
      uk: "Класичний і сучасний смокі айс у будь-якій кольоровій гамі.",
      en: "Classic and modern smokey eyes in any color palette.",
      fr: "Un smoky eyes classique ou moderne dans toutes les palettes de couleurs.",
      ru: "Классический и современный smoky eyes в любой цветовой гамме.",
    },
    duration: 90,
    priceFrom: 160,
    bookingId: "smokey-eyes",
  },
  {
    slug: "photoshoot",
    title: { uk: "Для фотосесії", en: "Photoshoot makeup", fr: "Maquillage photo", ru: "Для фотосессии" },
    image: img("ImagesServices/makeup-editorial.webp"),
    // TODO: уточнити в Ельнари — тривалість і ціна
    description: {
      uk: "Макіяж, який гарно виглядає в кадрі та під студійним світлом.",
      en: "Makeup that looks great on camera and under studio lights.",
      fr: "Un maquillage qui rend parfaitement en photo et sous les projecteurs.",
      ru: "Макияж, который отлично смотрится в кадре и под студийным светом.",
    },
    duration: null,
    priceFrom: null,
  },
];

// TODO: уточнити в Ельнари — підтвердити список масажних процедур і фото.
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
    duration: 45,
    priceFrom: 70,
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
    duration: 90,
    priceFrom: 120,
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
    duration: 60,
    priceFrom: 90,
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
    duration: 60,
    priceFrom: 100,
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
    duration: 40,
    priceFrom: 60,
  },
];
