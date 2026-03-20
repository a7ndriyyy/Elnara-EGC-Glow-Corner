import { useState, useRef} from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { IoClose } from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./EquipmentPage.css";

// Імпорт зображень
import equipmentHero from "../../public/Images/ImageEquipment/equipment-hero.webp";
import machine1 from "../../public/Images/ImageEquipment/machine1.webp";

export default function EquipmentPage() {
  const [selectedMachine, setSelectedMachine] = useState(null);
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
  

  // Дані про обладнання
  const equipment = [
    {
      id: 1,
      name: "LPG масажний апарат",
      model: "Dermology Pro",
      country: "Італія",
      description: "Вакуумно-роликовий масаж для моделювання фігури, зменшення целюліту та ліфтингу шкіри.",
      longDescription: "Інноваційний апарат для безопераційного ліфтингу тіла та обличчя. Стимулює кровообіг, лімфодренаж, вироблення колагену та еластину.",
      image: machine1,
      features: [
        "Антицелюлітний масаж",
        "Моделювання фігури",
        "Ліфтинг обличчя",
        "Зменшення об'ємів",
        "Лімфодренажний ефект"
      ],
      procedures: [
        "Антицелюлітний масаж", 
        "Лімфодренаж", 
        "Моделювання тіла", 
        "Посттравматична реабілітація"
      ]
    }
  ];

  const mainMachine = equipment[0];


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
          <img src={equipmentHero} alt="Професійне обладнання" />
          <div className="equipment-hero__overlay"></div>
        </div>
        
        <div className="equipment-hero__content">
          <h1 className="equipment-hero__title">
            Професійне обладнання
            <span>для вашої краси</span>
          </h1>
          <p className="equipment-hero__subtitle">
            Сучасний апарат преміум-класу для безпечних та ефективних процедур. 
            Європейська сертифікація та гарантія якості.
          </p>
          <div className="equipment-hero__buttons">
            <a href="#equipment" className="btn btn--primary">
              Детальніше
            </a>
                <button 
              className="btn btn--outline"
              onClick={() => openModal()}
            >
              Консультація
            </button>
          </div>
        </div>
      </section>

      {/* Секція з обладнанням */}
      <section id="equipment" className="equipment-featured">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Наше обладнання</h2>
            <p className="section-subtitle">
              Використовуємо тільки сертифіковане обладнання преміум-класу
            </p>
          </div>

          {/* Головна картка з апаратом */}
          <div className="machine-card">
            <div className="machine-card__grid">
              {/* Ліва частина - фото */}
              <div className="machine-card__image-wrapper">
                <img 
                  src={mainMachine.image} 
                  alt={mainMachine.name} 
                  className="machine-card__image"
                />
                <div className="machine-card__badge">
                  {mainMachine.model}
                </div>
              </div>
              
              {/* Права частина - інформація */}
              <div className="machine-card__content">
                <h3 className="machine-card__title">{mainMachine.name}</h3>
                
                <div className="machine-card__stats">
                  <div className="machine-stat">
                    <span className="machine-stat__value">{mainMachine.country}</span>
                    <span className="machine-stat__label">Країна виробник</span>
                  </div>
                  <div className="machine-stat">
                    <span className="machine-stat__value">✓</span>
                    <span className="machine-stat__label">Сертифіковано</span>
                  </div>
                  <div className="machine-stat">
                    <span className="machine-stat__value">500+</span>
                    <span className="machine-stat__label">Процедур</span>
                  </div>
                </div>
                
                <p className="machine-card__description">
                  {mainMachine.longDescription}
                </p>
                
                <div className="machine-card__features">
                  <h4>Можливості апарату:</h4>
                  <ul>
                    {mainMachine.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="machine-card__actions">
                  <button 
                    className="btn btn--primary"
                    onClick={() => setSelectedMachine(mainMachine)}
                  >
                    Детальніше про апарат
                  </button>
                  <button 
              className="btn btn--outline"
              onClick={() => openModal()}
            >
              Записатись
            </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Процедури */}
      <section className="equipment-procedures">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Процедури на апараті</h2>
            <p className="section-subtitle">
              Що ми робимо за допомогою Dermology Pro
            </p>
          </div>

          <div className="procedures-grid">
            {mainMachine.procedures.map((procedure, index) => (
              <div key={index} className="procedure-item">
                <div className="procedure-number">{index + 1}</div>
                <h3>{procedure}</h3>
                <p>
                  {index === 0 && "Ефективне зменшення целюліту, моделювання силуету"}
                  {index === 1 && "Виведення зайвої рідини, зменшення набряків"}
                  {index === 2 && "Корекція фігури, зменшення об'ємів, підтяжка"}
                  {index === 3 && "Відновлення після травм, регенерація тканин"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Переваги */}
      <section className="equipment-benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Чому обирають нас</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🇮🇹</div>
              <h3>Італійська якість</h3>
              <p>Апарат виробництва Італії з європейською сертифікацією</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔬</div>
              <h3>Науковий підхід</h3>
              <p>Клінічно доведена ефективність процедур</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚕️</div>
              <h3>Безпека</h3>
              <p>Регулярне обслуговування та контроль якості</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✨</div>
              <h3>Комфорт</h3>
              <p>Безболісні процедури з приємними відчуттями</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="equipment-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Спробуйте LPG масаж</h2>
            <p>Запишіться на процедуру та відчуйте результат вже після першого сеансу</p>
            <div className="cta-buttons">
                  <button 
              className="btn btn--outline"
              onClick={() => openModal()}
            >
              Записатись
            </button>
              <a href="tel:+33456756578" className="btn btn--outline btn--large">
                +33 4 56 75 65 78
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Модальне вікно */}
      {selectedMachine && (
        <div className="equipment-modal" onClick={() => setSelectedMachine(null)}>
          <div className="equipment-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="equipment-modal__close" onClick={() => setSelectedMachine(null)}>×</button>
            <h2>{selectedMachine.name}</h2>
            <p className="equipment-modal__model">{selectedMachine.model}</p>
            <p>{selectedMachine.longDescription}</p>
            <h3>Характеристики:</h3>
            <ul>
              <li>Виробник: {selectedMachine.country}</li>
              <li>Технологія: LPG Endermologie</li>
              <li>Насадки: 6 програм</li>
              <li>Інтенсивність: 10 рівнів</li>
            </ul>
            <button 
              className="btn btn--outline"
              onClick={() => openModal()}
            >
              Записатись
            </button>
          </div>
        </div>
      )}

       {/* МОДАЛЬНЕ ВІКНО З ФОРМОЮ */}
            {isModalOpen && (
              <div className="services__modal-overlay" onClick={closeModal}>
                <div className="services__modal" onClick={(e) => e.stopPropagation()}>
                  <button className="services__modal-close" onClick={closeModal}>
                    <IoClose />
                  </button>
                  
                  <div className="services__modal-header">
                    <h3 className="services__modal-title">
                      {selectedService ? `Запис на: ${selectedService.name}` : 'Записатись на консультацію'}
                    </h3>
                    <p className="services__modal-subtitle">
                      Заповніть форму і ми зв'яжемось з вами найближчим часом
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
                      <label className="services__modal-label">Ваше ім'я *</label>
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
                      <label className="services__modal-label">Телефон (необов'язково)</label>
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
                          Відправка...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="services__modal-submit-icon" />
                          {selectedService ? 'Записатись' : 'Отримати консультацію'}
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