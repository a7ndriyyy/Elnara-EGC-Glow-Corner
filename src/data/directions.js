// Main directions → sub-directions (TZ step 4). Single source of truth for the
// home "Main directions" section and the /directions/:slug pages.
//
// Shape: { slug, title, image, intro, locked?, subdirections: [
//   { slug, title, image, description, duration (minutes), priceFrom (€),
//     bookingId? (pre-selects the service on /booking), to? (custom link) } ] }
// Text fields are { uk, en, fr, ru }.
//
// Prices/durations copied from the existing price list (src/pages/PricesPage.jsx).
// `null` = unknown → hidden on the card. Everything marked TODO must be
// confirmed with Elnara (TODO: уточнити в Ельнари).

import { findApparatus } from "./apparatus";
import { makeupTypes, massageProcedures } from "./salonServices";

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

export const directions = [
  {
    slug: "permanent",
    title: { uk: "Перманент", en: "Permanent makeup", fr: "Maquillage permanent", ru: "Перманент" },
    image: null, // TODO: уточнити в Ельнари — фото
    intro: {
      uk: "Перманентний макіяж брів, губ і очей — природний результат, який тримається роками.",
      en: "Permanent makeup for brows, lips and eyes — a natural result that lasts for years.",
      fr: "Maquillage permanent des sourcils, des lèvres et des yeux — un résultat naturel qui dure des années.",
      ru: "Перманентный макияж бровей, губ и глаз — естественный результат, который держится годами.",
    },
    subdirections: [
      {
        slug: "brows",
        title: { uk: "Брови", en: "Brows", fr: "Sourcils", ru: "Брови" },
        image: null,
        // TODO: уточнити в Ельнари — опис, тривалість, ціна
        description: {
          uk: "Пудрові або волоскові брови з урахуванням форми обличчя.",
          en: "Powder or hair-stroke brows shaped to your face.",
          fr: "Sourcils poudrés ou poil à poil adaptés à votre visage.",
          ru: "Пудровые или волосковые брови с учётом формы лица.",
        },
        duration: null,
        priceFrom: null,
      },
      {
        slug: "lips",
        title: { uk: "Губи", en: "Lips", fr: "Lèvres", ru: "Губы" },
        image: null,
        // TODO: уточнити в Ельнари — опис, тривалість, ціна
        description: {
          uk: "Акварельні губи: колір, чіткий контур і ефект об'єму.",
          en: "Watercolour lips: colour, a defined contour and a fuller look.",
          fr: "Lèvres aquarelle : couleur, contour net et effet volume.",
          ru: "Акварельные губы: цвет, чёткий контур и эффект объёма.",
        },
        duration: null,
        priceFrom: null,
      },
      {
        slug: "eyeliner",
        title: { uk: "Міжвійка / стрілка", en: "Lash line / eyeliner", fr: "Ras de cils / eye-liner", ru: "Межресничка / стрелка" },
        image: null,
        // TODO: уточнити в Ельнари — опис, тривалість, ціна
        description: {
          uk: "Міжвійковий простір або стрілка для виразного погляду.",
          en: "Lash-line enhancement or eyeliner for a more defined look.",
          fr: "Ras de cils ou eye-liner pour un regard plus intense.",
          ru: "Межресничное пространство или стрелка для выразительного взгляда.",
        },
        duration: null,
        priceFrom: null,
      },
      // Removal services are apparatus services (step 5), kept separate on purpose.
      findApparatus("laser-makeup-removal"),
      findApparatus("tattoo-pmu-removal"),
    ],
  },
  {
    slug: "makeup",
    title: { uk: "Макіяж", en: "Makeup", fr: "Maquillage", ru: "Макияж" },
    image: img("ImagesServices/makeup-evening.webp"),
    intro: {
      uk: "Професійний макіяж для будь-якої події — від щоденного образу до весілля.",
      en: "Professional makeup for any occasion — from everyday looks to weddings.",
      fr: "Un maquillage professionnel pour chaque occasion — du quotidien au mariage.",
      ru: "Профессиональный макияж для любого события — от повседневного образа до свадьбы.",
    },
    // Makeup types are defined once in ./salonServices.js (step 6).
    subdirections: makeupTypes,
  },
  {
    slug: "brows",
    title: { uk: "Бровист", en: "Brow artistry", fr: "Sourcils", ru: "Бровист" },
    image: null, // TODO: уточнити в Ельнари — фото
    intro: {
      uk: "Корекція, фарбування та архітектура брів — ідеальна форма саме для вас.",
      en: "Shaping, tinting and brow architecture — the right shape for your face.",
      fr: "Épilation, teinture et architecture des sourcils — la forme idéale pour vous.",
      ru: "Коррекция, окрашивание и архитектура бровей — идеальная форма именно для вас.",
    },
    subdirections: [
      {
        slug: "correction",
        title: { uk: "Корекція", en: "Shaping", fr: "Épilation", ru: "Коррекция" },
        image: null,
        description: {
          uk: "Корекція форми брів пінцетом або воском.",
          en: "Brow shaping with tweezers or wax.",
          fr: "Mise en forme des sourcils à la pince ou à la cire.",
          ru: "Коррекция формы бровей пинцетом или воском.",
        },
        duration: 20,
        priceFrom: 25,
        bookingId: "brow-shaping-coloring",
      },
      {
        slug: "tinting",
        title: { uk: "Фарбування", en: "Tinting", fr: "Teinture", ru: "Окрашивание" },
        image: null,
        description: {
          uk: "Фарбування брів фарбою або хною.",
          en: "Brow tinting with dye or henna.",
          fr: "Teinture des sourcils à la coloration ou au henné.",
          ru: "Окрашивание бровей краской или хной.",
        },
        duration: 15,
        priceFrom: 20,
        bookingId: "brow-shaping-coloring",
      },
      {
        slug: "architecture",
        title: { uk: "Архітектура брів", en: "Brow architecture", fr: "Architecture des sourcils", ru: "Архитектура бровей" },
        image: null,
        // TODO: уточнити в Ельнари — опис, тривалість, ціна
        description: {
          uk: "Моделювання форми брів за пропорціями обличчя з корекцією та фарбуванням.",
          en: "Brow design based on your facial proportions, with shaping and tinting.",
          fr: "Création de la forme selon les proportions du visage, avec épilation et teinture.",
          ru: "Моделирование формы бровей по пропорциям лица с коррекцией и окрашиванием.",
        },
        duration: null,
        priceFrom: null,
      },
    ],
  },
  {
    slug: "lamination",
    title: { uk: "Ламінування", en: "Lamination", fr: "Rehaussement", ru: "Ламинирование" },
    image: null, // TODO: уточнити в Ельнари — фото
    intro: {
      uk: "Ламінування брів і вій — доглянутий вигляд без щоденного макіяжу.",
      en: "Brow and lash lamination — a groomed look without daily makeup.",
      fr: "Rehaussement des sourcils et des cils — un regard soigné sans maquillage quotidien.",
      ru: "Ламинирование бровей и ресниц — ухоженный вид без ежедневного макияжа.",
    },
    subdirections: [
      {
        slug: "brows",
        title: { uk: "Брови", en: "Brows", fr: "Sourcils", ru: "Брови" },
        image: null,
        description: {
          uk: "Ламінування фіксує форму брів і робить їх візуально густішими.",
          en: "Lamination sets the brow shape and makes brows look fuller.",
          fr: "Le rehaussement fixe la forme et donne des sourcils plus fournis.",
          ru: "Ламинирование фиксирует форму бровей и делает их визуально гуще.",
        },
        duration: 60,
        priceFrom: 60,
      },
      {
        slug: "lashes",
        title: { uk: "Вії", en: "Lashes", fr: "Cils", ru: "Ресницы" },
        image: null,
        description: {
          uk: "Підкручені, доглянуті вії на кілька тижнів.",
          en: "Curled, nourished lashes for several weeks.",
          fr: "Des cils recourbés et nourris pendant plusieurs semaines.",
          ru: "Подкрученные ухоженные ресницы на несколько недель.",
        },
        duration: 60,
        priceFrom: 55,
      },
    ],
  },
  {
    slug: "massage",
    title: { uk: "Масаж", en: "Massage", fr: "Massages", ru: "Массаж" },
    image: null, // TODO: уточнити в Ельнари — фото
    intro: {
      uk: "Ручні масажі та апаратні процедури для тіла — відновлення, легкість і тонус.",
      en: "Manual massages and body treatments with devices — recovery, lightness and tone.",
      fr: "Massages manuels et soins du corps par appareil — récupération, légèreté et tonus.",
      ru: "Ручные массажи и аппаратные процедуры для тела — восстановление, лёгкость и тонус.",
    },
    // Massage procedures (./salonServices.js, step 6) + apparatus (./apparatus.js, step 5).
    subdirections: [
      ...massageProcedures,
      // Apparatus (step 5), shared with the equipment page.
      findApparatus("vacuum-massage"),
      findApparatus("pressotherapy"),
    ],
  },
  {
    slug: "training",
    title: { uk: "Навчання", en: "Training", fr: "Formation", ru: "Обучение" },
    image: img("ImagesStudy/Makeup-Course.webp"),
    intro: { uk: "", en: "", fr: "", ru: "" },
    // Locked until training launches (step 8 adds the full "in development" page).
    locked: true,
    to: "/about",
    subdirections: [],
  },
];

export const findDirection = (slug) => directions.find((d) => d.slug === slug) ?? null;

/** Booking link for a sub-direction: pre-selects the service when it exists in the booking system. */
export const bookingLink = (sub) =>
  sub.bookingId ? `/booking?service=${encodeURIComponent(sub.bookingId)}` : "/booking";
