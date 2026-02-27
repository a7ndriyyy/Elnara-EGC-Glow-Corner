import { useState} from "react";
import { Link } from "react-router-dom";
import "./ServicesPage.css";

// Імпорт зображень (замініть на свої)
import makeupBridal from "../../public/Images/ImagesServices/makeup-brida.webp";
import makeupEvening from "../../public/Images/ImagesServices/makeup-evening.webp";
import makeupDay from "../../public/Images/ImagesServices/makeup-day.webp";
import makeupSmokey from "../../public/Images/ImagesServices/makeup-smokey.webp";
import servicesHero from "../../public/Images/ImagesServices/services-hero.webp";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Дані про послуги - ВСЕ ВИПРАВЛЕНО
  const services = [
    {
      id: 1,
      name: "Весільний макіяж",
      nameEn: "Bridal Makeup",
      category: "bridal",
      price: "250",
      duration: "2 години",
      description: "Ідеальний весільний образ, який протримається весь день. Використовуємо професійну косметику преміум-класу.",
      longDescription: "Створюємо ніжний та романтичний образ, який підкреслить вашу природну красу. Пробний макіяж включено у вартість. Використовуємо виключно водостійку косметику преміальних брендів.",
      image: makeupBridal,
      features: [
        "Пробний макіяж за 1-2 тижні",
        "Водостійка косметика",
        "Стійкість 12+ годин",
        "Накладні вії в подарунок",
        "Фіксація образу"
      ],
      brands: ["Dior", "Chanel", "Tom Ford", "Charlotte Tilbury"],
      popular: true
    },
    {
      id: 2,
      name: "Вечірній макіяж",
      nameEn: "Evening Makeup",
      category: "evening",
      price: "180",
      duration: "1.5 години",
      description: "Яскравий та виразний макіяж для особливих подій, вечірок та святкувань.",
      longDescription: "Від чуттєвого смокі айс до сяючих образів з акцентом на очах або губах. Створимо образ, який привертає увагу і тримається всю ніч.",
      image: makeupEvening,
      features: [
        "Індивідуальний підбір кольорів",
        "Стійкість 8+ годин",
        "Скульптурування обличчя",
        "Накладні вії включено",
        "Корекція брів"
      ],
      brands: ["MAC", "Huda Beauty", "Anastasia", "Fenty Beauty"],
      popular: true
    },
    {
      id: 3,
      name: "Денний макіяж",
      nameEn: "Day Makeup",
      category: "day",
      price: "120",
      duration: "1 година",
      description: "Натуральний та свіжий макіяж для щоденного виходу, ділових зустрічей та побачень.",
      longDescription: "Макіяж в стилі 'nude' та 'no-makeup makeup'. Підкреслюємо природну красу, вирівнюємо тон, додаємо свіжості. Ідеально для офісу та повсякденного життя.",
      image: makeupDay,
      features: [
        "Ідеальний тон шкіри",
        "Натуральне сяйво",
        "Догляд перед макіяжем",
        "SPF захист",
        "Фіксація брів"
      ],
      brands: ["Chanel", "Laura Mercier", "Kosas", "RMS Beauty"],
      popular: false
    },
    {
      id: 4,
      name: "Smokey Eyes",
      nameEn: "Smokey Eyes",
      category: "evening",
      price: "160",
      duration: "1.5 години",
      description: "Класичний та сучасний смокі айс в будь-якій кольоровій гамі.",
      longDescription: "Інтенсивний погляд з ефектом димки. Виконуємо як класичний чорно-сірий, так і кольорові варіанти (синій, зелений, винний, графітовий).",
      image: makeupSmokey,
      features: [
        "Ідеальна розтушовка",
        "Будь-яка кольорова гама",
        "Корекція форми очей",
        "Накладні вії",
        "Стійкість 8+ годин"
      ],
      brands: ["Urban Decay", "Natasha Denona", "Pat McGrath"],
      popular: false
    },
    {
      id: 5,
      name: "Корекція та фарбування брів",
      nameEn: "Brows Shaping",
      category: "brows",
      price: "80",
      duration: "45 хвилин",
      description: "Професійна корекція, фарбування та ламінування брів.",
      longDescription: "Створюємо ідеальну форму брів, яка підходить саме вам. Фарбування хною або фарбою, ламінування, ботокс для брів.",
      image: makeupDay, // Замініть на фото брів
      features: [
        "Корекція пінцетом/воском",
        "Фарбування хною/фарбою",
        "Ламінування брів",
        "Ботокс для брів",
        "Догляд після процедури"
      ],
      brands: ["Levissime", "Adonia", "Concept"],
      popular: false
    }
  ];

  // Фільтрація послуг
  const filteredServices = activeFilter === "all" 
    ? services 
    : services.filter(s => s.category === activeFilter);

  const popularServices = services.filter(s => s.popular);

  return (
    <div className="services-page">
      {/* Hero секція */}
      <section className="services-hero">
        <div className="services-hero__bg">
          <img src={servicesHero} alt="Elnara Beauty Salon" />
          <div className="services-hero__overlay"></div>
        </div>
        
        <div className="services-hero__content">
          <h1 className="services-hero__title">
            Салон краси
            <span>Elnara</span>
          </h1>
          <p className="services-hero__subtitle">
            Професійний макіяж для вашого ідеального образу. 
            Працюємо з преміальною косметикою та індивідуальним підходом.
          </p>
          <div className="services-hero__buttons">
            <a href="#services" className="btn btn--primary">
              Всі послуги
            </a>
            <Link to="/contact" className="btn btn--outline">
              Записатись
            </Link>
          </div>
        </div>
      </section>

      {/* Чому ми */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card" data-aos="fade-up">
              <div className="feature-card__icon">💄</div>
              <h3>Преміальна косметика</h3>
              <p>Працюємо тільки з люксовими брендами: Dior, Chanel, Tom Ford, Charlotte Tilbury</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="100">
              <div className="feature-card__icon">✨</div>
              <h3>Стерильність</h3>
              <p>Одноразові інструменти, дезінфекція всіх поверхонь після кожного клієнта</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="200">
              <div className="feature-card__icon">🎓</div>
              <h3>Досвід 15+ років</h3>
              <p>Міжнародні сертифікати, робота з Vogue, Elle, Harper's Bazaar</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-delay="300">
              <div className="feature-card__icon">💎</div>
              <h3>Індивідуальний підхід</h3>
              <p>Кожен макіяж створюється з урахуванням ваших особливостей та побажань</p>
            </div>
          </div>
        </div>
      </section>

      {/* Популярні послуги */}
      <section className="popular">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Популярне</span>
            <h2 className="section-title">Найзатребуваніші <span>послуги</span></h2>
          </div>

          <div className="popular__grid">
            {popularServices.map((service) => (
              <div 
                key={service.id} 
                className="popular-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="popular-card__image">
                  <img src={service.image} alt={service.name} />
                  <span className="popular-card__badge">Популярне</span>
                </div>
                <div className="popular-card__content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="popular-card__footer">
                    <div>
                      <span className="popular-card__duration">{service.duration}</span>
                      <span className="popular-card__price">{service.price} €</span>
                    </div>
                    <button className="popular-card__btn">
                      Детальніше →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Всі послуги */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Наші послуги</span>
            <h2 className="section-title">Оберіть свій <span>ідеальний образ</span></h2>
          </div>

          {/* Фільтри */}
          <div className="services__filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Всі послуги
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'bridal' ? 'active' : ''}`}
              onClick={() => setActiveFilter('bridal')}
            >
              Весільний
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'evening' ? 'active' : ''}`}
              onClick={() => setActiveFilter('evening')}
            >
              Вечірній
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'day' ? 'active' : ''}`}
              onClick={() => setActiveFilter('day')}
            >
              Денний
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'brows' ? 'active' : ''}`}
              onClick={() => setActiveFilter('brows')}
            >
              Брови
            </button>
          </div>

          {/* Сітка послуг */}
          <div className="services__grid">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-card__image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-card__content">
                  <h3>{service.name}</h3>
                  <p className="service-card__name-en">{service.nameEn}</p>
                  <div className="service-card__details">
                    <span className="service-card__duration">{service.duration}</span>
                    <span className="service-card__price">{service.price} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Як ми працюємо */}
      <section className="process">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Як ми працюємо</span>
            <h2 className="section-title">Ваш шлях до <span>ідеального образу</span></h2>
          </div>

          <div className="process__steps">
            <div className="process-step">
              <div className="process-step__number">01</div>
              <div className="process-step__content">
                <h3>Консультація</h3>
                <p>Обговорюємо ваші побажання, особливості шкіри, вибираємо стиль макіяжу</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">02</div>
              <div className="process-step__content">
                <h3>Підготовка шкіри</h3>
                <p>Очищення, зволоження, праймер - все для ідеальної основи</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">03</div>
              <div className="process-step__content">
                <h3>Створення макіяжу</h3>
                <p>Професійне нанесення з урахуванням ваших особливостей</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-step__number">04</div>
              <div className="process-step__content">
                <h3>Фіксація та поради</h3>
                <p>Закріплюємо макіяж, даємо рекомендації по догляду</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2>Готові до перетворення?</h2>
            <p>Запишіться на макіяж прямо зараз та отримайте знижку 10% на перше відвідування</p>
            <div className="cta__buttons">
              <Link to="/contact" className="btn btn--primary btn--large">
                Записатись онлайн
              </Link>
              <a href="tel:+33456756578" className="btn btn--outline btn--large">
                +33 4 56 75 65 78
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Модальне вікно */}
      {selectedService && (
        <div className="modal" onClick={() => setSelectedService(null)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setSelectedService(null)}>×</button>
            
            <div className="modal__grid">
              <div className="modal__image">
                <img src={selectedService.image} alt={selectedService.name} />
              </div>
              
              <div className="modal__info">
                <h2>{selectedService.name}</h2>
                <p className="modal__name-en">{selectedService.nameEn}</p>
                
                <div className="modal__price-info">
                  <span className="modal__price">{selectedService.price} €</span>
                  <span className="modal__duration">{selectedService.duration}</span>
                </div>
                
                <p className="modal__description">{selectedService.longDescription}</p>
                
                <div className="modal__features">
                  <h3>Що входить:</h3>
                  <ul>
                    {selectedService.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="modal__brands">
                  <h3>Використовуємо бренди:</h3>
                  <div className="brand-tags">
                    {selectedService.brands.map((brand, i) => (
                      <span key={i} className="brand-tag">{brand}</span>
                    ))}
                  </div>
                </div>
                
                <Link to="/contact" className="btn btn--primary modal__btn">
                  Записатись на цю послугу
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}