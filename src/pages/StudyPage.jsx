import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiUsers, FiAward } from "react-icons/fi";
import { FaPaperPlane, FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import emailjs from '@emailjs/browser';
import "./StudyPage.css";

// Імпорт зображень (замініть на свої)
import courseImage1 from "../../public/Images/ImagesStudy/Makeup-Course.webp";
import courseImage2 from "../../public/Images/ImagesStudy/Makeup-Course.webp";
import courseImage3 from "../../public/Images/ImagesStudy/Makeup-Course.webp";
import elnaraPortrait from "../../public/Images/ImagesStudy/Elnara-portrait.webp";
import studyHero from "../../public/Images/ImagesStudy/Study-hero.webp";
import videoPreview1 from "../../public/Images/ImagesStudy/video-preview.webp";
import videoPreview2 from "../../public/Images/ImagesStudy/video-preview.webp";

export default function StudyPage() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [, setIsVisible] = useState({});
  
  // Стан для форми
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "Хочу записатись на курс"
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    loading: false
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Ефект для анімації при скролі
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Дані для курсів
  const courses = [
    {
      id: 1,
      title: "Мастер-клас: Вечірній макіяж",
      description: "Навчіться створювати розкішні вечірні образи з нуля. Всі техніки, лайфхаки та професійні секрети.",
      price: "499€",
      duration: "2 дні (10 годин)",
      level: "Для початківців",
      image: courseImage1,
      features: ["Практичні заняття", "Робочий зошит", "Сертифікат", "Підтримка після курсу"]
    },
    {
      id: 2,
      title: "Smokey Eyes: Майстерність",
      description: "Інтенсивний курс з найпопулярнішої техніки макіяжу. Від класики до сучасних варіацій.",
      price: "349€",
      duration: "1 день (6 годин)",
      level: "Середній рівень",
      image: courseImage2,
      features: ["Практика на моделях", "Відеоуроки", "Чат з учасниками", "Розбір помилок"]
    },
    {
      id: 3,
      title: "Преміум: Індивідуальне навчання",
      description: "Персональні заняття з Elnara. Повне занурення в професію з особистим менторством.",
      price: "1299€",
      duration: "5 днів (20 годин)",
      level: "Просунутий",
      image: courseImage3,
      features: ["1 на 1 з Elnara", "Зйомка портфоліо", "Сертифікат", "Допомога з працевлаштуванням"]
    }
  ];

  // Відео-контент
  const videos = [
    { id: 1, title: "Як зробити ідеальну стрілку", duration: "15:24", preview: videoPreview1, videoUrl: "https://www.youtube.com/embed/..." },
    { id: 2, title: "Розбір техніки smoky eyes", duration: "22:18", preview: videoPreview2, videoUrl: "https://www.youtube.com/embed/..." },
    { id: 3, title: "Секрети контурування", duration: "18:45", preview: videoPreview1, videoUrl: "https://www.youtube.com/embed/..." },
  ];

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
      formRef.current.classList.add("study__form--error");
      setTimeout(() => {
        formRef.current.classList.remove("study__form--error");
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
        
        setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на курс" });
        
        formRef.current.classList.add("study__form--success");
        setTimeout(() => {
          formRef.current.classList.remove("study__form--success");
        }, 1000);
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
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
  const openModal = (course = null) => {
    setSelectedCourse(course);
    if (course) {
      setFormData(prev => ({ 
        ...prev, 
        message: `Хочу записатись на курс: ${course.title}` 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        message: "Хочу записатись на курс" 
      }));
    }
    setIsModalOpen(true);
  };

  // Закриття модального вікна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setFormData({ name: "", email: "", phone: "", message: "Хочу записатись на курс" });
    setErrors({});
    setFormStatus({ submitted: false, success: false, message: "", loading: false });
  };

  return (
    <div className="study-page">
      {/* Hero Section з відео/фото на фоні */}
      <section className="study-hero">
        <div className="study-hero__background">
          <img src={studyHero} alt="Elnara makeup course" />
          <div className="study-hero__overlay"></div>
        </div>
        
        <div className="study-hero__content">
          <span className="study-hero__badge" data-animate="fade-up">Освіта від Elnara</span>
          <h1 className="study-hero__title" data-animate="fade-up" data-delay="100">
            Стань професіоналом
            <span>в індустрії краси</span>
          </h1>
          <p className="study-hero__subtitle" data-animate="fade-up" data-delay="200">
            Авторські курси з макіяжу від міжнародного експерта з 15-річним досвідом
          </p>
          <div className="study-hero__buttons" data-animate="fade-up" data-delay="300">
            <button 
              className="study-btn study-btn--primary"
              onClick={() => openModal()}
            >
              Обрати курс
              <FiArrowRight />
            </button>
            <button className="study-btn study-btn--outline" onClick={() => setActiveVideo("intro")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Дивитись презентацію
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="study-hero__stats">
          <div className="stat-item" data-animate="fade-up">
            <span className="stat-number">500+</span>
            <span className="stat-label">Випускників</span>
          </div>
          <div className="stat-item" data-animate="fade-up" data-delay="100">
            <span className="stat-number">15</span>
            <span className="stat-label">Років досвіду</span>
          </div>
          <div className="stat-item" data-animate="fade-up" data-delay="200">
            <span className="stat-number">50+</span>
            <span className="stat-label">Майстер-класів</span>
          </div>
          <div className="stat-item" data-animate="fade-up" data-delay="300">
            <span className="stat-number">100%</span>
            <span className="stat-label">Практики</span>
          </div>
        </div>
      </section>

      {/* Про Elnara */}
      <section className="study-about">
        <div className="study-about__container">
          <div className="study-about__image" data-animate="fade-right">
            <img src={elnaraPortrait} alt="Elnara - makeup artist" />
            <div className="study-about__experience">
              <span>15+</span>
              <p>років в індустрії краси</p>
            </div>
          </div>
          
          <div className="study-about__content" data-animate="fade-left">
            <span className="section-badge">Хто веде курси</span>
            <h2 className="section-title">Elnara <span>Makeup Artist</span></h2>
            <p className="section-text">
              Міжнародний візажист, сертифікований тренер та засновниця студії краси. 
              Працювала з Vogue, Elle, Harper's Bazaar та топ-моделями світового рівня.
            </p>
            
            <div className="study-about__features">
              <div className="feature">
                <div className="feature-icon">🎓</div>
                <div>
                  <h4>Міжнародна сертифікація</h4>
                  <p>Дипломи визнаються в Європі та США</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">💄</div>
                <div>
                  <h4>Авторська методика</h4>
                  <p>Унікальний підхід, який працює</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🤝</div>
                <div>
                  <h4>Підтримка 24/7</h4>
                  <p>Допомагаю навіть після курсів</p>
                </div>
              </div>
            </div>

            <div className="study-about__social">
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">▶️ YouTube</a>
            </div>
          </div>
        </div>
      </section>

      {/* Курси */}
      <section id="courses" className="study-courses">
        <div className="container">
          <div className="section-header" data-animate="fade-up">
            <span className="section-badge">Навчання</span>
            <h2 className="section-title">Виберіть свій <span>формат</span></h2>
            <p className="section-subtitle">
              Кожен курс створений для конкретного рівня та цілей. 
              Від початківців до професіоналів.
            </p>
          </div>

          <div className="courses-grid">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="course-card"
                data-animate="fade-up"
                data-delay={index * 100}
              >
                <div className="course-card__image">
                  <img src={course.image} alt={course.title} />
                  <span className="course-card__level">{course.level}</span>
                </div>
                
                <div className="course-card__content">
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__description">{course.description}</p>
                  
                  <div className="course-card__meta">
                    <span className="course-card__duration">
                      <FiClock />
                      {course.duration}
                    </span>
                  </div>

                  <div className="course-card__features">
                    {course.features.map((feature, i) => (
                      <span key={i} className="feature-tag">{feature}</span>
                    ))}
                  </div>

                  <div className="course-card__footer">
                    <span className="course-card__price">{course.price}</span>
                    <button 
                      className="course-card__btn"
                      onClick={() => openModal(course)}
                    >
                      Записатись
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Відео-галерея */}
      <section className="study-videos">
        <div className="container">
          <div className="section-header" data-animate="fade-up">
            <span className="section-badge">Відеоуроки</span>
            <h2 className="section-title">Дивіться та <span>навчайтесь</span></h2>
            <p className="section-subtitle">
              Безкоштовні уроки, щоб познайомитись з моїм стилем викладання
            </p>
          </div>

          <div className="videos-grid">
            {videos.map((video, index) => (
              <div 
                key={video.id} 
                className="video-card"
                data-animate="fade-up"
                data-delay={index * 100}
                onClick={() => setActiveVideo(video)}
              >
                <div className="video-card__preview">
                  <img src={video.preview} alt={video.title} />
                  <div className="video-card__play">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="video-card__duration">{video.duration}</span>
                </div>
                <h4 className="video-card__title">{video.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Формат навчання */}
      <section className="study-format">
        <div className="container">
          <div className="format-grid">
            <div className="format-item" data-animate="fade-up">
              <div className="format-icon">📚</div>
              <h3>Теорія</h3>
              <p>Структуровані матеріали, відеоуроки, презентації та робочі зошити</p>
            </div>
            <div className="format-item" data-animate="fade-up" data-delay="100">
              <div className="format-icon">✨</div>
              <h3>Практика</h3>
              <p>Відпрацювання на моделях під моїм особистим контролем</p>
            </div>
            <div className="format-item" data-animate="fade-up" data-delay="200">
              <div className="format-icon">🎯</div>
              <h3>Розбір</h3>
              <p>Детальний аналіз ваших робіт та індивідуальні рекомендації</p>
            </div>
            <div className="format-item" data-animate="fade-up" data-delay="300">
              <div className="format-icon">🏆</div>
              <h3>Результат</h3>
              <p>Сертифікат та готове портфоліо для старту кар'єри</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="study-cta">
        <div className="container">
          <div className="cta-content" data-animate="zoom-in">
            <h2>Почни свою подорож у світ краси</h2>
            <p>Запишись на безкоштовну консультацію та обери свій ідеальний курс</p>
            <div className="cta-buttons">
              <button 
                className="study-btn study-btn--primary study-btn--large"
                onClick={() => openModal()}
              >
                Отримати консультацію
              </button>
              <button 
                className="study-btn study-btn--outline study-btn--large"
                onClick={() => window.location.href = 'tel:+1234567890'}
              >
                Зателефонувати
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Модальне вікно для відео */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setActiveVideo(null)}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '1000px',
            backgroundColor: '#000',
            borderRadius: '10px',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <button style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#c9a27e',
              border: 'none',
              color: '#000',
              fontSize: '20px',
              cursor: 'pointer',
              zIndex: 10
            }} onClick={() => setActiveVideo(null)}>✕</button>
            
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%'
            }}>
              <iframe
                src={activeVideo.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title={activeVideo.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО З ФОРМОЮ */}
      {isModalOpen && (
        <div className="study__modal-overlay" onClick={closeModal}>
          <div className="study__modal" onClick={(e) => e.stopPropagation()}>
            <button className="study__modal-close" onClick={closeModal}>
              <IoClose />
            </button>
            
            <div className="study__modal-header">
              <h3 className="study__modal-title">
                {selectedCourse ? `Запис на курс: ${selectedCourse.title}` : 'Записатись на консультацію'}
              </h3>
              <p className="study__modal-subtitle">
                Заповніть форму і ми зв'яжемось з вами найближчим часом
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="study__modal-form">
              <div className={`study__modal-field ${errors.name ? 'error' : ''}`}>
                <FaUser className="study__modal-field-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  className="study__modal-input"
                />
                <label className="study__modal-label">Ваше ім'я *</label>
                {errors.name && <span className="study__modal-error">{errors.name}</span>}
              </div>

              <div className={`study__modal-field ${errors.email ? 'error' : ''}`}>
                <FaEnvelope className="study__modal-field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  className="study__modal-input"
                />
                <label className="study__modal-label">Email *</label>
                {errors.email && <span className="study__modal-error">{errors.email}</span>}
              </div>

              <div className={`study__modal-field ${errors.phone ? 'error' : ''}`}>
                <FaPhone className="study__modal-field-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  className="study__modal-input"
                />
                <label className="study__modal-label">Телефон (необов'язково)</label>
                {errors.phone && <span className="study__modal-error">{errors.phone}</span>}
              </div>

              <input type="hidden" name="message" value={formData.message} />

              <button 
                type="submit" 
                className="study__modal-submit"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? (
                  <>
                    <span className="study__modal-spinner"></span>
                    Відправка...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="study__modal-submit-icon" />
                    {selectedCourse ? 'Записатись на курс' : 'Отримати консультацію'}
                    <span className="study__modal-submit-glow"></span>
                  </>
                )}
              </button>

              {formStatus.message && (
                <div className={`study__modal-status ${formStatus.success ? 'success' : 'error'}`}>
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