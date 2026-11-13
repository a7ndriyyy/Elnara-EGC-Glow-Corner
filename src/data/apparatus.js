// Device treatments without an entry in Elnara's price list yet (vacuum
// massage, pressotherapy). Carbon peel and the removal services moved to
// src/data/priceList.js when she sent their prices (13.11.2026).
// Same shape as a direction's sub-direction. Text fields are { uk, en, fr, ru }.
//
// TODO: уточнити в Ельнари — чи робить ці процедури; описи, тривалість, ціни, фото.

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



];

export const findApparatus = (slug) => apparatus.find((item) => item.slug === slug) ?? null;
