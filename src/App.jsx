import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Treatments from "./sections/Treatments/Treatments";
import About from "./sections/About/About";
import Reviews from "./sections/Reviews/Reviews";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ProfileHighlights from "./sections/ProfileHighlights/ProfileHighlights";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <section id="top" className="BackHero">
          <Hero />
        </section>
          <About />
          <ProfileHighlights />
        <Treatments />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </>
  );
}