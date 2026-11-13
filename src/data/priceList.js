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
  // ---- Sent 13.11.2026 (categories 7–9). `note` is shown under the category. ----
  {
    id: "tattoo-laser",
    title: { uk: "Лазерне видалення татуювань", fr: "Détatouage au laser", en: "Laser tattoo removal", ru: "Лазерное удаление татуировок" },
    note: {
      uk: "Ціни вказані за один сеанс. Остаточна вартість залежить від площі, кольору, щільності та глибини пігменту. Для видалення татуювання може знадобитися декілька сеансів. Повне видалення не гарантується.",
      fr: "Prix par séance. Le tarif final dépend de la surface, de la couleur, de la densité et de la profondeur du pigment. Plusieurs séances peuvent être nécessaires. Le retrait complet n’est pas garanti.",
      en: "Prices are per session. The final cost depends on the size, colour, density and depth of the pigment. Several sessions may be needed. Complete removal is not guaranteed.",
      ru: "Цены указаны за один сеанс. Итоговая стоимость зависит от площади, цвета, плотности и глубины пигмента. Для удаления татуировки может понадобиться несколько сеансов. Полное удаление не гарантируется.",
    },
    items: [
      { id: "tattoo-consultation", price: 20, duration: 20,
        name: { uk: "Консультація", fr: "Consultation", en: "Consultation", ru: "Консультация" } },
      { id: "tattoo-xs", price: 100, duration: 20,
        name: { uk: "Дуже маленьке тату (до 5 см²)", fr: "Très petit tatouage (jusqu’à 5 cm²)", en: "Very small tattoo (up to 5 cm²)", ru: "Очень маленькая татуировка (до 5 см²)" } },
      { id: "tattoo-s", price: 120, priceKind: "from", duration: 30,
        name: { uk: "Маленьке тату (5–15 см²)", fr: "Petit tatouage (5–15 cm²)", en: "Small tattoo (5–15 cm²)", ru: "Маленькая татуировка (5–15 см²)" } },
      { id: "tattoo-m", price: 180, priceKind: "from", duration: [30, 40],
        name: { uk: "Середнє тату (16–50 см²)", fr: "Tatouage moyen (16–50 cm²)", en: "Medium tattoo (16–50 cm²)", ru: "Средняя татуировка (16–50 см²)" } },
      { id: "tattoo-l", price: 230, priceKind: "from", duration: 45,
        name: { uk: "Велике тату (51–100 см²)", fr: "Grand tatouage (51–100 cm²)", en: "Large tattoo (51–100 cm²)", ru: "Большая татуировка (51–100 см²)" } },
    ],
  },
  {
    id: "pmu-remover",
    title: { uk: "Видалення перманентного макіяжу ремувером", fr: "Détatouage du maquillage permanent au remover", en: "Permanent makeup removal with remover", ru: "Удаление перманентного макияжа ремувером" },
    items: [
      { id: "remover-consultation", price: 20, duration: 20,
        name: { uk: "Консультація", fr: "Consultation préalable", en: "Consultation", ru: "Консультация" } },
      { id: "remover-first", price: 100, duration: [30, 60],
        name: { uk: "Перша процедура", fr: "Première séance", en: "First session", ru: "Первая процедура" } },
      { id: "remover-next", price: 80, duration: [30, 60],
        name: { uk: "Повторна процедура", fr: "Séance suivante", en: "Follow-up session", ru: "Повторная процедура" } },
    ],
  },
  {
    id: "carbon-peel",
    title: { uk: "Карбоновий пілінг", fr: "Peeling au carbone (Hollywood Peel)", en: "Carbon peel (Hollywood Peel)", ru: "Карбоновый пилинг" },
    note: {
      uk: "Лазерний карбоновий пілінг (Hollywood Peel) — процедура з використанням карбонової маски та лазера, спрямована на покращення зовнішнього вигляду й текстури шкіри. Кількість процедур визначається індивідуально після консультації.",
      fr: "Le peeling au carbone au laser (Hollywood Peel) associe un masque au carbone et un laser pour améliorer l’aspect et la texture de la peau. Le nombre de séances est défini individuellement après consultation.",
      en: "Laser carbon peel (Hollywood Peel) uses a carbon mask and a laser to improve the look and texture of the skin. The number of sessions is set individually after a consultation.",
      ru: "Лазерный карбоновый пилинг (Hollywood Peel) — процедура с карбоновой маской и лазером для улучшения внешнего вида и текстуры кожи. Количество процедур определяется индивидуально после консультации.",
    },
    items: [
      { id: "carbon-face", price: 120, duration: 45,
        name: { uk: "Карбоновий пілінг обличчя", fr: "Peeling au carbone du visage", en: "Carbon peel — face", ru: "Карбоновый пилинг лица" } },
      { id: "carbon-face-neck", price: 150, duration: 60,
        name: { uk: "Карбоновий пілінг обличчя та шиї", fr: "Peeling au carbone visage et cou", en: "Carbon peel — face & neck", ru: "Карбоновый пилинг лица и шеи" } },
      { id: "carbon-face-neck-decollete", price: 180, duration: 75,
        name: { uk: "Карбоновий пілінг обличчя, шиї та декольте", fr: "Peeling au carbone visage, cou et décolleté", en: "Carbon peel — face, neck & décolleté", ru: "Карбоновый пилинг лица, шеи и декольте" } },
    ],
  },
];

const byId = new Map(priceCategories.flatMap((c) => c.items.map((item) => [item.id, { ...item, category: c.id }])));

/** A price-list item by id (with its `category`), or null. */
export const priceItem = (id) => byId.get(id) ?? null;

/** All items of the given category ids, in price-list order. */
export const priceItems = (...categoryIds) =>
  priceCategories.filter((c) => categoryIds.includes(c.id)).flatMap((c) => c.items.map((item) => byId.get(item.id)));
