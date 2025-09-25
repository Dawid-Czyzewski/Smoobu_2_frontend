import { useTranslation } from "react-i18next";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  startIndex, 
  itemsPerPage, 
  totalItems 
}) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {t('apartments.previous')}
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {t('apartments.next')}
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {t('apartments.showingResults', { 
              start: startIndex + 1, 
              end: Math.min(startIndex + itemsPerPage, totalItems), 
              total: totalItems 
            })}
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="flex gap-1 lg:gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded-md text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              {t('apartments.previous')}
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-2 lg:px-3 py-1 border rounded-md text-xs lg:text-sm cursor-pointer ${
                    currentPage === page
                      ? "bg-amber-600 text-white border-amber-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded-md text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              {t('apartments.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
