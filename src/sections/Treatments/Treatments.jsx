import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { MdFace, MdSpa } from "react-icons/md";
import { GiSparkles } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { FaPaperPlane, FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import emailjs from '@emailjs/browser';
import "./Treatments.css";
import { treatmentsData } from "../../data/treatments";

export default function Treatments() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // стан для модального вікна
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  
  // Стан для форми
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "Хочу записатись на консультацію"
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    loading: false
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Використовуємо useMemo для відфільтрованих даних
  const filteredTreatments = useMemo(() => {
    if (activeFilter === "all") {
      return treatmentsData;
    }
    return treatmentsData.filter(t => t.category === activeFilter);
  }, [activeFilter]);

  // Категорії для фільтрації
  const categories = [
    { id: "all", label: "Всі послуги", icon: <GiSparkles /> },
    { id: "Face", label: "Обличчя", icon: <MdFace /> },
    { id: "Body", label: "Тіло", icon: <MdSpa /> }
  ];

  // Генерація частинок
   useEffect(() => {
    const timer = setTimeout(() => {
      const generated = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${8 + Math.random() * 20}s`,
        delay: `${Math.random() * 5}s`,
        size: `${2 + Math.random() * 6}px`,
        opacity: 0.1 + Math.random() * 0.3,
      }));
      setParticles(generated);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Ефект для відстеження миші
  const handleMouseMove = useCallback((e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.min(100, Math.max(0, x));
      const clampedY = Math.min(100, Math.max(0, y));
      
      setMousePosition({ x: clampedX, y: clampedY });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Анімація появи карток
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("treatments__card--visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    cardsRef.current = cardsRef.current.slice(0, filteredTreatments.length);
    
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filteredTreatments]);

  // Інтенсивність світіння
  const glowIntensity = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - centerX, 2) + 
      Math.pow(mousePosition.y - centerY, 2)
    );
    return Math.max(0.3, 1 - distance / 100);
  }, [mousePosition]);

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
      formRef.current.classList.add("treatments__form--error");
      setTimeout(() => {
        formRef.current.classList.remove("treatments__form--error");
      }, 500);
      return;
    }
    
    setFormStatus({ ...formStatus, loading: true, message: "" });
    
    try {
      // Відправка через EmailJS
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
        
        setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на консультацію" });
        
        formRef.current.classList.add("treatments__form--success");
        setTimeout(() => {
          formRef.current.classList.remove("treatments__form--success");
        }, 1000);
        
        // Закриваємо модальне вікно через 2 секунди після успіху
        setTimeout(() => {
          setIsModalOpen(false);
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

  // Закриття модального вікна
  const closeModal = () => {
    setIsModalOpen(false);
    // Скидаємо форму при закритті
    setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на консультацію" });
    setErrors({});
    setFormStatus({ submitted: false, success: false, message: "", loading: false });
  };

  return (
    <section id="treatments" className="treatments" ref={sectionRef}>
      {/* Фон з частинками */}
      <div className="treatments__background">
        <div 
          className="treatments__gradient" 
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(201, 162, 126, ${0.15 * glowIntensity}) 0%, 
              rgba(10, 10, 10, 0.98) 60%)`
          }}
        />
        <div className="treatments__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="treatments__particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                filter: `blur(${p.blur}px)`,
                opacity: p.opacity,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Декоративні лінії */}
      <div className="treatments__lines">
        <div className="treatments__line treatments__line--1"></div>
        <div className="treatments__line treatments__line--2"></div>
        <div className="treatments__line treatments__line--3"></div>
      </div>

      <div className="treatments__container">
        {/* Заголовок з ефектом */}
        <div className="treatments__header">
          <span className="treatments__subtitle">
            <BsStars className="treatments__subtitle-icon" />
            Ексклюзивні процедури
          </span>
          <h2 className="treatments__title">
            <span className="treatments__title-text">Наші</span>
            <span className="treatments__title-highlight">послуги</span>
          </h2>
          <p className="treatments__description">
            Відкрийте для себе світ професійного догляду та краси. 
            Індивідуальний підхід та преміальні матеріали.
          </p>
        </div>

        {/* Фільтри категорій */}
        <div className="treatments__filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`treatments__filter-btn ${activeFilter === cat.id ? "active" : ""}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              <span className="treatments__filter-icon">{cat.icon}</span>
              <span className="treatments__filter-label">{cat.label}</span>
              {activeFilter === cat.id && (
                <span className="treatments__filter-glow"></span>
              )}
            </button>
          ))}
        </div>

        {/* Сітка карток */}
        <div className="treatments__grid">
          {filteredTreatments.map((treatment, index) => (
            <div
              key={treatment.id}
              className="treatments__card"
              ref={(el) => (cardsRef.current[index] = el)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Бейдж категорії */}
              <div className="treatments__card-badge">
                <span>
                  {treatment.category === "Face" ? (
                    <><MdFace /> Обличчя</>
                  ) : (
                    <><MdSpa /> Тіло</>
                  )}
                </span>
              </div>

              {/* Зображення з ефектом */}
              <div className="treatments__card-image">
                <div className="treatments__card-overlay"></div>
                <img 
                  src={treatment.image} 
                  alt={treatment.title}
                  className="treatments__card-img"
                  loading="lazy"
                />
                
                {/* Хайлайт */}
                <div className="treatments__card-highlight">
                  <span className="treatments__card-highlight-text">
                    <GiSparkles className="treatments__card-highlight-icon" />
                    {treatment.highlight}
                  </span>
                </div>
              </div>

              {/* Контент */}
              <div className="treatments__card-content">
                <h3 className="treatments__card-title">{treatment.title}</h3>
                <p className="treatments__card-desc">{treatment.desc}</p>
                
                <div className="treatments__card-details">
                  <div className="treatments__card-detail">
                    <FiClock className="treatments__card-icon" />
                    <span>{treatment.time}</span>
                  </div>
                  <div className="treatments__card-price">{treatment.price}</div>
                </div>

                <button className="treatments__card-btn">
                  <span>Детальніше</span>
                  <FiArrowRight className="treatments__card-btn-icon" />
                  <span className="treatments__card-btn-glow"></span>
                </button>
              </div>

              {/* Декоративний елемент */}
              <div className="treatments__card-glow"></div>
            </div>
          ))}
        </div>

        {/* CTA секція */}
        <div className="treatments__cta">
          <div className="treatments__cta-content">
            <h3 className="treatments__cta-title">Не знаєте що обрати?</h3>
            <p className="treatments__cta-text">
              Отримайте безкоштовну консультацію нашого експерта
            </p>
            <button 
              className="treatments__cta-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Записатись на консультацію
              <FiArrowRight className="treatments__cta-btn-icon" />
              <span className="treatments__cta-btn-glow"></span>
            </button>
          </div>
          <div className="treatments__cta-decoration">
            <GiSparkles />
            <BsStars />
            <GiSparkles />
          </div>
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО З ФОРМОЮ */}
      {isModalOpen && (
        <div className="treatments__modal-overlay" onClick={closeModal}>
          <div className="treatments__modal" onClick={(e) => e.stopPropagation()}>
            <button className="treatments__modal-close" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="treatments__modal-header">
              <h3 className="treatments__modal-title">Записатись на консультацію</h3>
              <p className="treatments__modal-subtitle">
                Заповніть форму і ми зв'яжемось з вами найближчим часом
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="treatments__modal-form">
              <div className={`treatments__modal-field ${errors.name ? 'error' : ''}`}>
                <FaUser className="treatments__modal-field-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  className="treatments__modal-input"
                />
                <label className="treatments__modal-label">Ваше ім'я *</label>
                {errors.name && <span className="treatments__modal-error">{errors.name}</span>}
              </div>

              <div className={`treatments__modal-field ${errors.email ? 'error' : ''}`}>
                <FaEnvelope className="treatments__modal-field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  className="treatments__modal-input"
                />
                <label className="treatments__modal-label">Email *</label>
                {errors.email && <span className="treatments__modal-error">{errors.email}</span>}
              </div>

              <div className={`treatments__modal-field ${errors.phone ? 'error' : ''}`}>
                <FaPhone className="treatments__modal-field-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  className="treatments__modal-input"
                />
                <label className="treatments__modal-label">Телефон (необов'язково)</label>
                {errors.phone && <span className="treatments__modal-error">{errors.phone}</span>}
              </div>

              <button 
                type="submit" 
                className="treatments__modal-submit"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? (
                  <>
                    <span className="treatments__modal-spinner"></span>
                    Відправка...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="treatments__modal-submit-icon" />
                    Записатись
                    <span className="treatments__modal-submit-glow"></span>
                  </>
                )}
              </button>

              {formStatus.message && (
                <div className={`treatments__modal-status ${formStatus.success ? 'success' : 'error'}`}>
                  {formStatus.success ? <FaCheckCircle /> : <FaTimesCircle />}
                  <span>{formStatus.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}