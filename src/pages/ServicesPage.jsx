import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaPaintBrush,
  FaStar,
  FaGraduationCap,
  FaGem,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "@emailjs/browser";
import "./ServicesPage.css";
import ServiceCard from "../components/ServiceCard/ServiceCard";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import HoursNotice from "../components/HoursNotice/HoursNotice";
import { makeupTypes, massageProcedures } from "../data/salonServices";
import { bookingLink, findDirection } from "../data/directions";
import { formatDuration, localize } from "../utils/format";
import { useLanguage } from "../i18n/LanguageContext";

// Імпорт зображень (замініть на свої)
import servicesHero from "../../public/Images/ImagesServices/services-hero.webp";

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const goToBooking = (service) => navigate(service ? bookingLink(service) : "/booking");

  const scrollToServices = () =>
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });

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

  // Service groups — shared with the "Макіяж" / "Масаж" / "Бровист" directions.
  const groups = [
    { id: "makeup", items: makeupTypes, title: t("salon.makeupTitle"), subtitle: t("salon.makeupSubtitle"), filter: t("salon.filterMakeup") },
    { id: "brows", items: findDirection("brows")?.subdirections ?? [], title: t("salon.browsTitle"), subtitle: t("salon.browsSubtitle"), filter: t("salon.filterBrows") },
    { id: "massage", items: massageProcedures, title: t("salon.massageTitle"), subtitle: t("salon.massageSubtitle"), filter: t("salon.filterMassage") },
  ];
  const visibleGroups = activeFilter === "all" ? groups : groups.filter((g) => g.id === activeFilter);
  const popularServices = makeupTypes.filter((s) => s.popular);

  const renderCard = (service, extra = {}) => (
    <ServiceCard
      key={service.slug}
      title={localize(service.title, language)}
      image={service.image}
      imageAlt=""
      description={localize(service.description, language)}
      duration={formatDuration(service.duration, language)}
      priceFrom={service.priceFrom}
      onAction={() => goToBooking(service)}
      {...extra}
    />
  );

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
            <button type="button" className="btn btn--primary" onClick={scrollToServices}>
              {t("servicesPage.all")}
            </button>
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
              <div className="feature-card__icon"><FaPaintBrush aria-hidden="true" /></div>
              <h3>{t("servicesPage.cosmetics")}</h3>
              <p>{t("servicesPage.cosmeticsText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="100">
              <div className="feature-card__icon"><FaStar aria-hidden="true" /></div>
              <h3>{t("servicesPage.hygiene")}</h3>
              <p>{t("servicesPage.hygieneText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="200">
              <div className="feature-card__icon"><FaGraduationCap aria-hidden="true" /></div>
              <h3>{t("servicesPage.experience")}</h3>
              <p>{t("servicesPage.experienceText")}</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="300">
              <div className="feature-card__icon"><FaGem aria-hidden="true" /></div>
              <h3>{t("servicesPage.personal")}</h3>
              <p>{t("servicesPage.personalText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Популярні послуги */}
      <section className="popular">
        <div className="container">
          <SectionTitle eyebrow={t("servicesPage.popular")} title={t("servicesPage.popularTitle")} />

          <div className="card-grid popular__grid">
            {popularServices.map((service) => renderCard(service, { badge: t("servicesPage.popular") }))}
          </div>
        </div>
      </section>

      {/* {t("servicesPage.all")} */}
      <section id="services" className="services">
        <div className="container">
          <SectionTitle eyebrow={t("servicesPage.our")} title={t("servicesPage.choose")} />

          {/* Категорії (TZ step 6) */}
          <div className="services__filters" role="group" aria-label={t("salon.filtersLabel")}>
            {[{ id: "all", filter: t("servicesPage.all") }, ...groups].map((g) => (
              <button
                key={g.id}
                type="button"
                className={`filter-btn ${activeFilter === g.id ? "active" : ""}`}
                aria-pressed={activeFilter === g.id}
                onClick={() => setActiveFilter(g.id)}
              >
                {g.filter}
              </button>
            ))}
          </div>

          {visibleGroups.map((group) => (
            <div key={group.id} id={`services-${group.id}`} className="services__group">
              <SectionTitle as="h3" title={group.title} subtitle={group.subtitle} />
              <div className="card-grid card-grid--4 services__grid">
                {group.items.map((service) => renderCard(service))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Години роботи та доплати (TZ step 7) */}
      <HoursNotice />

      {/* Як ми працюємо */}
      <section className="process">
        <div className="container">
          <SectionTitle eyebrow={t("servicesPage.process")} title={t("servicesPage.processTitle")} />

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