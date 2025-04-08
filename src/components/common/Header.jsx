import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-indigo-900/95 backdrop-blur-sm shadow-lg py-2' : 'bg-gradient-to-r from-indigo-800 to-purple-700 py-4'
    } text-white`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-200">
              Mentora
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300/50" 
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {[
                { to: "/", label: "Accueil" },
                { to: "/courses", label: "Cours" },
                { to: "/categories", label: "Catégories" },
                { to: "/tags", label: "Tags" },
                { to: "/stats", label: "Statistiques" }
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "font-medium bg-indigo-600 text-white shadow-md shadow-indigo-900/30" 
                          : "hover:bg-indigo-700/50 hover:text-cyan-200"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-indigo-500/30 pt-2 animate-fadeIn">
            <ul className="space-y-1">
              {[
                { to: "/", label: "Accueil" },
                { to: "/courses", label: "Cours" },
                { to: "/categories", label: "Catégories" },
                { to: "/tags", label: "Tags" },
                { to: "/stats", label: "Statistiques" }
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => 
                      `block py-2 px-3 rounded-md transition-colors ${
                        isActive 
                          ? "bg-indigo-600 font-medium shadow-sm shadow-indigo-900/30" 
                          : "hover:bg-indigo-700/50 hover:text-cyan-200"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;