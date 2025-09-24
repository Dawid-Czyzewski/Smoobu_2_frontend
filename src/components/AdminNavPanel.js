import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";

export default function AdminNavPanel() {
  const location = useLocation();
  const { t } = useTranslation();
  const { fullUser } = useUser();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="h-screen w-[16vw] min-w-[260px] max-w-[320px] bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex flex-col overflow-y-auto shadow-2xl border-r border-slate-700"
    >
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-white">{t('header.brand')}</h1>
      </div>

      {fullUser && (
        <div className="mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold shadow-lg">
              {`${(fullUser?.name?.[0] || '').toUpperCase()}${(fullUser?.surname?.[0] || '').toUpperCase()}`}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {`${fullUser?.name || ''} ${fullUser?.surname || ''}`.trim()}
              </span>
              <span className="text-xs text-blue-300 font-medium">
                {t('roles.Admin')}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="mb-6">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105"
            }`}
          >
            <span className="ml-2">{t("header.home")}</span>
          </Link>
        </div>


        {isAdmin(fullUser?.roles) && (
          <div className="mb-6">
            <div className="px-4 mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t("nav.admin.title")}
              </h3>
            </div>
            
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/admin/users")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105"
                  }`}
                >
                  <span className="ml-2">{t("nav.admin.users")}</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
