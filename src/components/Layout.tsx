import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'motion/react';

const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-main/30 selection:text-main">
      <Navbar />
      <main className="pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
