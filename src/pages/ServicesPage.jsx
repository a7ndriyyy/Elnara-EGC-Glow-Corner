import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "@emailjs/browser";
import "./ServicesPage.css";
import { useLanguage } from "../i18n/LanguageContext";

// Імпорт зображень (замініть на свої)
import makeupBridal from "../../public/Images/ImagesServices/makeup-brida.webp";
import makeupEvening from "../../public/Images/ImagesServices/makeup-evening.webp";
import makeupDay from "../../public/Images/ImagesServices/makeup-day.webp";
import makeupSmokey from "../../public/Images/ImagesServices/makeup-smokey.webp";
import servicesHero from "../../public/Images/ImagesServices/services-hero.webp";

export default function ServicesPage() {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const goToBooking = (service) => {
  const bookingServiceIds = {
    1: "bridal-makeup",
    2: "evening-makeup",
    3: "day-makeup",
    4: "smokey-eyes",
    5: "brow-shaping-coloring",
  };

  const bookingServiceId = service
    ? bookingServiceIds[service.id]
    : null;

  navigate(
    bookingServiceId
      ? `/booking?service=${bookingServiceId}`
      : "/booking"
  );
};

   useEffect(() => {
    AOS.init({
      duration: 600,
      once: true
    });
  }, []);
  
  // Стан для форми
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "Хочу записатись на послугу"
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    loading: false
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Дані про послуги
  const services = [
    {
      id: 1,
      name: "Весільний макіяж",
      nameEn: "Bridal Makeup",
      category: "bridal",
      price: "250",
      duration: "2 години",
      description: "Ідеальний весільний образ, який протримається весь день. Використовуємо професійну косметику преміум-класу.",
      longDescription: "Створюємо ніжний та романтичний образ, який підкреслить вашу природну красу. Пробний макіяж включено у вартість. Використовуємо виключно водостійку косметику преміальних брендів.",
      image: makeupBridal,
      features: [
        "Пробний макіяж за 1-2 тижні",
        "Водостійка косметика",
        "Стійкість 12+ годин",
        "Накладні вії в подарунок",
        "Фіксація образу"
      ],
      brands: ["Dior", "Chanel", "Tom Ford", "Charlotte Tilbury"],
      popular: true
    },
    {
      id: 2,
      name: "Вечірній макіяж",
      nameEn: "Evening Makeup",
      category: "evening",
      price: "180",
      duration: "1.5 години",
      description: "Яскравий та виразний макіяж для особливих подій, вечірок та святкувань.",
      longDescription: "Від чуттєвого смокі айс до сяючих образів з акцентом на очах або губах. Створимо образ, який привертає увагу і тримається всю ніч.",
      image: makeupEvening,
      features: [
        "Індивідуальний підбір кольорів",
        "Стійкість 8+ годин",
        "Скульптурування обличчя",
        "Накладні вії включено",
        "Корекція брів"
      ],
      brands: ["MAC", "Huda Beauty", "Anastasia", "Fenty Beauty"],
      popular: true
    },
    {
      id: 3,
      name: "Денний макіяж",
      nameEn: "Day Makeup",
      category: "day",
      price: "120",
      duration: "1 година",
      description: "Натуральний та свіжий макіяж для щоденного виходу, ділових зустрічей та побачень.",
      longDescription: "Макіяж в стилі 'nude' та 'no-makeup makeup'. Підкреслюємо природну красу, вирівнюємо тон, додаємо свіжості. Ідеально для офісу та повсякденного життя.",
      image: makeupDay,
      features: [
        "Ідеальний тон шкіри",
        "Натуральне сяйво",
        "Догляд перед макіяжем",
        "SPF захист",
        "Фіксація брів"
      ],
      brands: ["Chanel", "Laura Mercier", "Kosas", "RMS Beauty"],
      popular: false
    },
    {
      id: 4,
      name: "Smokey Eyes",
      nameEn: "Smokey Eyes",
      category: "evening",
      price: "160",
      duration: "1.5 години",
      description: "Класичний та сучасний смокі айс в будь-якій кольоровій гамі.",
      longDescription: "Інтенсивний погляд з ефектом димки. Виконуємо як класичний чорно-сірий, так і кольорові варіанти (синій, зелений, винний, графітовий).",
      image: makeupSmokey,
      features: [
        "Ідеальна розтушовка",
        "Будь-яка кольорова гама",
        "Корекція форми очей",
        "Накладні вії",
        "Стійкість 8+ годин"
      ],
      brands: ["Urban Decay", "Natasha Denona", "Pat McGrath"],
      popular: false
    },
    {
      id: 5,
      name: "Корекція та фарбування брів",
      nameEn: "Brows Shaping",
      category: "brows",
      price: "80",
      duration: "45 хвилин",
      description: "Професійна корекція, фарбування та ламінування брів.",
      longDescription: "Створюємо ідеальну форму брів, яка підходить саме вам. Фарбування хною або фарбою, ламінування, ботокс для брів.",
      image: makeupDay,
      features: [
        "Корекція пінцетом/воском",
        "Фарбування хною/фарбою",
        "Ламінування брів",
        "Ботокс для брів",
        "Догляд після процедури"
      ],
      brands: ["Levissime", "Adonia", "Concept"],
      popular: false
    }
  ];

  const translatedServices = t("pageContent.serviceCards");
  services.forEach((service, index) => Object.assign(service, translatedServices[index] || {}));

  // Фільтрація послуг
  const filteredServices = activeFilter === "all" 
    ? services 
    : services.filter(s => s.category === activeFilter);

  const popularServices = services.filter(s => s.popular);

  // Валідація форми
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
    } else if (formData.name.length < 2) {
      newErrors.name = "Ім'я занадто коротке";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email обов'язковий";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Невірний формат email";
    }
    
    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Невірний формат телефону";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обробка відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      formRef.current.classList.add("services__form--error");
      setTimeout(() => {
        formRef.current.classList.remove("services__form--error");
      }, 500);
      return;
    }
    
    setFormStatus({ ...formStatus, loading: true, message: "" });
    
    try {
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      if (result.status === 200) {
        setFormStatus({
          submitted: true,
          success: true,
          message: "Повідомлення відправлено! Ми зв'яжемось з вами найближчим часом.",
          loading: false
        });
        
        setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на послугу" });
        
        formRef.current.classList.add("services__form--success");
        setTimeout(() => {
          formRef.current.classList.remove("services__form--success");
        }, 1000);
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSelectedService(null);
          setFormStatus({ submitted: false, success: false, message: "", loading: false });
        }, 2000);
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message: "Сталася помилка. Спробуйте ще раз або зателефонуйте нам.",
        loading: false
      });
    }
  };

  // Обробка зміни полів
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Відкриття модального вікна
  const openModal = () => {
  setSelectedService(null);
  setFormData((prev) => ({
    ...prev,
    message: "Хочу записатись на консультацію",
  }));
  setIsModalOpen(true);
};

  // Закриття модального вікна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на послугу" });
    setErrors({});
    setFormStatus({ submitted: false, success: false, message: "", loading: false });
  };

  return (
    <div className="services-page">
      {/* Hero секція */}
      <section className="services-hero">
        <div className="services-hero__bg">
          <img src={servicesHero} alt="Elnara Beauty Salon" />
          <div className="services-hero__overlay"></div>
        </div>
        
        <div className="services-hero__content">
          <h1 className="services-hero__title">
            {t("servicesPage.hero")}
            <span>Elnara</span>
          </h1>
          <p className="services-hero__subtitle">
            {t("servicesPage.heroText")}
          </p>
          <div className="services-hero__buttons">
            <a href="#services" className="btn btn--primary">
              {t("servicesPage.all")}
            </a>
            <button 
              className="btn btn--outline"
              onClick={() => goToBooking()}
            >
              {t("servicesPage.book")}
            </button>
          </div>
        </div>
      </section>

      {/* Чому ми */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card" data-aos="fade-up">
              <div className="feature-card__icon">💄</div>
              <h3>{t("servicesPage.cosmetics")}</h3>
              <p>{t("servicesPage.cosmeticsText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="100">
              <div className="feature-card__icon">✨</div>
              <h3>{t("servicesPage.hygiene")}</h3>
              <p>{t("servicesPage.hygieneText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="200">
              <div className="feature-card__icon">🎓</div>
              <h3>{t("servicesPage.experience")}</h3>
              <p>{t("servicesPage.experienceText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="300">
              <div className="feature-card__icon">💎</div>
              <h3>{t("servicesPage.personal")}</h3>
              <p>{t("servicesPage.personalText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Популярні послуги */}
      <section className="popular">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t("servicesPage.popular")}</span>
            <h2 className="section-title">{t("servicesPage.popularTitle")}</h2>
          </div>

          <div className="popular__grid">
            {popularServices.map((service) => (
              <div 
                key={service.id} 
                className="popular-card"
                onClick={() => goToBooking(service)}
              >
                <div className="popular-card__image">
                  <img src={service.image} alt={service.name} />
                  <span className="popular-card__badge">{t("servicesPage.popular")}</span>
                </div>
                <div className="popular-card__content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="popular-card__footer">
                    <div>
                      <span className="popular-card__duration">{service.duration}</span>
                      <span className="popular-card__price">{service.price} €</span>
                    </div>
                 <button
                    className="popular-card__btn"
                     onClick={(e) => {
                     e.stopPropagation();
                     goToBooking(service);
                       }}
                      >
                     {t("servicesPage.book")} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* {t("servicesPage.all")} */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t("servicesPage.our")}</span>
            <h2 className="section-title">{t("servicesPage.choose")}</h2>
          </div>

          {/* Фільтри */}
          <div className="services__filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {t("servicesPage.all")}
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'bridal' ? 'active' : ''}`}
              onClick={() => setActiveFilter('bridal')}
            >
              {t("servicesPage.bridal")}
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'evening' ? 'active' : ''}`}
              onClick={() => setActiveFilter('evening')}
            >
              {t("servicesPage.evening")}
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'day' ? 'active' : ''}`}
              onClick={() => setActiveFilter('day')}
            >
              {t("servicesPage.day")}
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'brows' ? 'active' : ''}`}
              onClick={() => setActiveFilter('brows')}
            >
              {t("servicesPage.brows")}
            </button>
          </div>

          {/* Сітка послуг */}
          <div className="services__grid">
            {filteredServices.map((service) => (
              <div
                                key={service.id}
                                className="service-card"
                                onClick={() => goToBooking(service)}
                              >
                            <div className="service-card__image">
                              <img src={service.image} alt={service.name} />
                            </div>
                      <div className="service-card__content">
              <h3>{service.name}</h3>

              <p className="service-card__name-en">{service.nameEn}</p>

              <div className="service-card__details">
                <span className="service-card__duration">
                  {service.duration}
                </span>

                <span className="service-card__price">
                  {service.price} €
                </span>
              </div>

              <button
                type="button"
                className="popular-card__btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToBooking(service);
                }}
              >
                {t("servicesPage.book")} →
              </button>
            </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Як ми працюємо */}
      <section className="process">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t("servicesPage.process")}</span>
            <h2 className="section-title">{t("servicesPage.processTitle")}</h2>
          </div>

          <div className="process__steps">
            <div className="process-step">
              <div className="process-step__number">01</div>
              <div className="process-step__content">
                <h3>{t("servicesPage.consultation")}</h3>
                <p>{t("servicesPage.consultationText")}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">02</div>
              <div className="process-step__content">
                <h3>{t("servicesPage.skin")}</h3>
                <p>{t("servicesPage.skinText")}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">03</div>
              <div className="process-step__content">
                <h3>{t("servicesPage.makeup")}</h3>
                <p>{t("servicesPage.makeupText")}</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">04</div>
              <div className="process-step__content">
                <h3>{t("servicesPage.finish")}</h3>
                <p>{t("servicesPage.finishText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2>{t("servicesPage.cta")}</h2>
            <p>{t("servicesPage.ctaText")}</p>
            <div className="cta__buttons">
              <button 
                className="btn btn--primary btn--large"
                onClick={() => goToBooking()}
              >
                {t("servicesPage.online")}
              </button>
              <button
  type="button"
  className="btn btn--outline btn--large"
  onClick={openModal}
>
  {t("servicesPage.getConsultation")}
</button>
              <a href="tel:+33456756578" className="btn btn--outline btn--large">
                +33 4 56 75 65 78
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* МОДАЛЬНЕ ВІКНО З ФОРМОЮ */}
      {isModalOpen && (
        <div className="services__modal-overlay" onClick={closeModal}>
          <div className="services__modal" onClick={(e) => e.stopPropagation()}>
            <button className="services__modal-close" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="services__modal-header">
              <h3 className="services__modal-title">
                {selectedService ? `${t("servicesPage.book")}: ${selectedService.name}` : t("servicesPage.getConsultation")}
              </h3>
              <p className="services__modal-subtitle">
                {t("servicesPage.modalSubtitle")}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="services__modal-form">
              <div className={`services__modal-field ${errors.name ? 'error' : ''}`}>
                <FaUser className="services__modal-field-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  className="services__modal-input"
                />
                <label className="services__modal-label">{t("servicesPage.name")}</label>
                {errors.name && <span className="services__modal-error">{errors.name}</span>}
              </div>

              <div className={`services__modal-field ${errors.email ? 'error' : ''}`}>
                <FaEnvelope className="services__modal-field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  className="services__modal-input"
                />
                <label className="services__modal-label">Email *</label>
                {errors.email && <span className="services__modal-error">{errors.email}</span>}
              </div>

              <div className={`services__modal-field ${errors.phone ? 'error' : ''}`}>
                <FaPhone className="services__modal-field-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  className="services__modal-input"
                />
                <label className="services__modal-label">{t("servicesPage.phone")}</label>
                {errors.phone && <span className="services__modal-error">{errors.phone}</span>}
              </div>

              <input type="hidden" name="message" value={formData.message} />

              <button 
                type="submit" 
                className="services__modal-submit"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? (
                  <>
                    <span className="services__modal-spinner"></span>
                    {t("servicesPage.sending")}
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="services__modal-submit-icon" />
                    {selectedService ? t("servicesPage.book") : t("servicesPage.getConsultation")}
                    <span className="services__modal-submit-glow"></span>
                  </>
                )}
              </button>

              {formStatus.message && (
                <div className={`services__modal-status ${formStatus.success ? 'success' : 'error'}`}>
                  {formStatus.success ? <FaCheckCircle /> : <FaTimesCircle />}
                  <span>{formStatus.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}