import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Mentora
          </Link>

          {/* Bouton de menu mobile */}
          <button 
            className="md:hidden p-2 focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>

          {/* Navigation desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <NavLink to="/" 
                  className={({ isActive }) => 
                    isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
                  }
                >
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/courses"
                  className={({ isActive }) => 
                    isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
                  }
                >
                  Cours
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories"
                  className={({ isActive }) => 
                    isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
                  }
                >
                  Catégories
                </NavLink>
              </li>
              <li>
                <NavLink to="/tags"
                  className={({ isActive }) => 
                    isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
                  }
                >
                  Tags
                </NavLink>
              </li>
              <li>
                <NavLink to="/stats"
                  className={({ isActive }) => 
                    isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
                  }
                >
                  Statistiques
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="space-y-3">
              <li>
                <NavLink to="/" 
                  className={({ isActive }) => 
                    isActive ? "font-semibold block" : "block hover:text-gray-200"
                  }
                  onClick={toggleMenu}
                >
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/courses"
                  className={({ isActive }) => 
                    isActive ? "font-semibold block" : "block hover:text-gray-200"
                  }
                  onClick={toggleMenu}
                >
                  Cours
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories"
                  className={({ isActive }) => 
                    isActive ? "font-semibold block" : "block hover:text-gray-200"
                  }
                  onClick={toggleMenu}
                >
                  Catégories
                </NavLink>
              </li>
              <li>
                <NavLink to="/tags"
                  className={({ isActive }) => 
                    isActive ? "font-semibold block" : "block hover:text-gray-200"
                  }
                  onClick={toggleMenu}
                >
                  Tags
                </NavLink>
              </li>
              <li>
                <NavLink to="/stats"
                  className={({ isActive }) => 
                    isActive ? "font-semibold block" : "block hover:text-gray-200"
                  }
                  onClick={toggleMenu}
                >
                  Statistiques
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;