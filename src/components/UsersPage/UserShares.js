import { useTranslation } from 'react-i18next';

export default function UserShares({ user }) {
  const { t } = useTranslation();

  const shares = user?.udzialy || [];

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('shares.title')}
      </h2>

      {shares.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('shares.noShares')}</p>
        </div>
      ) : (
        <>
        <div className="grid gap-4">
          {shares
            .filter(share => share.apartment && share.apartment.name)
            .map((share) => (
              <div key={share.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {share.apartment.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('shares.apartmentId')}: {share.apartment.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {share.procent ? parseFloat(share.procent).toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        </>
      )}
    </div>
  );
}
