import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "elnara-language";
const SUPPORTED_LANGUAGES = ["en", "fr", "uk", "ru"];

const messages = {
  en: {
    nav: {
      salonServices: "Salon Services",
      study: "Study with us",
      massages: "Massages and Procedures",
      prices: "Prices",
      followUs: "Follow us",
      menu: "Toggle menu",
      closeMenu: "Close menu",
      professional: "Professional area",
      language: "Language",
    },
    booking: {"eyebrow":"ELNARA BEAUTY","title":"Book an appointment","intro":"Choose a service and your preferred date, then leave your contact details. We will confirm availability before your appointment.","request":"Appointment requests","notice":"Available times are checked against the booking calendar. Your appointment is not confirmed until you receive confirmation.","loadingServices":"Loading services...","service":"Service","chooseService":"Choose a service","price":"Price","duration":"Duration","date":"Preferred date","previousMonth":"Previous month","nextMonth":"Next month","chooseDate":"Choose a date","selected":"Selected","unavailable":"Unavailable","selectedDate":"Selected date:","dateHint":"Choose a date to check actual available times. Selecting a date does not reserve an appointment.","times":"Available times","chooseServiceDate":"Choose a service and date to see available times.","loadingTimes":"Loading available times...","noTimes":"No available times for this date. Please choose another date.","name":"Full name","phone":"Phone","email":"Email","submit":"Request appointment","submitting":"Sending request...","required":"Please complete all required fields.","security":"Security verification is not configured. Please try again later.","captcha":"Please complete the security check.","conflict":"This time slot was just booked by someone else. Available times have been refreshed. Please choose another time.","refreshError":"Unable to refresh available times. Please try again.","failed":"We could not submit your request. Please try again.","success":"Your appointment request has been received. Please wait for confirmation.","connection":"A connection error occurred. Please try again.","generic":"We could not create your appointment. Please check your details and try again.","notConfirmed":"Your appointment is not confirmed until you receive confirmation.","slotHint":"Selecting a time does not reserve an appointment.","contact":"Contact details","servicesError":"Unable to load services. Please try again later.","categoryMakeup":"Makeup","categoryFace":"Facial care","categoryBody":"Body and massage","categoryBrows":"Brows and lashes","weekdays":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},
  },
  fr: {
    nav: {
      salonServices: "Prestations du salon",
      study: "Se former avec nous",
      massages: "Massages et soins",
      prices: "Tarifs",
      followUs: "Suivez-nous",
      menu: "Ouvrir ou fermer le menu",
      closeMenu: "Fermer le menu",
      professional: "Espace professionnel",
      language: "Langue",
    },
    booking: {"eyebrow":"ELNARA BEAUTÉ","title":"Prendre rendez-vous","intro":"Choisissez une prestation et une date, puis indiquez vos coordonnées. Nous confirmerons la disponibilité avant le rendez-vous.","request":"Demandes de rendez-vous","notice":"Les horaires sont vérifiés dans le calendrier. Votre rendez-vous n’est confirmé qu’après réception d’une confirmation.","loadingServices":"Chargement des prestations...","service":"Prestation","chooseService":"Choisir une prestation","price":"Prix","duration":"Durée","date":"Date souhaitée","previousMonth":"Mois précédent","nextMonth":"Mois suivant","chooseDate":"Choisir une date","selected":"Sélectionné","unavailable":"Indisponible","selectedDate":"Date sélectionnée :","dateHint":"Choisissez une date pour consulter les horaires disponibles. Cela ne réserve pas de rendez-vous.","times":"Horaires disponibles","chooseServiceDate":"Choisissez une prestation et une date pour voir les horaires disponibles.","loadingTimes":"Chargement des horaires...","noTimes":"Aucun horaire disponible ce jour-là. Veuillez choisir une autre date.","name":"Nom complet","phone":"Téléphone","email":"E-mail","submit":"Demander un rendez-vous","submitting":"Envoi de la demande...","required":"Veuillez remplir tous les champs obligatoires.","security":"La vérification de sécurité n’est pas configurée. Réessayez plus tard.","captcha":"Veuillez effectuer la vérification de sécurité.","conflict":"Ce créneau vient d’être réservé par une autre personne. Les disponibilités ont été actualisées. Choisissez un autre horaire.","refreshError":"Impossible d’actualiser les horaires. Veuillez réessayer.","failed":"Impossible d’envoyer votre demande. Veuillez réessayer.","success":"Votre demande a bien été reçue. Merci d’attendre la confirmation.","connection":"Erreur de connexion. Veuillez réessayer.","generic":"Impossible de créer le rendez-vous. Vérifiez vos informations et réessayez.","notConfirmed":"Votre rendez-vous n’est confirmé qu’après réception d’une confirmation.","slotHint":"Choisir un horaire ne réserve pas de rendez-vous.","contact":"Coordonnées","servicesError":"Impossible de charger les prestations. Veuillez réessayer plus tard.","categoryMakeup":"Maquillage","categoryFace":"Soins du visage","categoryBody":"Corps et massage","categoryBrows":"Sourcils et cils","weekdays":["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]},
  },
  uk: {
    nav: {
      salonServices: "Послуги салону",
      study: "Навчання з нами",
      massages: "Масажі та процедури",
      prices: "Ціни",
      followUs: "Стежте за нами",
      menu: "Відкрити або закрити меню",
      closeMenu: "Закрити меню",
      professional: "Професійний кабінет",
      language: "Мова",
    },
    booking: {"eyebrow":"ELNARA BEAUTY","title":"Записатися на прийом","intro":"Оберіть послугу та бажану дату, а потім залиште контактні дані. Ми підтвердимо доступність перед прийомом.","request":"Запити на запис","notice":"Вільний час перевіряється за календарем. Запис не підтверджено, доки ви не отримаєте підтвердження.","loadingServices":"Завантаження послуг...","service":"Послуга","chooseService":"Оберіть послугу","price":"Ціна","duration":"Тривалість","date":"Бажана дата","previousMonth":"Попередній місяць","nextMonth":"Наступний місяць","chooseDate":"Оберіть дату","selected":"Обрано","unavailable":"Недоступно","selectedDate":"Обрана дата:","dateHint":"Оберіть дату, щоб перевірити доступний час. Вибір дати не резервує запис.","times":"Доступний час","chooseServiceDate":"Оберіть послугу й дату, щоб побачити вільний час.","loadingTimes":"Завантаження доступного часу...","noTimes":"На цю дату немає вільного часу. Будь ласка, оберіть іншу дату.","name":"Повне ім’я","phone":"Телефон","email":"Електронна пошта","submit":"Надіслати запит на запис","submitting":"Надсилання запиту...","required":"Заповніть усі обов’язкові поля.","security":"Перевірку безпеки не налаштовано. Спробуйте пізніше.","captcha":"Будь ласка, пройдіть перевірку безпеки.","conflict":"Цей час щойно зайняв інший клієнт. Доступний час оновлено. Оберіть інший варіант.","refreshError":"Не вдалося оновити доступний час. Спробуйте ще раз.","failed":"Не вдалося надіслати запит. Спробуйте ще раз.","success":"Ваш запит на запис отримано. Будь ласка, дочекайтеся підтвердження.","connection":"Помилка з’єднання. Спробуйте ще раз.","generic":"Не вдалося створити запис. Перевірте дані й спробуйте ще раз.","notConfirmed":"Запис не підтверджено, доки ви не отримаєте підтвердження.","slotHint":"Вибір часу не резервує запис.","contact":"Контактні дані","servicesError":"Не вдалося завантажити послуги. Спробуйте пізніше.","categoryMakeup":"Макіяж","categoryFace":"Догляд за обличчям","categoryBody":"Тіло та масаж","categoryBrows":"Брови та вії","weekdays":["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]},
  },
  ru: {
    nav: {
      salonServices: "Услуги салона",
      study: "Обучение с нами",
      massages: "Массажи и процедуры",
      prices: "Цены",
      followUs: "Подписывайтесь на нас",
      menu: "Открыть или закрыть меню",
      closeMenu: "Закрыть меню",
      professional: "Кабинет специалиста",
      language: "Язык",
    },
    booking: {"eyebrow":"ELNARA BEAUTY","title":"Записаться на приём","intro":"Выберите услугу и желаемую дату, затем оставьте контактные данные. Мы подтвердим доступность перед приёмом.","request":"Заявки на запись","notice":"Свободное время проверяется по календарю. Запись не подтверждена, пока вы не получите подтверждение.","loadingServices":"Загрузка услуг...","service":"Услуга","chooseService":"Выберите услугу","price":"Цена","duration":"Длительность","date":"Желаемая дата","previousMonth":"Предыдущий месяц","nextMonth":"Следующий месяц","chooseDate":"Выберите дату","selected":"Выбрано","unavailable":"Недоступно","selectedDate":"Выбранная дата:","dateHint":"Выберите дату, чтобы проверить свободное время. Выбор даты не резервирует запись.","times":"Доступное время","chooseServiceDate":"Выберите услугу и дату, чтобы увидеть свободное время.","loadingTimes":"Загрузка свободного времени...","noTimes":"На эту дату нет свободного времени. Пожалуйста, выберите другую дату.","name":"Полное имя","phone":"Телефон","email":"Электронная почта","submit":"Отправить запрос на запись","submitting":"Отправка запроса...","required":"Заполните все обязательные поля.","security":"Проверка безопасности не настроена. Попробуйте позже.","captcha":"Пожалуйста, пройдите проверку безопасности.","conflict":"Это время только что занял другой клиент. Доступное время обновлено. Выберите другое время.","refreshError":"Не удалось обновить доступное время. Попробуйте ещё раз.","failed":"Не удалось отправить запрос. Попробуйте ещё раз.","success":"Ваш запрос на запись получен. Пожалуйста, дождитесь подтверждения.","connection":"Ошибка соединения. Попробуйте ещё раз.","generic":"Не удалось создать запись. Проверьте данные и попробуйте ещё раз.","notConfirmed":"Запись не подтверждена, пока вы не получите подтверждение.","slotHint":"Выбор времени не резервирует запись.","contact":"Контактные данные","servicesError":"Не удалось загрузить услуги. Попробуйте позже.","categoryMakeup":"Макияж","categoryFace":"Уход за лицом","categoryBody":"Тело и массаж","categoryBrows":"Брови и ресницы","weekdays":["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]},
  },
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }

  const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language still works for the current session if storage is unavailable.
    }

    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        if (SUPPORTED_LANGUAGES.includes(nextLanguage)) {
          setLanguage(nextLanguage);
        }
      },
      t: (key) => {
        const parts = key.split(".");
        let value = messages[language];

        for (const part of parts) value = value?.[part];

        return value !== undefined ? value : key;
      },
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
