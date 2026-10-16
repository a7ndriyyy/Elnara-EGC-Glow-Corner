import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import "./PricesPage.css";
import { useLanguage } from "../i18n/LanguageContext";

export default function PricesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useLanguage();
  const translations = t("prices");
  const formatDuration = (duration) => {
    const hours = duration.match(/([0-9]+(?:\\.[0-9]+)?)\\s*год/);
    const minutes = duration.match(/([0-9]+)\\s*хв/);
    if (hours) return hours[1] + " " + translations.durationHour;
    if (minutes) return minutes[1] + " " + translations.durationMinute;
    return duration;
  };

  const categories = [
    { id: "all", name: translations.all },
    { id: "makeup", name: translations.makeup },
    { id: "face", name: translations.face },
    { id: "body", name: translations.body },
    { id: "massage", name: translations.massage },
    { id: "brows", name: translations.brows }
  ];

  // Existing prices and durations are preserved; names come from the language dictionary.
  // Всі послуги з цінами - БЕЗ oldPrice, isPopular, isNew
  const services = [
    // Макіяж
    { id: 1, name: translations.services[0], category: "makeup", price: "250", duration: "2 год" },
    { id: 2, name: translations.services[1], category: "makeup", price: "180", duration: "1.5 год" },
    { id: 3, name: translations.services[2], category: "makeup", price: "120", duration: "1 год" },
    { id: 4, name: translations.services[3], category: "makeup", price: "160", duration: "1.5 год" },
    { id: 5, name: translations.services[4], category: "makeup", price: "100", duration: "1 год" },
    { id: 6, name: translations.services[5], category: "makeup", price: "80", duration: "1 год" },

    // Догляд за обличчям
    { id: 7, name: translations.services[6], category: "face", price: "90", duration: "1 год" },
    { id: 8, name: translations.services[7], category: "face", price: "120", duration: "1.5 год" },
    { id: 9, name: translations.services[8], category: "face", price: "150", duration: "1 год" },
    { id: 10, name: translations.services[9], category: "face", price: "110", duration: "1 год" },
    { id: 11, name: translations.services[10], category: "face", price: "70", duration: "45 хв" },
    { id: 12, name: translations.services[11], category: "face", price: "350", duration: "1 год" },

    // Догляд за тілом
    { id: 13, name: translations.services[12], category: "body", price: "200", duration: "1 год" },
    { id: 14, name: translations.services[13], category: "body", price: "150", duration: "45 хв" },
    { id: 15, name: translations.services[14], category: "body", price: "300", duration: "1 год" },
    { id: 16, name: translations.services[15], category: "body", price: "80", duration: "1 год" },
    { id: 17, name: translations.services[16], category: "body", price: "180", duration: "1 год" },

    // Масаж
    { id: 18, name: translations.services[17], category: "massage", price: "70", duration: "45 хв" },
    { id: 19, name: translations.services[18], category: "massage", price: "120", duration: "1.5 год" },
    { id: 20, name: translations.services[19], category: "massage", price: "90", duration: "1 год" },
    { id: 21, name: translations.services[20], category: "massage", price: "100", duration: "1 год" },
    { id: 22, name: translations.services[21], category: "massage", price: "60", duration: "40 хв" },

    // Брови та вії
    { id: 23, name: translations.services[22], category: "brows", price: "25", duration: "20 хв" },
    { id: 24, name: translations.services[23], category: "brows", price: "20", duration: "15 хв" },
    { id: 25, name: translations.services[24], category: "brows", price: "40", duration: "35 хв" },
    { id: 26, name: translations.services[25], category: "brows", price: "60", duration: "1 год" },
    { id: 27, name: translations.services[26], category: "brows", price: "15", duration: "15 хв" },
    { id: 28, name: translations.services[27], category: "brows", price: "55", duration: "1 год" }
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
          <h1 className="prices-hero__title">{translations.title}</h1>
          <p className="prices-hero__subtitle">
            {translations.subtitle}
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
                  <span className="price-item__duration">{formatDuration(service.duration)}</span>
                </div>
                <div className="price-item__value">
                  {service.price} €
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="no-services">
              <p>{translations.empty}</p>
            </div>
          )}
        </div>
      </section>

      {/* Додаткова інформація - проста */}
      <section className="prices-info">
        <div className="container">
          <div className="info-note">
            <p>{translations.disclaimer}</p>
            <p>{translations.contact}</p>
            <a href="tel:+33456756578" className="info-phone">+33 4 56 75 65 78</a>
          </div>
        </div>
      </section>
    </div>
  );
}