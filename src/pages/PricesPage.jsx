import { useState } from "react";
import { Link } from "react-router-dom";
import "./PricesPage.css";

export default function PricesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Категорії послуг
  const categories = [
    { id: "all", name: "Всі послуги" },
    { id: "makeup", name: "Макіяж" },
    { id: "face", name: "Догляд за обличчям" },
    { id: "body", name: "Догляд за тілом" },
    { id: "massage", name: "Масаж" },
    { id: "brows", name: "Брови та вії" }
  ];

  // Всі послуги з цінами - БЕЗ oldPrice, isPopular, isNew
  const services = [
    // Макіяж
    { id: 1, name: "Весільний макіяж", category: "makeup", price: "250", duration: "2 год" },
    { id: 2, name: "Вечірній макіяж", category: "makeup", price: "180", duration: "1.5 год" },
    { id: 3, name: "Денний макіяж", category: "makeup", price: "120", duration: "1 год" },
    { id: 4, name: "Smokey Eyes", category: "makeup", price: "160", duration: "1.5 год" },
    { id: 5, name: "Чоловічий макіяж", category: "makeup", price: "100", duration: "1 год" },
    { id: 6, name: "Пробний макіяж", category: "makeup", price: "80", duration: "1 год" },

    // Догляд за обличчям
    { id: 7, name: "Ультразвукове чищення", category: "face", price: "90", duration: "1 год" },
    { id: 8, name: "Комбіноване чищення", category: "face", price: "120", duration: "1.5 год" },
    { id: 9, name: "RF-ліфтинг обличчя", category: "face", price: "150", duration: "1 год" },
    { id: 10, name: "Мікротокова терапія", category: "face", price: "110", duration: "1 год" },
    { id: 11, name: "Масаж обличчя", category: "face", price: "70", duration: "45 хв" },
    { id: 12, name: "Біоревіталізація", category: "face", price: "350", duration: "1 год" },

    // Догляд за тілом
    { id: 13, name: "LPG масаж всього тіла", category: "body", price: "200", duration: "1 год" },
    { id: 14, name: "LPG масаж живота та стегон", category: "body", price: "150", duration: "45 хв" },
    { id: 15, name: "Кріоліполіз (1 зона)", category: "body", price: "300", duration: "1 год" },
    { id: 16, name: "Антицелюлітне обгортання", category: "body", price: "80", duration: "1 год" },
    { id: 17, name: "RF-ліфтинг тіла", category: "body", price: "180", duration: "1 год" },

    // Масаж
    { id: 18, name: "Класичний масаж спини", category: "massage", price: "70", duration: "45 хв" },
    { id: 19, name: "Загальний масаж тіла", category: "massage", price: "120", duration: "1.5 год" },
    { id: 20, name: "Антицелюлітний масаж", category: "massage", price: "90", duration: "1 год" },
    { id: 21, name: "Лімфодренажний масаж", category: "massage", price: "100", duration: "1 год" },
    { id: 22, name: "Масаж обличчя та шиї", category: "massage", price: "60", duration: "40 хв" },

    // Брови та вії
    { id: 23, name: "Корекція брів", category: "brows", price: "25", duration: "20 хв" },
    { id: 24, name: "Фарбування брів", category: "brows", price: "20", duration: "15 хв" },
    { id: 25, name: "Корекція + фарбування", category: "brows", price: "40", duration: "35 хв" },
    { id: 26, name: "Ламінування брів", category: "brows", price: "60", duration: "1 год" },
    { id: 27, name: "Фарбування вій", category: "brows", price: "15", duration: "15 хв" },
    { id: 28, name: "Ламінування вій", category: "brows", price: "55", duration: "1 год" }
  ];

  // Фільтрація послуг
  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="prices-page">
      {/* Hero секція - мінімалістична */}
      <section className="prices-hero">
        <div className="container">
          <h1 className="prices-hero__title">Ціни на послуги</h1>
          <p className="prices-hero__subtitle">
            Обирайте процедури, які підходять саме вам
          </p>
        </div>
      </section>

      {/* Категорії */}
      <section className="prices-categories">
        <div className="container">
          <div className="categories-wrapper">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Список цін */}
      <section className="prices-list">
        <div className="container">
          <div className="prices-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="price-item">
                <div className="price-item__info">
                  <h3 className="price-item__name">{service.name}</h3>
                  <span className="price-item__duration">{service.duration}</span>
                </div>
                <div className="price-item__value">
                  {service.price} €
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="no-services">
              <p>В цій категорії поки немає послуг</p>
            </div>
          )}
        </div>
      </section>

      {/* Додаткова інформація - проста */}
      <section className="prices-info">
        <div className="container">
          <div className="info-note">
            <p>* Вартість може змінюватись залежно від складності та використаних матеріалів</p>
            <p>Для уточнення деталей та запису:</p>
            <a href="tel:+33456756578" className="info-phone">+33 4 56 75 65 78</a>
          </div>
        </div>
      </section>
    </div>
  );
}