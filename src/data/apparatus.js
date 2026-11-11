// Apparatus (device) services — TZ step 5. Shown on the equipment page and
// reused by the related directions in src/data/directions.js.
// Same shape as a direction's sub-direction. Text fields are { uk, en, fr, ru }.
//
// TODO: уточнити в Ельнари — описи, тривалість (duration, хв), ціни (priceFrom, €), фото.
// Items 4 and 5 are deliberately separate services.

export const apparatus = [
  {
    slug: "vacuum-massage",
    // Replaces the former LPG device.
    title: { uk: "Вакуумний масаж", en: "Vacuum massage", fr: "Massage par dépression", ru: "Вакуумный массаж" },
    image: null,
    description: {
      uk: "Апаратний вакуумний масаж для моделювання силуету, тонусу шкіри та зменшення проявів целюліту.",
      en: "Device vacuum massage to contour the silhouette, tone the skin and reduce the look of cellulite.",
      fr: "Massage par dépression avec appareil pour remodeler la silhouette, tonifier la peau et atténuer la cellulite.",
      ru: "Аппаратный вакуумный массаж для моделирования силуэта, тонуса кожи и уменьшения проявлений целлюлита.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "pressotherapy",
    title: { uk: "Пресотерапія", en: "Pressotherapy", fr: "Pressothérapie", ru: "Прессотерапия" },
    image: null,
    description: {
      uk: "Апаратний лімфодренаж: легкість у ногах, менше набряків, кращий тонус.",
      en: "Device lymphatic drainage: lighter legs, less swelling and better tone.",
      fr: "Drainage lymphatique par appareil : jambes légères, moins de gonflements, meilleur tonus.",
      ru: "Аппаратный лимфодренаж: лёгкость в ногах, меньше отёков, лучше тонус.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "carbon-peel",
    title: { uk: "Карбоновий пілінг", en: "Carbon peel", fr: "Peeling au carbone", ru: "Карбоновый пилинг" },
    image: null,
    description: {
      uk: "Лазерний пілінг з карбоновою маскою: очищення пор, рівний тон і сяйво шкіри.",
      en: "Laser peel with a carbon mask: clearer pores, an even tone and glowing skin.",
      fr: "Peeling laser avec masque au carbone : pores nets, teint unifié et peau lumineuse.",
      ru: "Лазерный пилинг с карбоновой маской: чистые поры, ровный тон и сияние кожи.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "laser-makeup-removal",
    title: { uk: "Лазерне видалення макіяжу", en: "Laser makeup removal", fr: "Détatouage laser du maquillage", ru: "Лазерное удаление макияжа" },
    image: null,
    description: {
      uk: "Видалення пігменту лазерним апаратом — делікатно та поступово.",
      en: "Pigment removal with a laser device — gentle and gradual.",
      fr: "Retrait des pigments par laser — en douceur et progressivement.",
      ru: "Удаление пигмента лазерным аппаратом — деликатно и постепенно.",
    },
    duration: null,
    priceFrom: null,
  },
  {
    slug: "tattoo-pmu-removal",
    title: {
      uk: "Видалення татуювань і перманентного макіяжу",
      en: "Tattoo & permanent makeup removal",
      fr: "Retrait de tatouages et de maquillage permanent",
      ru: "Удаление татуировок и перманентного макияжа",
    },
    image: null,
    description: {
      uk: "Видалення татуювань і старого або невдалого перманенту.",
      en: "Removal of tattoos and old or unwanted permanent makeup.",
      fr: "Retrait des tatouages et d’un maquillage permanent ancien ou raté.",
      ru: "Удаление татуировок и старого или неудачного перманента.",
    },
    duration: null,
    priceFrom: null,
  },
];

export const findApparatus = (slug) => apparatus.find((item) => item.slug === slug) ?? null;
