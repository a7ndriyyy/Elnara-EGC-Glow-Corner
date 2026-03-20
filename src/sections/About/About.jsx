import React from 'react';
import { useEffect, useRef, useState, useCallback } from "react";
import { aboutData } from "../../data/about";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { GiSparkles } from "react-icons/gi";
import "./About.css";

export default function About() {
  const textRef = useRef([]);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [imageHovered, setImageHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(aboutData.images.main);
  const sectionRef = useRef(null);

  // Мапа соціальних іконок
  const socialIcons = {
    fb: FaFacebookF,
    yt: FaYoutube,
    ig: FaInstagram,
    x: FaTwitter,
    web: FaGlobe
  };

  // Генерація частинок в useEffect (виправляє помилку з Math.random)
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

  // Ефект для появи тексту
  useEffect(() => {
    textRef.current.forEach((el, idx) => {
      if (!el) return;
      setTimeout(() => el.classList.add("fade-in"), idx * 200);
    });
  }, []);

  // Ефект для відстеження миші
  const handleMouseMove = useCallback((e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y))
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Зміна зображення при наведенні
  const handleImageHover = () => {
    setImageHovered(true);
    // Випадкове зображення з доступних
    const images = Object.values(aboutData.images);
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentImage(images[randomIndex]);
  };

  const handleImageLeave = () => {
    setImageHovered(false);
    setCurrentImage(aboutData.images.main);
  };

  return (
    <section id="about" className="about" ref={sectionRef}>
      {/* Фон з частинками */}
      <div className="about__background">
        <div 
          className="about__gradient"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(201, 162, 126, 0.15) 0%, 
              rgba(10, 10, 10, 0.98) 70%)`
          }}
        />
        <div className="about__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="about__particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                filter: `blur(${p.blur}px)`,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Декоративні елементи */}
      <div className="about__decor">
        <div className="about__decor-circle"></div>
        <div className="about__decor-line"></div>
      </div>

      <div className="about__container">
        <div className="about__content">
          {/* Заголовок з ефектом */}
          <div className="about__header">
            <span className="about__subtitle">
              <BsStars className="about__subtitle-icon" />
              Наша історія
            </span>
            <h2 className="about__title">
              <span className="about__title-text">{aboutData.title}</span>
              <GiSparkles className="about__title-icon" />
            </h2>
          </div>

          {/* Текст з анімацією */}
          <div className="about__text">
            {aboutData.text.map((p, idx) => (
              <p 
                key={idx} 
                className="about__paragraph"
                ref={(el) => (textRef.current[idx] = el)}
              >
                {p}
              </p>
            ))}
          </div>

          {/* Соціальні мережі з React Icons */}
          <div className="about__socials">
            <span className="about__socials-title">Слідкуй за нами</span>
            <div className="about__socials-grid">
              {aboutData.socials.map((social) => {
                const Icon = social.icon || socialIcons[social.id];
                return (
                  <a
                    key={social.id}
                    className="about__social"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <Icon className="about__social-icon" />
                    <span className="about__social-glow"></span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Зображення з ефектами */}
        <div 
          className={`about__image-wrapper ${imageHovered ? 'hovered' : ''}`}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        >
          <div className="about__image-container">
            <img 
              src={currentImage} 
              alt={aboutData.name}
              className="about__image"
            />
            
            {/* Оверлей з градієнтом */}
            <div className="about__image-overlay"></div>
            
            {/* Інформація про майстра */}
            <div className="about__person">
              <div className="about__person-info">
                <h3 className="about__person-name">{aboutData.name}</h3>
                <p className="about__person-role">{aboutData.role}</p>
              </div>
              <div className="about__person-decoration">
                <GiSparkles />
              </div>
            </div>

            {/* Блики на зображенні */}
            <div className="about__image-shine"></div>
          </div>

          {/* Декоративна рамка */}
          <div className="about__image-frame"></div>
          <div className="about__image-frame2"></div>
        </div>
      </div>
    </section>
  );
}