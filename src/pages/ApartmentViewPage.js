import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useUser } from '../context/UserProvider';
import { isAdmin } from '../utils/roleUtils';
import { get } from '../services/apiService';
import toast from 'react-hot-toast';

export default function ApartmentViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { fullUser } = useUser();
  const [apartment, setApartment] = useState(null);
  const [userShare, setUserShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await get(`/apartments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartment');
        }

        const apartmentData = await response.json();
        setApartment(apartmentData);

        if (!isAdmin(fullUser?.roles)) {
          const userResponse = await get('/me');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const userShareInApartment = userData.udzialy?.find(
              share => share.apartment && share.apartment.id === parseInt(id)
            );
            
            if (!userShareInApartment) {
              throw new Error('Access denied to this apartment');
            }
            
            setUserShare(userShareInApartment);
          }
        }
      } catch (err) {
        console.error('Error fetching apartment:', err);
        let errorMessage = err.message;
        
        if (err.message === 'Access denied to this apartment') {
          errorMessage = t('apartments.accessDeniedApartment');
        } else if (err.message === 'Failed to fetch apartment') {
          errorMessage = t('apartments.apartmentNotFound');
        }
        
        setError(errorMessage);
        toast.error(t('apartments.fetchApartmentError'));
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id, fullUser?.roles]);

  const handleBack = () => {
    navigate('/apartments');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('apartments.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('apartments.error')}
          </h2>
          <p className="text-red-600 mb-4">{error || t('apartments.apartmentNotFound')}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('apartments.backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">{t('apartments.backToList')}</span>
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('apartments.apartmentDetails')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('apartments.apartmentDetailsDescription')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {apartment.picture ? (
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${apartment.picture}`}
                  alt={apartment.name}
                  className="w-full h-96 object-contain bg-gray-50"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm">ID: {apartment.id}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('apartments.basicInfo')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">{t('apartments.priceForClean')}:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {parseFloat(apartment.priceForClean || 0).toFixed(2)} zł
                  </span>
                </div>

                {isAdmin(fullUser?.roles) && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">{t('apartments.vat')}:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {parseFloat(apartment.vat || 0).toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">{t('apartments.canFaktura')}:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        apartment.canFaktura 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apartment.canFaktura ? t('apartments.yes') : t('apartments.no')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium">{t('apartments.createdAt')}:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(apartment.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User Share Info (only for regular users) */}
            {!isAdmin(fullUser?.roles) && userShare && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {t('apartments.myShare')}
                </h2>
                
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{t('apartments.percentage')}:</span>
                    <span className="text-2xl font-bold text-amber-600">
                      {parseFloat(userShare.procent || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Shareholders (only for admin) */}
            {isAdmin(fullUser?.roles) && apartment.udzialy && apartment.udzialy.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {t('shares.title')}
                </h2>
                
                <div className="space-y-3">
                  {apartment.udzialy
                    .filter(share => share.user && share.user.name)
                    .map((share, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-amber-600">
                              {share.user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {share.user.name} {share.user.surname}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-amber-600">
                          {parseFloat(share.procent || 0).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
