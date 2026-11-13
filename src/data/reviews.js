// Client reviews for the home-page slider — every text in 4 languages,
// the site shows the one matching the chosen language.
//
// TODO: уточнити в Ельнари — це демо-відгуки; замінити на реальні відгуки клієнток
// (текст можна дати однією мовою, решту перекласти).
//
// Fields per review:
//   name      — client's name (not translated)
//   rating    — 1…5
//   serviceId — id from src/data/priceList.js; the service name is shown in the current language
//   date      — "YYYY-MM", shown as a month in the current language
//   text      — { uk, en, fr, ru }
//   photo     — optional photo of the work

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

export const reviews = [
  {
    id: 1,
    name: "Camille D.",
    rating: 5,
    serviceId: "powder-brows",
    date: "2026-10",
    photo: img("Works/brows-powder-1.webp"),
    text: {
      uk: "Пудрові брови виглядають дуже природно — ніби я просто вдало їх підфарбувала. Ельнара підібрала форму й відтінок саме під моє обличчя.",
      en: "My powder brows look so natural — as if I'd just filled them in nicely. Elnara chose the shape and shade to suit my face perfectly.",
      fr: "Mes sourcils poudrés sont très naturels, comme si je venais de les maquiller. Elnara a choisi la forme et la teinte idéales pour mon visage.",
      ru: "Пудровые брови выглядят очень естественно — будто я просто удачно их подкрасила. Эльнара подобрала форму и оттенок именно под моё лицо.",
    },
  },
  {
    id: 2,
    name: "Olena K.",
    rating: 5,
    serviceId: "lip-blush",
    date: "2026-09",
    photo: img("Works/lips-watercolor.webp"),
    text: {
      uk: "Акварельні губи — моя найкраща інвестиція! Колір ніжний, загоїлися швидко, а Ельнара все детально пояснила щодо догляду.",
      en: "Watercolour lips are my best investment! The colour is soft, they healed quickly and Elnara explained the aftercare in detail.",
      fr: "Les lèvres aquarelle, mon meilleur investissement ! La couleur est douce, la cicatrisation rapide et Elnara a tout expliqué pour les soins.",
      ru: "Акварельные губы — моя лучшая инвестиция! Цвет нежный, зажили быстро, а Эльнара подробно объяснила уход.",
    },
  },
  {
    id: 3,
    name: "Sophie M.",
    rating: 5,
    serviceId: "bridal-makeup",
    date: "2026-08",
    photo: img("Works/makeup-bridal.webp"),
    text: {
      uk: "Весільний макіяж протримався весь день і всю ніч, на фото я виглядала неймовірно. Дякую за спокій і турботу зранку!",
      en: "My bridal makeup lasted all day and all night, and I looked amazing in the photos. Thank you for the calm and care that morning!",
      fr: "Mon maquillage de mariée a tenu toute la journée et toute la nuit, j’étais magnifique sur les photos. Merci pour le calme et la douceur ce matin-là !",
      ru: "Свадебный макияж продержался весь день и всю ночь, на фото я выглядела потрясающе. Спасибо за спокойствие и заботу утром!",
    },
  },
  {
    id: 4,
    name: "Anna R.",
    rating: 5,
    serviceId: "lash-lift",
    date: "2026-07",
    photo: img("ImagesServices/lamination.webp"),
    text: {
      uk: "Ламінування вій — вау-ефект без туші. Тримається вже кілька тижнів, вранці збираюся вдвічі швидше.",
      en: "Lash lift gives a wow effect without mascara. It has lasted for weeks and I get ready twice as fast in the morning.",
      fr: "Le rehaussement de cils donne un effet waouh sans mascara. Il tient depuis des semaines et je me prépare deux fois plus vite le matin.",
      ru: "Ламинирование ресниц — вау-эффект без туши. Держится уже несколько недель, по утрам собираюсь вдвое быстрее.",
    },
  },
];
