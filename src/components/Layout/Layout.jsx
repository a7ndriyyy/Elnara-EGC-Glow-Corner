
import React, { Suspense, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './Layout.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import usePageMeta from '../../hooks/usePageMeta';

export default function Layout() {
  const location = useLocation();
  const { t } = useLanguage();
  const mainRef = useRef(null);
  useRevealOnScroll(mainRef, location.pathname);
  usePageMeta();
  const hideBookingCta = ['/booking', '/reschedule', '/admin', '/admin-login'].includes(location.pathname);

  return (
    <div className="site-layout">
      <Navbar />
      <main className="site-layout__main" ref={mainRef}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {!hideBookingCta && (
        <Link className="site-booking-cta" to="/booking">
          <span className="site-booking-cta__dot" aria-hidden="true" />
          <span>{t('servicesPage.book')}</span>
          <span className="site-booking-cta__arrow" aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  );
}
