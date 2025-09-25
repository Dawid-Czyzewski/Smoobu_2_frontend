import { useTranslation } from "react-i18next";

export default function SearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange, 
  apartments 
}) {
  const { t } = useTranslation();

  const canInvoiceCount = apartments.filter(a => a.canFaktura === true).length;
  const cannotInvoiceCount = apartments.filter(a => a.canFaktura === false).length;

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
            placeholder={t('apartments.searchPlaceholder')}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm lg:text-base"
          />
        </div>
        
        <div>
          <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">{t('apartments.filterByInvoice')}</div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange("all")}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t('apartments.all')} ({apartments.length})
            </button>
            <button
              onClick={() => onTabChange("canInvoice")}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "canInvoice"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t('apartments.canInvoice')} ({canInvoiceCount})
            </button>
            <button
              onClick={() => onTabChange("cannotInvoice")}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "cannotInvoice"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t('apartments.cannotInvoice')} ({cannotInvoiceCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
