import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../App';
import { Moon, Sun, Heart, Stethoscope } from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 transition-colors duration-200"
          >
            <div className="relative">
              <Heart className="w-8 h-8" />
              <Stethoscope className="w-4 h-4 absolute -bottom-1 -right-1 text-medical-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-medical-600 to-medical-500 bg-clip-text text-transparent">
              NirogGyan
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/'
                  ? 'text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400'
              }`}
            >
              Find Doctors
            </Link>
            <Link
              to="/appointments"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/appointments'
                  ? 'text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400'
              }`}
            >
              My Appointments
            </Link>
            <Link
              to="/health-records"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/health-records'
                  ? 'text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400'
              }`}
            >
              Health Records
            </Link>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay (simplified for now) */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 hidden">
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Find Doctors
          </Link>
          <Link
            to="/appointments"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            My Appointments
          </Link>
          <Link
            to="/health-records"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Health Records
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;