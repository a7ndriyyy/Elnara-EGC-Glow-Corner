import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PromotionCard from "../../components/PromotionCard/PromotionCard";
import usePromotions from "../../hooks/usePromotions";
import { useLanguage } from "../../i18n/LanguageContext";

const HOME_LIMIT = 3;

/** Home "Promotions / news" block (TZ steps 3 & 9): hidden while there is nothing live. */
export default function PromotionsPreview() {
  const { t } = useLanguage();
  const { status, items } = usePromotions(HOME_LIMIT);

  if (status !== "ready" || items.length === 0) return null;

  return (
    <section id="promotions" className="promotions-preview">
      <div className="promotions__inner">
        <SectionTitle eyebrow={t("promotions.eyebrow")} title={t("promotions.title")} />
        <div className="card-grid">
          {items.map((p) => <PromotionCard key={p.id} promotion={p} />)}
        </div>
        <div className="promotions__more">
          <Link to="/promotions" className="btn btn--primary">{t("promotions.all")}</Link>
        </div>
      </div>
    </section>
  );
}
