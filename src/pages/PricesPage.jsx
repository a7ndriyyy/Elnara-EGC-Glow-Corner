import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiMapPin } from "react-icons/fi";
import "./PricesPage.css";
import { useLanguage } from "../i18n/LanguageContext";
import HoursNotice from "../components/HoursNotice/HoursNotice";
import { priceCategories } from "../data/priceList";
import { bookingLink } from "../data/directions";
import { localize } from "../utils/format";
import { durationLabel, priceLabel } from "../utils/pricing";

/** Prices page — Elnara's official price list (src/data/priceList.js). */
export default function PricesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { t, language } = useLanguage();
  const content = t("pageContent.prices");

  const visible = activeCategory === "all"
    ? priceCategories
    : priceCategories.filter((c) => c.id === activeCategory);

  return (
    <div className="prices-page">
      <section className="prices-hero">
        <div className="container">
          <h1 className="prices-hero__title">{content.title}</h1>
          <p className="prices-hero__subtitle">{content.subtitle}</p>
          <p className="prices-hero__meta">
            <FiMapPin aria-hidden="true" /> {t("priceList.location")} · {t("priceList.byAppointment")}
          </p>
        </div>
      </section>

      <section className="prices-categories">
        <div className="container">
          <div className="categories-wrapper" role="group" aria-label={t("priceList.filtersLabel")}>
            {[{ id: "all", label: t("priceList.all") }, ...priceCategories.map((c) => ({ id: c.id, label: localize(c.title, language) }))].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                aria-pressed={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="prices-list">
        <div className="container">
          {visible.map((category) => (
            <div key={category.id} className="price-group">
              <h2 className="price-group__title">{localize(category.title, language)}</h2>
              <div className="prices-grid">
                {category.items.map((item) => {
                  const duration = durationLabel(item, language);
                  const notes = [
                    item.correction && t("priceList.correctionIncluded"),
                    item.priceKind === "addon" && t("priceList.addonNote"),
                  ].filter(Boolean);
                  return (
                    <div key={item.id} className="price-item">
                      <div className="price-item__info">
                        <h3 className="price-item__name">{localize(item.name, language)}</h3>
                        <span className="price-item__duration">
                          {duration && (<><FiClock aria-hidden="true" /> {duration}</>)}
                          {duration && notes.length > 0 && " · "}
                          {notes.length > 0 && <span className="price-item__note">{notes.join(" · ")}</span>}
                        </span>
                      </div>
                      <div className="price-item__action">
                        <div className="price-item__value">{priceLabel(item, language, t("priceList.from"))}</div>
                        {item.bookable !== false && (
                          <Link className="price-item__book" to={bookingLink({ bookingId: item.id })}>
                            {t("priceList.book")}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {category.note && <p className="price-group__note">{localize(category.note, language)}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Години роботи та доплати (TZ step 7) */}
      <HoursNotice />

      <section className="prices-info">
        <div className="container">
          <div className="info-note">
            <p>{t("priceList.materials")}</p>
            <p>{content.note}</p>
            <p>{content.contact}</p>
            <a href="tel:+33456756578" className="info-phone">+33 4 56 75 65 78</a>
          </div>
        </div>
      </section>
    </div>
  );
}
