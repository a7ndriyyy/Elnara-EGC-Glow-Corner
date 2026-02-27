import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Hero.css";

// Імпорт зображень (якщо вони є в public)
import aboutImg from "/Images/EGC-card.jpeg";
import servicesImg from "/Images/EGC-card.jpeg";
import equipmentImg from "/Images/EGC-card.jpeg";
import pricesImg from "/Images/EGC-card.jpeg";

const heroItems = [
  { 
    id: 1, 
    title: "Про нас", 
    subtitle: "Історія та філософія",
    path: "/about", 
    image: aboutImg,
    color: "#c9a27e"
  },
  { 
    id: 2, 
    title: "Салон краси", 
    subtitle: "Наші послуги",
    path: "/services", 
    image: servicesImg,
    color: "#b58d6a"
  },
  { 
    id: 3, 
    title: "Обладнання", 
    subtitle: "Професійна техніка",
    path: "/equipment", 
    image: equipmentImg,
    color: "#a0785a"
  },
  { 
    id: 4, 
    title: "Ціни", 
    subtitle: "Вартість послуг",
    path: "/prices", 
    image: pricesImg,
    color: "#8e6b4e"
  },
];

export default function Hero() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero">
      {/* Фоновий градієнт */}
      <div className="hero__background">
        <div className="hero__gradient"></div>
        <div className="hero__particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="hero__particle"></span>
          ))}
        </div>
      </div>

      <div className="hero__container">
        {/* Заголовок з анімацією */}
        <div className="hero__header">
          <span className="hero__badge">Elnara Beauty</span>
          <h1 className="hero__title">
            Мистецтво краси
            <span>з душею</span>
          </h1>
          <p className="hero__subtitle">
            Відкрийте для себе світ професійного макіяжу та догляду
          </p>
        </div>

        {/* Сітка карток */}
        <div className="hero__grid">
          {heroItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className="hero__card"
              ref={(el) => (cardsRef.current[index] = el)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="hero__card-inner">
                <div className="hero__card-image">
                  <img src={item.image} alt={item.title} />
                  <div 
                    className="hero__card-overlay"
                    style={{ background: `linear-gradient(135deg, ${item.color}80, #0a0a0a)` }}
                  ></div>
                </div>
                
                <div className="hero__card-content">
                  <span className="hero__card-number">0{item.id}</span>
                  <h2 className="hero__card-title">{item.title}</h2>
                  <p className="hero__card-subtitle">{item.subtitle}</p>
                  
                  <div className="hero__card-link">
                    <span>Дізнатись більше</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Декоративний елемент */}
                <div className="hero__card-decoration">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Скрол індикатор */}
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line"></div>
        </div>
      </div>
    </section>
  );
}