import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../src/index.css";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/StudyPage";
import ServicesPage from "./pages/ServicesPage";
import EquipmentPage from "./pages/EquipmentPage";
import PricesPage from "./pages/PricesPage";
// Додайте імпорт для скролу до секцій


// Компонент для скролу до елемента при наявності hash в URL
function ScrollToHash() {
  const location = useLocation();
  
  useEffect(() => {
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
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="prices" element={<PricesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}