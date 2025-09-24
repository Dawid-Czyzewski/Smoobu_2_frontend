import { useTranslation } from "react-i18next";

export default function SearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  availableRoles, 
  activeTab, 
  onTabChange, 
  users 
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 sm:mb-4 lg:mb-6 bg-white rounded-lg shadow-lg p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('users.searchPlaceholder')}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
          />
        </div>
        
        {availableRoles.length > 0 && (
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">{t('users.filterByRole')}</div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => onTabChange("all")}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t('users.all')} ({users.filter(u => !u.roles.includes('ROLE_ADMIN')).length})
              </button>
              {availableRoles.map(role => (
                <button
                  key={role}
                  onClick={() => onTabChange(role)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === role
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {t(`roles.${role.replace('ROLE_', '')}`)} ({users.filter(u => u.roles.includes(role)).length})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
