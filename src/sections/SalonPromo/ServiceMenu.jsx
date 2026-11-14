import React from "react";
import { FiArrowUpRight, FiClock } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import { toCardProps } from "../../utils/pricing";
import "./ServiceMenu.css";

/**
 * Salon service group: a simple header (number, title, note, count) and a
 * grid of clean, large cards — photo on top (or a quiet typographic panel
 * when there is no photo yet), name, note, time and price. Hovering a card
 * lifts it while the others step back, so the eye lands on one service.
 */
export function ServiceGroup({ group, index, onBook }) {
  const { t, language } = useLanguage();

  return (
    <section id={`services-${group.id}`} className="sgroup" aria-labelledby={`sgroup-${group.id}`}>
      <header className="sgroup__head">
        <span className="sgroup__index">{String(index + 1).padStart(2, "0")}</span>
        <h3 id={`sgroup-${group.id}`} className="sgroup__title">{group.title}</h3>
        <span className="sgroup__count">{group.items.length}</span>
        {group.subtitle && <p className="sgroup__note">{group.subtitle}</p>}
      </header>

      <ul className="scards">
        {group.items.map((service) => {
          const card = toCardProps(service, language, t);
          return (
            <li key={service.slug}>
              <button type="button" className="scard" onClick={() => onBook(service)}>
                <span className={`scard__media${service.image ? "" : " scard__media--empty"}`}>
                  {service.image ? (
                    <img src={service.image} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="scard__initial" aria-hidden="true">{card.title.charAt(0)}</span>
                  )}
                </span>
                <span className="scard__body">
                  <span className="scard__name">{card.title}</span>
                  {card.description && <span className="scard__desc">{card.description}</span>}
                  <span className="scard__foot">
                    <span className="scard__meta">
                      {card.duration && <span><FiClock aria-hidden="true" /> {card.duration}</span>}
                      {card.price && <strong>{card.price}</strong>}
                    </span>
                    <span className="scard__go" aria-hidden="true"><FiArrowUpRight /></span>
                  </span>
                </span>
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
