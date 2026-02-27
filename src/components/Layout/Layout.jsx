import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
// Імпортуйте Hero сюди, якщо він має бути тільки на головній. Якщо Hero з 4 картками має бути на всіх сторінках вгорі - додайте його сюди.
// Але за вашим початковим кодом, Hero був тільки на головній. Тому я залишу його в HomePage.

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Тут будуть рендеритись сторінки (HomePage, AboutPage, etc.) */}
      </main>
      <Footer />
    </>
  );
}