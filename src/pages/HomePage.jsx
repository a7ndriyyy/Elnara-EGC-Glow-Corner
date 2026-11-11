import React from 'react';
import MasterHero from "../sections/MasterHero/MasterHero";
import QuickLinks from "../sections/QuickLinks/QuickLinks";
import Treatments from "../sections/Treatments/Treatments";
import Reviews from "../sections/Reviews/Reviews";
import "./HomePage.css";

// Home page order (TZ step 3):
// 1. Hero  2. Booking · Prices · About tiles  3. Main directions
// 4. Promotions / news  5. Gallery + Reviews + FAQ
export default function HomePage() {
  return (
    <div className="home">
      <MasterHero />
      <QuickLinks />

      <main className="home__content">
        {/* 3. Main directions — the services grid until step 4 replaces it */}
        <Treatments />

        {/* 4. Promotions / news — added in step 9; hidden while there are none */}

        {/* 5. Gallery + Reviews + FAQ — reviews now, gallery & FAQ in step 10 */}
        <Reviews />
      </main>
    </div>
  );
}
