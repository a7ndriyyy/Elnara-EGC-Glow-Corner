import { useState, useRef, useEffect } from "react"; // useRef ТУТ!
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube,
  FaPaperPlane, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import emailjs from '@emailjs/browser'; // імпорт emailjs
import { contactData } from "../../data/contact";
import "./ContactsForm.css";

export default function ContactsForm() {
  // ВСІ ХУКИ - ВСЕРЕДИНІ КОМПОНЕНТА!
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    loading: false
  });

  const [errors, setErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState([]);
  
  const sectionRef = useRef(null);
  const formRef = useRef(null); // ← ОСЬ ТУТ ПРАВИЛЬНО!


  // Генерація частинок
   useEffect(() => {
  // Використовуємо setTimeout для безпечного виклику
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

  // Відстеження миші
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y))
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    
    if (!formData.message.trim()) {
      newErrors.message = "Повідомлення обов'язкове";
    } else if (formData.message.length < 10) {
      newErrors.message = "Мінімум 10 символів";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обробка відправки форми - ТУТ ТВІЙ КОД!
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      formRef.current.classList.add("contact__form--error");
      setTimeout(() => {
        formRef.current.classList.remove("contact__form--error");
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
        
        setFormData({ name: "", email: "", phone: "", message: "" });
        
        formRef.current.classList.add("contact__form--success");
        setTimeout(() => {
          formRef.current.classList.remove("contact__form--success");
        }, 1000);
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

  // Дзвінок
  const handleCall = () => {
    window.location.href = `tel:${contactData.phone.replace(/\s/g, '')}`;
  };

  // Відкриття карти
  const handleMap = () => {
    window.open(contactData.mapLink, '_blank');
  };

  return (
    <section id="contactform" className="contactform" ref={sectionRef}>
      {/* Фон з частинками */}
      <div className="contact__background">
        <div 
          className="contact__gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(201, 162, 126, 0.12) 0%, 
              rgba(248, 244, 240, 0.98) 70%)`
          }}
        />
        <div className="contact__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="contact__particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Декоративні елементи */}
      <div className="contact__decor">
        <div className="contact__decor-circle"></div>
        <div className="contact__decor-line"></div>
      </div>

      <div className="container contact__container">
        {/* Заголовок */}
        <div className="contact__header">
          <span className="contact__subtitle">
            <BsStars className="contact__subtitle-icon" />
            {contactData.subtitle}
          </span>
          <h2 className="contact__title">{contactData.title}</h2>
        </div>

        <div className="contact__grid">
          {/* Ліва частина - інформація */}
          <div className="contact__info">
            {/* Телефон */}
            <div className="contact__info-card" onClick={handleCall}>
              <div className="contact__info-icon-wrapper">
                <FaPhone className="contact__info-icon" />
                <span className="contact__info-glow"></span>
              </div>
              <div className="contact__info-content">
                <h3 className="contact__info-title">Телефон</h3>
                <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="contact__info-text">
                  {contactData.phoneDisplay}
                </a>
                <span className="contact__info-action">Натисніть щоб зателефонувати →</span>
              </div>
            </div>

            {/* Email */}
            <div className="contact__info-card">
              <div className="contact__info-icon-wrapper">
                <FaEnvelope className="contact__info-icon" />
                <span className="contact__info-glow"></span>
              </div>
              <div className="contact__info-content">
                <h3 className="contact__info-title">Email</h3>
                <a href={`mailto:${contactData.email}`} className="contact__info-text">
                  {contactData.email}
                </a>
                <span className="contact__info-action">Надіслати листа →</span>
              </div>
            </div>

            {/* Адреса */}
            <div className="contact__info-card" onClick={handleMap}>
              <div className="contact__info-icon-wrapper">
                <FaMapMarkerAlt className="contact__info-icon" />
                <span className="contact__info-glow"></span>
              </div>
              <div className="contact__info-content">
                <h3 className="contact__info-title">Адреса</h3>
                <p className="contact__info-text">{contactData.location}</p>
                <span className="contact__info-action">Відкрити на карті →</span>
              </div>
            </div>

            {/* Години роботи */}
            <div className="contact__hours">
              <h3 className="contact__hours-title">Години роботи</h3>
              {contactData.workingHours.map((item, idx) => (
                <div key={idx} className="contact__hours-item">
                  <span className="contact__hours-days">{item.days}</span>
                  <span className="contact__hours-time">{item.hours}</span>
                </div>
              ))}
            </div>

            {/* Соціальні мережі */}
            <div className="contact__socials">
              <h3 className="contact__socials-title">Слідкуйте за нами</h3>
              <div className="contact__socials-grid">
                {contactData.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social"
                    aria-label={social.label}
                  >
                    {social.icon === "FaFacebookF" && <FaFacebookF />}
                    {social.icon === "FaTwitter" && <FaTwitter />}
                    {social.icon === "FaInstagram" && <FaInstagram />}
                    {social.icon === "FaYoutube" && <FaYoutube />}
                    <span className="contact__social-glow"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Права частина - форма */}
          <div className="contact__form-wrapper">
            <div className="contact__form-container">
              <h3 className="contact__form-title">Надіслати повідомлення</h3>
              <p className="contact__form-subtitle">
                Заповніть форму і ми зв'яжемось з вами найближчим часом
              </p>

              {/* ТУТ ФОРМА З REF! */}
              <form ref={formRef} onSubmit={handleSubmit} className="contact__form">
                {/* Поле імені */}
                <div className={`contact__field ${errors.name ? 'error' : ''}`}>
                  <input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    className="contact__input"
                  />
                  <label className="contact__label">Ваше ім'я *</label>
                  {errors.name && <span className="contact__error">{errors.name}</span>}
                </div>

                {/* Поле email */}
                <div className={`contact__field ${errors.email ? 'error' : ''}`}>
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className="contact__input"
                  />
                  <label className="contact__label">Email *</label>
                  {errors.email && <span className="contact__error">{errors.email}</span>}
                </div>

                {/* Поле телефону */}
                <div className={`contact__field ${errors.phone ? 'error' : ''}`}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                    className="contact__input"
                  />
                  <label className="contact__label">Телефон (необов'язково)</label>
                  {errors.phone && <span className="contact__error">{errors.phone}</span>}
                </div>

                {/* Поле повідомлення */}
                <div className={`contact__field contact__field--textarea ${errors.message ? 'error' : ''}`}>
                  <textarea
                    name="message"
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    className="contact__textarea"
                    rows="5"
                  />
                  <label className="contact__label">Повідомлення *</label>
                  {errors.message && <span className="contact__error">{errors.message}</span>}
                </div>

                {/* Кнопка відправки */}
                <button 
                  type="submit" 
                  className="contact__submit"
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? (
                    <>
                      <span className="contact__submit-spinner"></span>
                      Відправка...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="contact__submit-icon" />
                      Надіслати повідомлення
                      <span className="contact__submit-glow"></span>
                    </>
                  )}
                </button>

                {/* Статус повідомлення */}
                {formStatus.message && (
                  <div className={`contact__status ${formStatus.success ? 'success' : 'error'}`}>
                    {formStatus.success ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>{formStatus.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}