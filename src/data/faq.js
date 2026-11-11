// FAQ with short vertical videos (TZ step 10.3).
// TODO: уточнити в Ельнари — підтвердити питання, відповіді та додати відео.
//
// `video` (optional, 9:16 like Reels):
//   { type: "file", src: "/Videos/pain.mp4", poster: "/Videos/pain.webp" }  — file in public/
//   { type: "youtube", id: "VIDEO_ID" }                                      — YouTube Shorts id
//   { type: "instagram", url: "https://www.instagram.com/reel/XXXX/" }       — Instagram reel
// Paths for "file" are relative to the site root; BASE_URL is added automatically.

export const faqItems = [
  {
    id: "pain",
    question: { uk: "Чи боляче?", en: "Does it hurt?", fr: "Est-ce douloureux ?", ru: "Это больно?" },
    answer: {
      uk: "Перед процедурою наносимо знеболювальний крем, тому більшість клієнток відчувають лише легкий дискомфорт.",
      en: "We apply a numbing cream beforehand, so most clients feel only mild discomfort.",
      fr: "Nous appliquons une crème anesthésiante au préalable : la plupart des clientes ne ressentent qu’une légère gêne.",
      ru: "Перед процедурой наносим обезболивающий крем, поэтому большинство клиенток чувствуют лишь лёгкий дискомфорт.",
    },
    video: null,
  },
  {
    id: "duration",
    question: { uk: "Скільки тримається перманент?", en: "How long does permanent makeup last?", fr: "Combien de temps dure le maquillage permanent ?", ru: "Сколько держится перманент?" },
    answer: {
      uk: "Зазвичай від 1 до 3 років — залежно від типу шкіри, догляду та зони.",
      en: "Usually 1 to 3 years, depending on skin type, aftercare and the area treated.",
      fr: "En général de 1 à 3 ans, selon le type de peau, les soins et la zone.",
      ru: "Обычно от 1 до 3 лет — в зависимости от типа кожи, ухода и зоны.",
    },
    video: null,
  },
  {
    id: "preparation",
    question: { uk: "Як підготуватися до процедури?", en: "How should I prepare?", fr: "Comment se préparer ?", ru: "Как подготовиться к процедуре?" },
    answer: {
      uk: "За добу не вживайте алкоголь і каву, за тиждень — не засмагайте. Детальні рекомендації надішлемо після запису.",
      en: "Avoid alcohol and coffee the day before and tanning the week before. We send detailed advice after booking.",
      fr: "Évitez l’alcool et le café la veille et le bronzage la semaine précédente. Nous envoyons les conseils détaillés après la réservation.",
      ru: "За сутки не употребляйте алкоголь и кофе, за неделю — не загорайте. Подробные рекомендации пришлём после записи.",
    },
    video: null,
  },
  {
    id: "aftercare",
    question: { uk: "Догляд після процедури", en: "Aftercare", fr: "Soins après la séance", ru: "Уход после процедуры" },
    answer: {
      uk: "Перші дні не мочіть і не тріть зону, наносьте загоювальну мазь і уникайте сауни та сонця.",
      en: "For the first days keep the area dry, don’t rub it, apply the healing ointment and avoid saunas and sun.",
      fr: "Les premiers jours, gardez la zone au sec, ne frottez pas, appliquez la pommade cicatrisante et évitez sauna et soleil.",
      ru: "Первые дни не мочите и не трите зону, наносите заживляющую мазь и избегайте сауны и солнца.",
    },
    video: null,
  },
  {
    id: "contraindications",
    question: { uk: "Протипоказання", en: "Contraindications", fr: "Contre-indications", ru: "Противопоказания" },
    answer: {
      uk: "Вагітність і годування груддю, загострення шкірних захворювань, діабет у стадії декомпенсації, прийом антикоагулянтів. Якщо сумніваєтеся — проконсультуйтеся з лікарем.",
      en: "Pregnancy and breastfeeding, active skin conditions, uncontrolled diabetes, blood thinners. If in doubt, please check with your doctor.",
      fr: "Grossesse et allaitement, affections cutanées actives, diabète non équilibré, anticoagulants. En cas de doute, consultez votre médecin.",
      ru: "Беременность и кормление грудью, обострение кожных заболеваний, декомпенсированный диабет, приём антикоагулянтов. Если сомневаетесь — проконсультируйтесь с врачом.",
    },
    video: null,
  },
  {
    id: "touch-up",
    question: { uk: "Чи потрібна корекція?", en: "Do I need a touch-up?", fr: "Une retouche est-elle nécessaire ?", ru: "Нужна ли коррекция?" },
    answer: {
      uk: "Так, через 4–6 тижнів робимо корекцію — вона закріплює колір і форму.",
      en: "Yes — a touch-up after 4–6 weeks sets the colour and shape.",
      fr: "Oui : une retouche 4 à 6 semaines après fixe la couleur et la forme.",
      ru: "Да, через 4–6 недель делаем коррекцию — она закрепляет цвет и форму.",
    },
    video: null,
  },
];
