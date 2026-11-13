// Elnara's official price list (sent 12.11.2026) — the single source of truth
// for prices and durations on the whole site: the Prices page, the salon
// services page and the direction pages all read from here.
//
// Item fields:
//   id          stable id; also the booking-system service id (see docs/sql/)
//   name        { uk, fr, en, ru } — uk & fr from Elnara, en & ru translated
//   price       euros
//   priceKind   "fixed" | "from" ("від …") | "addon" ("+… €", added to a service)
//   duration    minutes, or [min, max] for a range; null = not given
//   correction  true when the touch-up is included in the price
//   bookable    false for add-ons that cannot be booked on their own

export const PRICE_LIST_LOCATION = "Paris • Île-de-France";

export const priceCategories = [
  {
    id: "permanent",
    title: { uk: "Перманентний макіяж", fr: "Maquillage permanent", en: "Permanent makeup", ru: "Перманентный макияж" },
    items: [
      { id: "powder-brows", price: 300, duration: 150, correction: true,
        name: { uk: "Пудрові брови", fr: "Sourcils poudrés (Powder Brows)", en: "Powder brows", ru: "Пудровые брови" } },
      { id: "lip-blush", price: 300, duration: 150, correction: true,
        name: { uk: "Акварельні губи", fr: "Lèvres aquarelle (Lip Blush)", en: "Watercolour lips (lip blush)", ru: "Акварельные губы" } },
      { id: "lipstick-lips", price: 350, duration: 180, correction: true,
        name: { uk: "Помадний ефект губ", fr: "Effet rouge à lèvres", en: "Lipstick-effect lips", ru: "Помадный эффект губ" } },
      { id: "dark-lips-neutralization", price: 260, duration: 150,
        name: { uk: "Нейтралізація темних губ", fr: "Neutralisation des lèvres foncées", en: "Dark lip neutralisation", ru: "Нейтрализация тёмных губ" } },
      { id: "lash-line-upper", price: 160, duration: 90, correction: true,
        name: { uk: "Міжвійка верхня", fr: "Ras de cils supérieur", en: "Upper lash line", ru: "Межресничка верхняя" } },
      { id: "lash-line-lower", price: 110, duration: 60,
        name: { uk: "Міжвійка нижня", fr: "Ras de cils inférieur", en: "Lower lash line", ru: "Межресничка нижняя" } },
      { id: "lash-line-both", price: 220, duration: 120,
        name: { uk: "Міжвійка верхня + нижня", fr: "Ras de cils supérieur et inférieur", en: "Upper + lower lash line", ru: "Межресничка верхняя + нижняя" } },
      { id: "eyeliner-classic", price: 220, duration: 120, correction: true,
        name: { uk: "Класична стрілка", fr: "Eye-liner classique", en: "Classic eyeliner", ru: "Классическая стрелка" } },
      { id: "eyeliner-ombre", price: 260, duration: 150, correction: true,
        name: { uk: "Стрілка з розтушовкою", fr: "Eye-liner poudré (ombré)", en: "Shaded (ombré) eyeliner", ru: "Стрелка с растушёвкой" } },
      { id: "beauty-mark", price: 50, duration: 30,
        name: { uk: "Перманентна мушка", fr: "Grain de beauté permanent", en: "Permanent beauty mark", ru: "Перманентная мушка" } },
      { id: "freckles", price: 120, priceKind: "from", duration: 60,
        name: { uk: "Веснянки", fr: "Taches de rousseur (éphélides)", en: "Freckles", ru: "Веснушки" } },
    ],
  },
  {
    id: "retouch",
    title: { uk: "Корекція перманентного макіяжу", fr: "Retouches", en: "Permanent makeup touch-ups", ru: "Коррекция перманентного макияжа" },
    items: [
      { id: "retouch-6-12", price: 150, duration: 90,
        name: { uk: "Оновлення 6–12 місяців", fr: "Retouche entre 6 et 12 mois", en: "Refresh after 6–12 months", ru: "Обновление через 6–12 месяцев" } },
      { id: "retouch-12-18", price: 180, duration: 120,
        name: { uk: "Оновлення 12–18 місяців", fr: "Retouche entre 12 et 18 mois", en: "Refresh after 12–18 months", ru: "Обновление через 12–18 месяцев" } },
      { id: "pmu-cover", price: 280, priceKind: "from", duration: [150, 180],
        name: { uk: "Перекриття старого перманенту", fr: "Correction ou recouvrement d’un ancien maquillage permanent", en: "Correcting or covering old permanent makeup", ru: "Перекрытие старого перманента" } },
    ],
  },
  {
    id: "brows",
    title: { uk: "Брови", fr: "Beauté des sourcils", en: "Brows", ru: "Брови" },
    items: [
      { id: "brow-shaping", price: 20, duration: 20,
        name: { uk: "Корекція форми брів", fr: "Épilation et mise en forme des sourcils", en: "Brow shaping", ru: "Коррекция формы бровей" } },
      { id: "brow-architecture", price: 30, duration: 30,
        name: { uk: "Архітектура брів (побудова нової форми)", fr: "Architecture des sourcils", en: "Brow architecture (designing a new shape)", ru: "Архитектура бровей (построение новой формы)" } },
      { id: "brow-tint", price: 20, duration: 20,
        name: { uk: "Фарбування брів фарбою", fr: "Teinture des sourcils", en: "Brow tinting", ru: "Окрашивание бровей краской" } },
      // Existing booking id kept so old links still pre-select it.
      { id: "brow-shaping-coloring", price: 35, duration: 40,
        name: { uk: "Корекція + фарбування фарбою", fr: "Épilation + teinture", en: "Shaping + tinting", ru: "Коррекция + окрашивание краской" } },
      { id: "brow-lift", price: 50, duration: 45,
        name: { uk: "Ламінування брів", fr: "Brow Lift", en: "Brow lamination (brow lift)", ru: "Ламинирование бровей" } },
    ],
  },
  {
    id: "lashes",
    title: { uk: "Вії", fr: "Beauté des cils", en: "Lashes", ru: "Ресницы" },
    items: [
      { id: "lash-tint", price: 20, duration: 20,
        name: { uk: "Фарбування вій", fr: "Teinture des cils", en: "Lash tinting", ru: "Окрашивание ресниц" } },
      { id: "lash-lift", price: 40, duration: 60,
        name: { uk: "Ламінування вій", fr: "Rehaussement de cils (Lash Lift)", en: "Lash lift", ru: "Ламинирование ресниц" } },
      { id: "lash-lift-tint-botox", price: 45, duration: 75,
        name: { uk: "Ламінування + фарбування + ботокс", fr: "Rehaussement + teinture + soin Botox", en: "Lash lift + tint + Botox care", ru: "Ламинирование + окрашивание + ботокс" } },
      { id: "brow-lash-lift", price: 60, duration: 90,
        name: { uk: "Комплекс: ламінування брів і вій", fr: "Brow Lift + Lash Lift", en: "Brow lift + lash lift", ru: "Комплекс: ламинирование бровей и ресниц" } },
      { id: "brow-lash-full", price: 75, duration: 105,
        name: { uk: "Повний комплекс брів і вій з фарбуванням", fr: "Forfait complet sourcils et cils avec coloration", en: "Full brow & lash package with tinting", ru: "Полный комплекс бровей и ресниц с окрашиванием" } },
    ],
  },
  {
    id: "makeup",
    title: { uk: "Професійний макіяж", fr: "Maquillage professionnel", en: "Professional makeup", ru: "Профессиональный макияж" },
    items: [
      { id: "day-makeup", price: 100, duration: 60,
        name: { uk: "Денний макіяж", fr: "Maquillage de jour", en: "Day makeup", ru: "Дневной макияж" } },
      { id: "evening-makeup", price: 120, duration: 90,
        name: { uk: "Вечірній макіяж", fr: "Maquillage de soirée", en: "Evening makeup", ru: "Вечерний макияж" } },
      // In Elnara's first list only (no duration given in the detailed list).
      { id: "lifting-makeup", price: 75, duration: null,
        name: { uk: "Ліфтинг-макіяж", fr: "Maquillage effet lifting", en: "Lifting-effect makeup", ru: "Лифтинг-макияж" } },
      { id: "photoshoot-makeup", price: 120, duration: 90,
        name: { uk: "Макіяж для фотосесії", fr: "Maquillage pour shooting photo", en: "Photoshoot makeup", ru: "Макияж для фотосессии" } },
      { id: "graduation-makeup", price: 100, duration: 75,
        name: { uk: "Макіяж для випускного", fr: "Maquillage de remise de diplôme", en: "Graduation makeup", ru: "Макияж на выпускной" } },
      { id: "bridal-makeup", price: 200, duration: 120,
        name: { uk: "Весільний макіяж", fr: "Maquillage de mariée", en: "Bridal makeup", ru: "Свадебный макияж" } },
      { id: "bridal-trial", price: 120, duration: 120,
        name: { uk: "Пробний весільний макіяж", fr: "Essai maquillage de mariée", en: "Bridal makeup trial", ru: "Пробный свадебный макияж" } },
      { id: "lash-clusters", price: 15, priceKind: "addon", duration: 15, bookable: false,
        name: { uk: "Накладні пучки вій", fr: "Pose de touffes de cils", en: "Cluster lashes", ru: "Накладные пучки ресниц" } },
      { id: "self-makeup-lesson", price: 120, duration: 120,
        name: { uk: "Індивідуальний урок самомакіяжу", fr: "Cours d’auto-maquillage individuel", en: "Private self-makeup lesson", ru: "Индивидуальный урок макияжа для себя" } },
    ],
  },
  {
    id: "packages",
    title: { uk: "Комплексні пропозиції", fr: "Forfaits beauté", en: "Beauty packages", ru: "Комплексные предложения" },
    items: [
      { id: "pack-brow-beauty", price: 35, duration: 40,
        name: { uk: "Brow Beauty — форма + фарбування", fr: "Brow Beauty — mise en forme + teinture des sourcils", en: "Brow Beauty — shaping + tinting", ru: "Brow Beauty — форма + окрашивание" } },
      { id: "pack-brow-premium", price: 50, duration: 75,
        name: { uk: "Brow Premium — ламінування + форма + фарбування", fr: "Brow Premium — Brow Lift + épilation + teinture", en: "Brow Premium — lamination + shaping + tinting", ru: "Brow Premium — ламинирование + форма + окрашивание" } },
      { id: "pack-full-beauty", price: 75, duration: 105,
        name: { uk: "Full Beauty — ламінування брів і вій + форма + фарбування", fr: "Full Beauty — Brow Lift + Lash Lift + épilation + coloration", en: "Full Beauty — brow & lash lift + shaping + tinting", ru: "Full Beauty — ламинирование бровей и ресниц + форма + окрашивание" } },
      { id: "pack-perfect-look", price: 120, duration: 120,
        name: { uk: "Perfect Look — оформлення брів + вечірній макіяж", fr: "Perfect Look — mise en forme des sourcils + maquillage de soirée", en: "Perfect Look — brow shaping + evening makeup", ru: "Perfect Look — оформление бровей + вечерний макияж" } },
    ],
  },
];

const byId = new Map(priceCategories.flatMap((c) => c.items.map((item) => [item.id, { ...item, category: c.id }])));

/** A price-list item by id (with its `category`), or null. */
export const priceItem = (id) => byId.get(id) ?? null;

/** All items of the given category ids, in price-list order. */
export const priceItems = (...categoryIds) =>
  priceCategories.filter((c) => categoryIds.includes(c.id)).flatMap((c) => c.items.map((item) => byId.get(item.id)));
