import Hero from "../components/Hero/Hero";
import About from "../sections/About/About";
import ProfileHighlights from "../sections/ProfileHighlights/ProfileHighlights";
import Treatments from "../sections/Treatments/Treatments";
import Reviews from "../sections/Reviews/Reviews";
import Contact from "../sections/Contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ProfileHighlights />
      <Treatments />
      <Reviews />
      <Contact />
    </>
  );
}