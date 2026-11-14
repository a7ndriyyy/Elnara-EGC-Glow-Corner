import React from "react";
import { FiArrowUpRight, FiClock } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import { toCardProps } from "../../utils/pricing";
import "./ServiceMenu.css";

/**
 * Minimal service menu for the salon page.
 * One group = sticky header on the left (number, title, note, count) and a
 * clean list of services on the right: name, note, duration, price and a
 * "book" arrow. Rows with a photo show a small thumbnail that grows on hover.
 */
export function ServiceGroup({ group, index, onBook }) {
  const { t, language } = useLanguage();

  return (
    <section id={`services-${group.id}`} className="smenu" aria-labelledby={`smenu-${group.id}`}>
      <header className="smenu__head">
        <span className="smenu__index">{String(index + 1).padStart(2, "0")}</span>
        <h3 id={`smenu-${group.id}`} className="smenu__title">{group.title}</h3>
        {group.subtitle && <p className="smenu__note">{group.subtitle}</p>}
        <span className="smenu__count">{group.items.length}</span>
      </header>

      <ul className="smenu__list">
        {group.items.map((service) => {
          const card = toCardProps(service, language, t);
          return (
            <li key={service.slug} className="smenu__item">
              <button type="button" className="smenu__row" onClick={() => onBook(service)}>
                {service.image ? (
                  <img className="smenu__thumb" src={service.image} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="smenu__thumb smenu__thumb--empty" aria-hidden="true" />
                )}
                <span className="smenu__main">
                  <span className="smenu__name">{card.title}</span>
                  {card.description && <span className="smenu__desc">{card.description}</span>}
                </span>
                <span className="smenu__meta">
                  {card.duration && (
                    <span className="smenu__duration"><FiClock aria-hidden="true" /> {card.duration}</span>
                  )}
                  {card.price && <span className="smenu__price">{card.price}</span>}
                </span>
                <span className="smenu__go" aria-hidden="true"><FiArrowUpRight /></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Popular services: large photo tiles with name and price over the image. */
export function PopularTiles({ services, onBook }) {
  const { t, language } = useLanguage();

  return (
    <ul className="ptiles">
      {services.map((service) => {
        const card = toCardProps(service, language, t);
        return (
          <li key={service.slug}>
            <button type="button" className="ptile" onClick={() => onBook(service)}>
              {service.image && <img src={service.image} alt="" loading="lazy" decoding="async" />}
              <span className="ptile__tag">{t("servicesPage.popular")}</span>
              <span className="ptile__body">
                <span className="ptile__name">{card.title}</span>
                <span className="ptile__meta">
                  {[card.duration, card.price].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="ptile__go" aria-hidden="true"><FiArrowUpRight /></span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
