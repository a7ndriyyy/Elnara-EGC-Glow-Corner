import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { findDirection } from "../data/directions";
import { localize } from "../utils/format";

// Translation key for each route's page name (shown as "<name> — Elnara").
const ROUTE_TITLES = {
  "/services": "nav.salonServices",
  "/equipment": "nav.massages",
  "/about": "nav.study",
  "/prices": "nav.prices",
  "/master": "nav.master",
  "/promotions": "promotions.title",
  "/booking": "booking.title",
};

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Per-page <title>, meta description and <html lang> (final check: SEO). */
export default function usePageMeta() {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    let name = null;
    if (pathname.startsWith("/directions/")) {
      const direction = findDirection(pathname.split("/")[2]);
      name = direction ? localize(direction.title, language) : null;
    } else if (pathname.startsWith("/admin")) {
      name = "Admin";
    } else if (ROUTE_TITLES[pathname]) {
      name = t(ROUTE_TITLES[pathname]);
    }

    const title = name ? `${name} — Elnara` : `Elnara — ${t("ui.metaHomeTitle")}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", t("ui.metaDescription"));
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", t("ui.metaDescription"));
  }, [pathname, language, t]);
}
