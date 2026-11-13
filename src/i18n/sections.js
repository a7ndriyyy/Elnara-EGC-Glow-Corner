// Texts for the homepage structure (TZ step 3): quick-link tiles, the
// "Майстер" block and the extra navigation items.
// TODO: уточнити в Ельнари — її розповідь про себе для блоку «Майстер».
// `nav` keys are merged into the existing `nav.*` namespace.
export const sectionMessages = {
  uk: {
    nav: { booking: "Запис" },
    tiles: {
      label: "Швидкі посилання",
      bookingTitle: "Запис",
      bookingText: "Оберіть послугу та зручний час",
      pricesTitle: "Ціни",
      pricesText: "Актуальний прайс на всі послуги",
      promotionsTitle: "Акції",
      promotionsText: "Знижки та новинки салону",
    },
    master: {
      eyebrow: "Майстер",
      title: "Ельнара",
      intro: "Майстер перманентного макіяжу, візажист і бровист. Приймає клієнтів у Парижі та Іль-де-Франс за попереднім записом.",
      skills: ["Перманентний макіяж", "Макіяж", "Брови та вії", "Видалення тату"],
      book: "Записатися",
      works: "Дивитися роботи",
    },
  },
  ru: {
    nav: { booking: "Запись" },
    tiles: {
      label: "Быстрые ссылки",
      bookingTitle: "Запись",
      bookingText: "Выберите услугу и удобное время",
      pricesTitle: "Цены",
      pricesText: "Актуальный прайс на все услуги",
      promotionsTitle: "Акции",
      promotionsText: "Скидки и новинки салона",
    },
    master: {
      eyebrow: "Мастер",
      title: "Эльнара",
      intro: "Мастер перманентного макияжа, визажист и бровист. Принимает клиентов в Париже и Иль-де-Франс по предварительной записи.",
      skills: ["Перманентный макияж", "Макияж", "Брови и ресницы", "Удаление тату"],
      book: "Записаться",
      works: "Смотреть работы",
    },
  },
  en: {
    nav: { booking: "Book" },
    tiles: {
      label: "Quick links",
      bookingTitle: "Booking",
      bookingText: "Choose a service and a time that suits you",
      pricesTitle: "Prices",
      pricesText: "Current prices for every service",
      promotionsTitle: "Offers",
      promotionsText: "Discounts and what’s new at the salon",
    },
    master: {
      eyebrow: "The artist",
      title: "Elnara",
      intro: "Permanent makeup artist, makeup artist and brow specialist. Seeing clients in Paris and Île-de-France by appointment.",
      skills: ["Permanent makeup", "Makeup", "Brows & lashes", "Tattoo removal"],
      book: "Book now",
      works: "See her work",
    },
  },
  fr: {
    nav: { booking: "Réserver" },
    tiles: {
      label: "Accès rapide",
      bookingTitle: "Réservation",
      bookingText: "Choisissez une prestation et un horaire",
      pricesTitle: "Tarifs",
      pricesText: "Les tarifs à jour de toutes les prestations",
      promotionsTitle: "Offres",
      promotionsText: "Remises et nouveautés de l’institut",
    },
    master: {
      eyebrow: "L’artiste",
      title: "Elnara",
      intro: "Experte en maquillage permanent, maquilleuse et spécialiste des sourcils. Reçoit à Paris et en Île-de-France sur rendez-vous.",
      skills: ["Maquillage permanent", "Maquillage", "Sourcils & cils", "Détatouage"],
      book: "Réserver",
      works: "Voir ses réalisations",
    },
  },
};
