import { useTranslation } from 'react-i18next';

export default function ApartmentShareholders({ apartment }) {
  const { t } = useTranslation();

  const shareholders = apartment?.udzialy || [];

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('shares.shareholders')}
      </h2>

      {shareholders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('shares.noShareholders')}</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shareholders.filter(share => share && share.user).map((share) => (
            <div key={share.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {share.user?.name?.[0]?.toUpperCase()}{share.user?.surname?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {share.user?.name} {share.user?.surname}
                  </h4>
                  <p className="text-sm text-gray-600">
                    @{share.user?.username}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Udział:</span>
                <span className="text-lg font-bold text-blue-600">
                  {share.procent}%
                </span>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
