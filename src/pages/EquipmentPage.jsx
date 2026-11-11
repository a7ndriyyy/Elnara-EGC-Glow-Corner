import React from 'react';
import { useState, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { IoClose } from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaMicroscope, FaUserMd, FaStar } from "react-icons/fa";
import "./Equipmentpage.css";
import { useLanguage } from "../i18n/LanguageContext";
import ServiceCard from "../components/ServiceCard/ServiceCard";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import HoursNotice from "../components/HoursNotice/HoursNotice";
import { apparatus } from "../data/apparatus";
import { formatDuration, localize } from "../utils/format";

// Імпорт зображень
import equipmentHero from "../../public/Images/ImageEquipment/equipment-hero.webp";

export default function EquipmentPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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
    
  const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Введіть ім'я";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Введіть email";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
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
  const openModal = (service = null) => {
    setSelectedService(service);
    if (service) {
      setFormData(prev => ({ 
        ...prev, 
        message: `Хочу записатись на послугу: ${service.name}` 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        message: "Хочу записатись на консультацію" 
      }));
    }
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
    <div className="equipment-page">
      {/* Hero секція */}
      <section className="equipment-hero">
        <div className="equipment-hero__bg">
          <img src={equipmentHero} alt={t("equipmentPage.hero")} />
          <div className="equipment-hero__overlay"></div>
        </div>
        
        <div className="equipment-hero__content">
          <h1 className="equipment-hero__title">
            {t("equipmentPage.hero")}
            <span>{t("equipmentPage.hero2")}</span>
          </h1>
          <p className="equipment-hero__subtitle">
            {t("equipmentPage.heroText")}
          </p>
          <div className="equipment-hero__buttons">
            <a href="#equipment" className="btn btn--primary">
              {t("equipmentPage.details")}
            </a>
                <button 
              className="btn btn--outline"
              onClick={() => openModal()}
            >
              {t("equipmentPage.consultation")}
            </button>
          </div>
        </div>
      </section>

      {/* Апаратні процедури (TZ step 5) */}
      <section id="equipment" className="equipment-services">
        <div className="equipment-services__inner">
          <SectionTitle
            eyebrow={t("equipmentPage.title")}
            title={t("equipmentPage.servicesTitle")}
            subtitle={t("equipmentPage.servicesSubtitle")}
          />
          <div className="card-grid">
            {apparatus.map((item) => (
              <div key={item.slug} id={item.slug} className="equipment-services__item">
                <ServiceCard
                  title={localize(item.title, language)}
                  image={item.image}
                  imageAlt=""
                  description={localize(item.description, language)}
                  duration={formatDuration(item.duration, language)}
                  priceFrom={item.priceFrom}
                  to="/booking"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Години роботи та доплати (TZ step 7) */}
      <HoursNotice />

      {/* Переваги */}
      <section className="equipment-benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("equipmentPage.why")}</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon"><FaMicroscope aria-hidden="true" /></div>
              <h3>{t("equipmentPage.science")}</h3>
              <p>{t("equipmentPage.scienceText")}</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon"><FaUserMd aria-hidden="true" /></div>
              <h3>{t("equipmentPage.safety")}</h3>
              <p>{t("equipmentPage.safetyText")}</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon"><FaStar aria-hidden="true" /></div>
              <h3>{t("equipmentPage.comfort")}</h3>
              <p>{t("equipmentPage.comfortText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="equipment-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t("equipmentPage.cta")}</h2>
            <p>{t("equipmentPage.ctaText")}</p>
            <div className="cta-buttons">
                  <button 
              className="btn btn--outline"
              onClick={() => navigate("/booking")}
            >
              {t("equipmentPage.book")}
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
                      {selectedService ? `${t("equipmentPage.book")}: ${selectedService.name}` : t("equipmentPage.consultation")}
                    </h3>
                    <p className="services__modal-subtitle">
                      {t("equipmentPage.modalSubtitle")}
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
                      <label className="services__modal-label">{t("equipmentPage.name")}</label>
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
                      <label className="services__modal-label">{t("equipmentPage.phone")}</label>
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
                          {t("equipmentPage.sending")}
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="services__modal-submit-icon" />
                          {selectedService ? t("equipmentPage.book") : t("equipmentPage.consultation")}
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