import { useTranslation } from "react-i18next";

export default function PageHeader({ onAddUser }) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 sm:mb-4 lg:mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
            {t('users.title')}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            {t('users.subtitle')}
          </p>
        </div>
        <button 
          onClick={onAddUser}
          className="w-full lg:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg font-medium text-sm sm:text-base cursor-pointer">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('users.addUser')}
          </span>
        </button>
      </div>
    </div>
  );
}
