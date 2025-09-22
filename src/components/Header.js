import { Link, useNavigate, useLocation } from "react-router";
import { useCallback } from "react";
import { clearToken } from "../services/tokenService";
import { useTranslation } from "react-i18next";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const handleLogout = useCallback(() => {
    clearToken();
    navigate("/login", { replace: true });
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur">
      <div className="w-full flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 ml-0">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/") 
                ? "text-indigo-700 bg-indigo-50" 
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-100"
            }`}
          >
            {t('header.home')}
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/contact") 
                ? "text-indigo-700 bg-indigo-50" 
                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-100"
            }`}
          >
            {t('header.contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}