import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import ImageCardsRow from "./components/ImageCardsRow/ImageCardsRow";
import Treatments from "./sections/Treatments/Treatments";
import About from "./sections/About/About";
import Reviews from "./sections/Reviews/Reviews";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <section id="top">
          <Hero />
          <ImageCardsRow />
        </section>
          <About />
        <Treatments />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </>
  );
}