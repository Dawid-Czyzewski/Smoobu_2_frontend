import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserProvider";
import { isAdmin, getHighestRole } from "../utils/roleUtils";
import { useState, useEffect } from "react";

export default function AdminNavPanel({ isMobileMenuOpen, closeMobileMenu }) {
  const location = useLocation();
  const { t } = useTranslation();
  const { fullUser } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (path) => {
    if (path === '/admin/users') {
      return location.pathname === '/admin/users' || location.pathname.startsWith('/admin/users/');
    }
    if (path === '/admin/apartments') {
      return location.pathname === '/admin/apartments' || location.pathname.startsWith('/admin/apartments/');
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}
          {!isMobile && (
            <nav
              className={`h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col shadow-xl border-r border-gray-200 transition-all duration-300 ${
                isCollapsed 
                  ? 'w-16 min-w-[64px]' 
                  : 'w-[14vw] min-w-[220px] max-w-[280px]'
              }`}
            >
      <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">{t('header.brand')}</h1>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

          {fullUser && (
            <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : 'px-4'}`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg flex-shrink-0">
                  {`${(fullUser?.name?.[0] || '').toUpperCase()}${(fullUser?.surname?.[0] || '').toUpperCase()}`}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {`${fullUser?.name || ''} ${fullUser?.surname || ''}`.trim()}
                    </span>
                    <span className="text-xs text-amber-600 font-medium">
                      {t(`roles.${getHighestRole(fullUser?.roles)}`)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
              <Link
                to="/"
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive("/")
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
                title={isCollapsed ? t("header.home") : ""}
              >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            {!isCollapsed && <span className="ml-3">{t("header.home")}</span>}
          </Link>
        </div>

        {isAdmin(fullUser?.roles) && (
          <div className="mb-6">
                {!isCollapsed && (
                  <div className="px-3 mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("nav.admin.title")}
                    </h3>
                  </div>
                )}
            
            <ul className="space-y-2">
              <li>
                    <Link
                      to="/admin/users"
                      className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive("/admin/users")
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                      title={isCollapsed ? t("nav.admin.users") : ""}
                    >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {!isCollapsed && <span className="ml-3">{t("nav.admin.users")}</span>}
                </Link>
              </li>
              <li>
                    <Link
                      to="/admin/apartments"
                      className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive("/admin/apartments")
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                      title={isCollapsed ? t("nav.admin.apartments") : ""}
                    >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                  {!isCollapsed && <span className="ml-3">{t("nav.admin.apartments")}</span>}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
        </nav>
      )}

      {isMobile && (
        <nav
          className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-y-auto shadow-2xl z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">{t('header.brand')}</h1>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {fullUser && (
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold shadow-lg">
                  {`${(fullUser?.name?.[0] || '').toUpperCase()}${(fullUser?.surname?.[0] || '').toUpperCase()}`}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {`${fullUser?.name || ''} ${fullUser?.surname || ''}`.trim()}
                  </span>
                  <span className="text-xs text-blue-300 font-medium">
                    {t(`roles.${getHighestRole(fullUser?.roles)}`)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive("/")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
                <span className="ml-3">{t("header.home")}</span>
              </Link>
            </div>

            <div className="mb-6">
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive("/contact")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="ml-3">{t("header.contact")}</span>
              </Link>
            </div>

            {isAdmin(fullUser?.roles) && (
              <div className="mb-6">
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {t("nav.admin.title")}
                  </h3>
                </div>
                
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/admin/users"
                      onClick={closeMobileMenu}
                      className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive("/admin/users")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="ml-3">{t("nav.admin.users")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/apartments"
                      onClick={closeMobileMenu}
                      className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive("/admin/apartments")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                      </svg>
                      <span className="ml-3">{t("nav.admin.apartments")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
