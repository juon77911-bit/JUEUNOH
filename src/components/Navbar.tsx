import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/#projects' },
    { name: 'Archive', path: '/#archive' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-0 group">
          <span 
            className="text-2xl font-bold tracking-tighter transition-all duration-300 group-hover:scale-105 text-main"
          >
            {data.config.name.toUpperCase()}
          </span>
          {data.config.role && (
            <span className="text-white/30 text-lg font-light uppercase tracking-[0.2em] ml-3 border-l border-white/10 pl-3">
              {data.config.role.toUpperCase()}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-110 hover:text-white relative group py-2 px-4 rounded-sm border border-transparent hover:border-sub/50 hover:shadow-[0_0_15px_var(--sub-color)] ${
                location.hash === link.path.replace('/', '') || (location.pathname === '/' && link.path === '/') 
                  ? 'text-white' 
                  : 'text-white/50'
              }`}
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/admin"
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 text-white/50 hover:text-white border border-transparent hover:border-sub/50 hover:shadow-[0_0_15px_var(--sub-color)]"
          >
            <Settings size={18} />
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-white/10 px-6 py-8 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${
                  location.pathname === link.path ? 'text-white' : 'text-white/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-white/50 flex items-center gap-2"
            >
              <Settings size={18} /> Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
