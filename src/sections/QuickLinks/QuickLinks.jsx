import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiTag, FiGift, FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./QuickLinks.css";

// Three large menu tiles right under the hero: booking, prices, promotions.
const tiles = [
  { id: "booking", to: "/booking", icon: FiCalendar },
  { id: "prices", to: "/prices", icon: FiTag },
  { id: "promotions", to: "/promotions", icon: FiGift },
];

export default function QuickLinks() {
  const { t } = useLanguage();

  return (
    <section className="qlinks" aria-label={t("tiles.label")}>
      <ul className="qlinks__grid">
        {tiles.map(({ id, to, icon }) => (
          <li key={id}>
            <Link to={to} className="qlinks__tile">
              <span className="qlinks__icon" aria-hidden="true">{React.createElement(icon)}</span>
              <span className="qlinks__text">
                <span className="qlinks__title">{t(`tiles.${id}Title`)}</span>
                <span className="qlinks__sub">{t(`tiles.${id}Text`)}</span>
              </span>
              <FiArrowUpRight className="qlinks__arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
