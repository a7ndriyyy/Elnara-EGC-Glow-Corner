import React, { lazy } from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
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
const EquipmentPage = lazy(() => import("./pages/EquipmentPage"));
const PricesPage = lazy(() => import("./pages/PricesPage"));
const MasterPage = lazy(() => import("./pages/MasterPage"));
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
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
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
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="prices" element={<PricesPage />} />
          <Route path="master" element={<MasterPage />} />
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