import React from "react";
import { FiArrowUpRight, FiMessageCircle, FiPhone } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./SalonPromo.css";

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;

const PHONE = { href: "tel:+33456756578", label: "+33 4 56 75 65 78" };

/**
 * Closing call-to-action on the salon services page: big serif question on
 * the left, three clear actions on the right (online booking, a consultation
 * request, a call) and a strip of her work photos sliding in the background.
 */
export default function SalonCta({ onBook, onConsult }) {
  const { t } = useLanguage();
  const photos = ["Works/brows-powder-1.webp", "Works/lips-watercolor.webp", "Works/eyeliner-shaded.webp", "Works/makeup-bridal.webp"];

  return (
    <section className="salon-cta" aria-labelledby="salon-cta-title">
      <div className="salon-cta__card">
        <div className="salon-cta__photos" aria-hidden="true">
          {photos.map((src) => <img key={src} src={img(src)} alt="" loading="lazy" decoding="async" />)}
        </div>

        <div className="salon-cta__text">
          <p className="salon-cta__eyebrow">{t("salonPromo.ctaEyebrow")}</p>
          <h2 id="salon-cta-title">{t("servicesPage.cta")}</h2>
          <p>{t("salonPromo.ctaText")}</p>
        </div>

        <div className="salon-cta__actions">
          <button type="button" className="salon-cta__main" onClick={onBook}>
            <span>{t("servicesPage.online")}</span>
            <FiArrowUpRight aria-hidden="true" />
          </button>
          <button type="button" className="salon-cta__row" onClick={onConsult}>
            <FiMessageCircle aria-hidden="true" />
            <span>{t("servicesPage.getConsultation")}</span>
            <FiArrowUpRight aria-hidden="true" className="salon-cta__arrow" />
          </button>
          <a className="salon-cta__row" href={PHONE.href}>
            <FiPhone aria-hidden="true" />
            <span>
              <small>{t("salonPromo.call")}</small>
              {PHONE.label}
            </span>
            <FiArrowUpRight aria-hidden="true" className="salon-cta__arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
