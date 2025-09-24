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
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
        <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-6 sm:px-8 lg:px-10">
        <nav className="hidden sm:flex items-center gap-2 ml-0">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/") 
                    ? "text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {t('header.home')}
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/contact") 
                    ? "text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
            {t('header.contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={onToggleMobileMenu}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 shadow-sm hover:bg-gray-200 transition-all duration-200 cursor-pointer"
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
                className="rounded-lg border border-gray-300 bg-white text-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 cursor-pointer"
              >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}