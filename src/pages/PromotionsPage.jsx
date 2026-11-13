import React from "react";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import PromotionCard from "../components/PromotionCard/PromotionCard";
import usePromotions from "../hooks/usePromotions";
import { useLanguage } from "../i18n/LanguageContext";

/** /promotions — all live promotions & news (TZ step 9). */
export default function PromotionsPage() {
  const { t } = useLanguage();
  const { status, items } = usePromotions();

  return (
    <section className="promotions-page">
      <div className="promotions__inner">
        <SectionTitle
          as="h1"
          eyebrow={t("promotions.eyebrow")}
          title={t("promotions.title")}
          subtitle={t("promotions.subtitle")}
        />

        {status === "loading" ? (
          <p className="promotions__empty" role="status">…</p>
        ) : status === "error" ? (
          <p className="promotions__empty" role="alert">{t("promotions.error")}</p>
        ) : items.length === 0 ? (
          <p className="promotions__empty">{t("promotions.empty")}</p>
        ) : (
          <div className="card-grid">
            {items.map((p) => <PromotionCard key={p.id} promotion={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
