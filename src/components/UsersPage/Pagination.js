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
    <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <div className="text-xs lg:text-sm text-gray-700 text-center lg:text-left">
          {t('users.showing')} {startIndex + 1} {t('users.to')} {Math.min(startIndex + itemsPerPage, totalItems)} {t('users.of')} {totalItems} {t('users.results')}
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="flex gap-1 lg:gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded-md text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
            >
              {t('users.previous')}
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
                      ? "bg-blue-600 text-white border-blue-600"
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
              {t('users.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
