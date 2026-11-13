// Main directions → sub-directions (TZ step 4). Single place for the home
// "Main directions" section and the /directions/:slug pages.
//
// Sub-directions come from Elnara's price list (./priceList.js, via
// ./salonServices.js) and from the device treatments (./apparatus.js), so
// prices and durations are defined once.
// `cardList` is the short summary shown on the back of the home-page card.
// Text fields are { uk, en, fr, ru }.

import { findApparatus } from "./apparatus";
import { features } from "./features";
import { priceItem } from "./priceList";
import { browAndLashServices, makeupTypes, massageProcedures, permanentServices, pmuRemoverServices, tattooRemovalServices } from "./salonServices";

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;
// On the Permanent page both removal lists sit together, so their items get a
// short prefix ("Ремувер: Консультація" vs "Лазер: Консультація").
const prefixed = (items, prefix) =>
  items.map((item) => ({
    ...item,
    name: Object.fromEntries(Object.entries(item.name).map(([lang, text]) => [lang, `${prefix[lang]}: ${text}`])),
  }));
const REMOVER = { uk: "Ремувер", en: "Remover", fr: "Remover", ru: "Ремувер" };
const LASER = { uk: "Лазер", en: "Laser", fr: "Laser", ru: "Лазер" };

const pick = (ids) => ids.map((id) => browAndLashServices.find((s) => s.slug === id) || { ...priceItem(id), slug: id, bookingId: id });

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
    cardList: {
      uk: ["Пудрові брови", "Губи", "Міжвійка та стрілки", "Мушка, веснянки", "Корекція перманенту", "Видалення пігменту"],
      en: ["Powder brows", "Lips", "Lash line & eyeliner", "Beauty mark, freckles", "Touch-ups", "Pigment removal"],
      fr: ["Sourcils poudrés", "Lèvres", "Ras de cils & eye-liner", "Grain de beauté, taches de rousseur", "Retouches", "Retrait du pigment"],
      ru: ["Пудровые брови", "Губы", "Межресничка и стрелки", "Мушка, веснушки", "Коррекция перманента", "Удаление пигмента"],
    },
    subdirections: [
      ...permanentServices,
      // Removal (Elnara's price list, 13.11.2026): remover first, then laser.
      ...prefixed(pmuRemoverServices, REMOVER),
      ...prefixed(tattooRemovalServices, LASER),
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
    cardList: {
      uk: ["Денний і вечірній", "Весільний і пробний", "Для фотосесії", "Для випускного", "Урок самомакіяжу"],
      en: ["Day & evening", "Bridal & trial", "Photoshoot", "Graduation", "Self-makeup lesson"],
      fr: ["Jour & soirée", "Mariée & essai", "Shooting photo", "Remise de diplôme", "Cours d’auto-maquillage"],
      ru: ["Дневной и вечерний", "Свадебный и пробный", "Для фотосессии", "На выпускной", "Урок макияжа для себя"],
    },
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
    subdirections: pick(["brow-shaping", "brow-architecture", "brow-tint", "brow-shaping-coloring"]),
  },
  {
    slug: "lamination",
    title: { uk: "Ламінування", en: "Lamination", fr: "Rehaussement", ru: "Ламинирование" },
    image: img("ImagesServices/lamination.webp"),
    intro: {
      uk: "Ламінування брів і вій — доглянутий вигляд без щоденного макіяжу.",
      en: "Brow and lash lamination — a groomed look without daily makeup.",
      fr: "Rehaussement des sourcils et des cils — un regard soigné sans maquillage quotidien.",
      ru: "Ламинирование бровей и ресниц — ухоженный вид без ежедневного макияжа.",
    },
    cardList: {
      uk: ["Ламінування брів", "Ламінування вій", "Ламінування + ботокс", "Комплекси брів і вій", "Фарбування вій"],
      en: ["Brow lift", "Lash lift", "Lash lift + Botox care", "Brow & lash packages", "Lash tinting"],
      fr: ["Brow Lift", "Lash Lift", "Rehaussement + soin Botox", "Forfaits sourcils & cils", "Teinture des cils"],
      ru: ["Ламинирование бровей", "Ламинирование ресниц", "Ламинирование + ботокс", "Комплексы бровей и ресниц", "Окрашивание ресниц"],
    },
    subdirections: pick(["brow-lift", "lash-lift", "lash-lift-tint-botox", "brow-lash-lift", "brow-lash-full", "lash-tint"]),
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
    // Massage procedures (./salonServices.js) + apparatus (./apparatus.js, step 5).
    subdirections: [
      ...massageProcedures,
      findApparatus("vacuum-massage"),
      findApparatus("pressotherapy"),
    ],
  },
  {
    slug: "training",
    title: { uk: "Навчання", en: "Training", fr: "Formation", ru: "Обучение" },
    image: img("ImagesStudy/Makeup-Course.webp"),
    intro: {
      uk: "Курси макіяжу та перманенту від Ельнари.",
      en: "Makeup and permanent makeup courses by Elnara.",
      fr: "Formations en maquillage et maquillage permanent par Elnara.",
      ru: "Курсы макияжа и перманента от Эльнары.",
    },
    // TZ step 8: locked ("in development") while features.trainingEnabled is false.
    locked: !features.trainingEnabled,
    to: "/about",
    subdirections: [],
  },
];

export const findDirection = (slug) => directions.find((d) => d.slug === slug) ?? null;

/** Booking link for a service: pre-selects it when it exists in the booking system. */
export const bookingLink = (sub) =>
  sub.bookingId ? `/booking?service=${encodeURIComponent(sub.bookingId)}` : "/booking";
