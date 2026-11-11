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
      {
        slug: "removal",
        title: { uk: "Видалення перманенту", en: "Permanent makeup removal", fr: "Détatouage du maquillage permanent", ru: "Удаление перманента" },
        image: null,
        // Apparatus service — links to the equipment page (step 5).
        description: {
          uk: "Апаратне видалення старого або невдалого перманенту.",
          en: "Device-based removal of old or unwanted permanent makeup.",
          fr: "Retrait par appareil d’un maquillage permanent ancien ou raté.",
          ru: "Аппаратное удаление старого или неудачного перманента.",
        },
        duration: null,
        priceFrom: null,
        to: "/equipment",
      },
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
    // TODO: підтвердити список типів макіяжу (крок 6)
    subdirections: [
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
    ],
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
    // Massage procedures (step 6) + apparatus (step 5). TODO: підтвердити список
    subdirections: [
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
        title: { uk: "Лімфодренажний масаж", en: "Lymphatic drainage massage", fr: "Drainage lymphatique", ru: "Лимфодренажный массаж" },
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
        slug: "vacuum",
        title: { uk: "Вакуумний масаж", en: "Vacuum massage", fr: "Massage par dépression", ru: "Вакуумный массаж" },
        image: null,
        // Apparatus (step 5). TODO: уточнити в Ельнари — тривалість і ціна
        description: {
          uk: "Апаратний вакуумний масаж для моделювання силуету.",
          en: "Device vacuum massage to help contour the silhouette.",
          fr: "Massage par dépression avec appareil pour remodeler la silhouette.",
          ru: "Аппаратный вакуумный массаж для моделирования силуэта.",
        },
        duration: null,
        priceFrom: null,
        to: "/equipment",
      },
      {
        slug: "pressotherapy",
        title: { uk: "Пресотерапія", en: "Pressotherapy", fr: "Pressothérapie", ru: "Прессотерапия" },
        image: null,
        // Apparatus (step 5). TODO: уточнити в Ельнари — тривалість і ціна
        description: {
          uk: "Апаратний лімфодренаж для легкості в ногах і тонусу.",
          en: "Device lymphatic drainage for lighter legs and better tone.",
          fr: "Drainage lymphatique par appareil pour des jambes légères.",
          ru: "Аппаратный лимфодренаж для лёгкости в ногах и тонуса.",
        },
        duration: null,
        priceFrom: null,
        to: "/equipment",
      },
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
