import React from 'react';
import { useEffect, useRef, useState } from "react";
import { highlights } from "../../data/highlights";
import { MdVerified} from "react-icons/md";
import { GiDiploma, GiAchievement, GiStarMedal } from "react-icons/gi";
import { FaRegHandshake, FaRegHeart } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import "./ProfileHighlights.css";

export default function ProfileHighlights() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Мапа іконок
  const iconMap = {
    GiDiploma: GiDiploma,
    GiAchievement: GiAchievement,
    GiStarMedal: GiStarMedal
  };

  // Генерація частинок
 const [particles, setParticles] = useState([]);
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

  // Ефект для відстеження миші
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

  // Анімація появи карток
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("highlights__card--visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="highlights" className="highlights" ref={sectionRef}>
      {/* Фон з частинками */}
      <div className="highlights__background">
        <div 
          className="highlights__gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(201, 162, 126, 0.12) 0%, 
              rgba(248, 244, 240, 0.98) 70%)`
          }}
        />
        <div className="highlights__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="highlights__particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Декоративні лінії */}
      <div className="highlights__lines">
        <div className="highlights__line highlights__line--1"></div>
        <div className="highlights__line highlights__line--2"></div>
        <div className="highlights__line highlights__line--3"></div>
      </div>

      <div className="container">
        {/* Заголовок секції */}
        <div className="highlights__header">
          <span className="highlights__subtitle">
            <BsStars className="highlights__subtitle-icon" />
            Чому обирають нас
          </span>
          <h2 className="highlights__title">
            Наші <span className="highlights__title-highlight">переваги</span>
          </h2>
        </div>

        {/* Сітка карток */}
        <div className="highlights__grid">
          {highlights.map((h, index) => {
            const IconComponent = iconMap[h.icon.name] || GiDiploma;
            
            return (
              <div
                key={h.id}
                className="highlights__card"
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ 
                  transitionDelay: `${index * 0.15}s`,
                  '--card-color': h.color 
                }}
              >
                {/* Декоративний фон картки */}
                <div className="highlights__card-bg">
                  <div className="highlights__card-bg-shape"></div>
                </div>

                {/* Іконка з ефектом */}
                <div className="highlights__card-icon-wrapper">
                  <div className="highlights__card-icon-glow"></div>
                  <IconComponent className="highlights__card-icon" />
                </div>

                {/* Контент */}
                <div className="highlights__card-content">
                  <h3 className="highlights__card-title">{h.title}</h3>
                  <p className="highlights__card-text">{h.text}</p>
                </div>

                {/* Бейдж */}
                <div className="highlights__card-badge">
                  <MdVerified className="highlights__card-badge-icon" />
                  <span>{h.badge}</span>
                </div>

                {/* Статистика */}
                <div className="highlights__card-stats">
                  <div className="highlights__card-stat">
                    <span className="highlights__card-stat-value">{h.stats}</span>
                  </div>
                </div>

                {/* Декоративний елемент */}
                <div className="highlights__card-decor"></div>

                {/* Ефект при наведенні */}
                <div className={`highlights__card-overlay ${activeCard === index ? 'active' : ''}`}>
                  <FaRegHandshake className="highlights__card-overlay-icon" />
                  <span>Дізнатись більше</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Додаткова інформація */}
        <div className="highlights__footer">
          <div className="highlights__footer-content">
            <FaRegHeart className="highlights__footer-icon" />
            <p className="highlights__footer-text">
              Кожен клієнт отримує індивідуальний підхід та турботу
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}