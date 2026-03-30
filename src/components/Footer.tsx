import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Footer = () => {
  const { data } = usePortfolio();
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="text-white/50 text-sm">© 2026 {data.config.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
