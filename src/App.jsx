import React, { lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../src/index.css";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import { features } from "./data/features";
import { LanguageProvider } from "./i18n/LanguageContext";

// Home loads with the app; every other page is split into its own chunk and
// fetched on first visit (keeps the first download small on phones).
const AboutPage = lazy(() => import("./pages/StudyPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const PricesPage = lazy(() => import("./pages/PricesPage"));
const DirectionPage = lazy(() => import("./pages/DirectionPage"));
const TrainingLockedPage = lazy(() => import("./pages/TrainingLockedPage"));
const PromotionsPage = lazy(() => import("./pages/PromotionsPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const RescheduleResponse = lazy(() => import("./pages/RescheduleResponse"));
// Компонент для скролу до елемента при наявності hash в URL
function ScrollToHash() {
  const location = useLocation();
  
  useEffect(() => {
    // <Link state={{ scrollTo: "section-id" }}> → land on that section of the new page.
    const targetId = location.state?.scrollTo;
    if (targetId) {
      // Pages load lazily, so the target may appear a moment later: retry briefly.
      let tries = 0;
      let settle;
      const timer = setInterval(() => {
        const element = document.getElementById(targetId);
        if (element || ++tries > 30) clearInterval(timer);
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth' });
        // The page can still shift while it settles (images, animations):
        // once it has, snap to the section if we ended up off target.
        settle = setTimeout(() => {
          const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
          if (Math.abs(element.getBoundingClientRect().top - margin) > 24) {
            element.scrollIntoView({ behavior: 'auto' });
          }
        }, 900);
      }, 100);
      return () => {
        clearInterval(timer);
        clearTimeout(settle);
      };
    }
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <React.StrictMode>
    <LanguageProvider>
    <HashRouter >
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* TZ step 8: training stays in the menu; its content is behind a flag */}
          <Route path="about" element={features.trainingEnabled ? <AboutPage /> : <TrainingLockedPage />} />
          <Route path="services" element={<ServicesPage />} />
          {/* Device treatments now live on the salon services page; keep old links working */}
          <Route path="equipment" element={<Navigate to="/services" state={{ scrollTo: "services-apparatus" }} replace />} />
          <Route path="prices" element={<PricesPage />} />
          {/* "About the master" page was removed at the owner's request */}
          <Route path="master" element={<Navigate to="/" replace />} />
          <Route path="directions/:slug" element={<DirectionPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="reschedule" element={<RescheduleResponse />} />


            <Route path="admin-login" element={<AdminLogin />} />
            <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </HashRouter>
    </LanguageProvider>
    </React.StrictMode>
  );
}