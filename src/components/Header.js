import { Link, useNavigate, useLocation } from "react-router";
import { useCallback, useState, useEffect } from "react";
import { clearToken } from "../services/tokenService";
import { useTranslation } from "react-i18next";

export default function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = useCallback(() => {
    clearToken();
    navigate("/login", { replace: true });
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-700 bg-slate-800/90 backdrop-blur">
      <div className="w-full flex h-16 items-center justify-between px-6 sm:px-8 lg:px-10">
        <nav className="hidden sm:flex items-center gap-2 ml-0">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/") 
                ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" 
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            {t('header.home')}
          </Link>
          <Link
            to="/contact"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/contact") 
                ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" 
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            {t('header.contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-lg bg-slate-700 text-white shadow-lg hover:bg-slate-600 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}