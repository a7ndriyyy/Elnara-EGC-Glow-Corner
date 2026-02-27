import { useState } from "react";
import { Link } from "react-router-dom";
import "./EquipmentPage.css";

// Імпорт зображень
import equipmentHero from "../../public/Images/ImageEquipment/equipment-hero.webp";
import machine1 from "../../public/Images/ImageEquipment/machine1.webp";

export default function EquipmentPage() {
  const [selectedMachine, setSelectedMachine] = useState(null);

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
            <Link to="/contact" className="btn btn--outline">
              Консультація
            </Link>
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
                  <Link to="/contact" className="btn btn--outline">
                    Записатись
                  </Link>
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
              <Link to="/contact" className="btn btn--primary btn--large">
                Записатись
              </Link>
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
            <Link to="/contact" className="btn btn--primary">
              Записатись
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}