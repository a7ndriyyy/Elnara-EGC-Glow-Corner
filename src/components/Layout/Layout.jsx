
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Layout() {
  return (
    <div className="site-layout">
      <Navbar />
      <main className="site-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
