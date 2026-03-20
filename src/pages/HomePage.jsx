import React from 'react';
import Hero from "../components/Hero/Hero";
import About from "../sections/About/About";
import ProfileHighlights from "../sections/ProfileHighlights/ProfileHighlights";
import Treatments from "../sections/Treatments/Treatments";
import Reviews from "../sections/Reviews/Reviews";
import "./HomePage.css";

export default function HomePage() {
  return (
  <div className="home">
      <Hero />

      <main className="home__content">
        <Treatments />
        <About />
        <ProfileHighlights />
        <Reviews />
      </main>
    </div>
  );
}