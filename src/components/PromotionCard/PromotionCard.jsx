import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import { fill } from "../../utils/format";
import { formatDayMonth, formatEuro } from "../../utils/promotions";
import "./PromotionCard.css";

/**
 * Promotion / news card (TZ step 9). All admin-entered text is rendered as
 * plain React text (escaped) — never as HTML — so it cannot inject markup.
 */
export default function PromotionCard({ promotion }) {
  const { t, language } = useLanguage();
  const { title, description, image_url: image, type, old_price: oldPrice, new_price: newPrice, end_date: end } = promotion;
  const isNew = type === "new";

  return (
    <article className="promo-card">
      <div className="promo-card__media">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span className="promo-card__placeholder" aria-hidden="true">{title.charAt(0)}</span>
        )}
        <span className={`promo-card__badge${isNew ? " promo-card__badge--new" : ""}`}>
          {isNew ? t("promotions.badgeNew") : t("promotions.badgePromotion")}
        </span>
      </div>

      <div className="promo-card__body">
        <h3 className="promo-card__title">{title}</h3>
        {description && <p className="promo-card__desc">{description}</p>}

        {(oldPrice != null || newPrice != null) && (
          <p className="promo-card__prices">
            {oldPrice != null && (
              <s className="promo-card__old">
                <span className="sr-only">{t("promotions.oldPrice")}: </span>
                {formatEuro(oldPrice, language)}
              </s>
            )}
            {newPrice != null && (
              <span className="promo-card__new">
                <span className="sr-only">{t("promotions.newPrice")}: </span>
                {formatEuro(newPrice, language)}
              </span>
            )}
          </p>
        )}

        <div className="promo-card__footer">
          {end ? (
            <span className="promo-card__until">
              <FiCalendar aria-hidden="true" /> {fill(t("promotions.until"), { date: formatDayMonth(end) })}
            </span>
          ) : <span />}
          <Link to="/booking" className="btn btn--secondary promo-card__cta">{t("promotions.book")}</Link>
        </div>
      </div>
    </article>
  );
}
