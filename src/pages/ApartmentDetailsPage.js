import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import { get } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "../utils/dateUtils";
import { formatPrice, formatVat } from "../utils/priceUtils";
import { BASE_URL } from "../config";

export default function ApartmentDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { fullUser } = useUser();
  
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/admin/apartments');
      return;
    }

    fetchApartment();
  }, [fullUser?.roles, navigate, id]);

  const fetchApartment = async () => {
    try {
      setLoading(true);
      const response = await get(`/apartments/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error(t('apartments.notFound'));
          navigate('/admin/apartments');
          return;
        }
        if (response.status === 403) {
          toast.error(t('apartments.accessDenied'));
          navigate('/admin/apartments');
          return;
        }
        throw new Error('Failed to fetch apartment');
      }
      
      const data = await response.json();
      setApartment(data);
    } catch (err) {
      toast.error(t('apartments.fetchError') || 'Error fetching apartment.');
      console.error("Error fetching apartment:", err);
      navigate('/admin/apartments');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    navigate('/admin/apartments');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('apartments.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('apartments.notFound') || 'Apartment not found'}
          </h2>
          <p className="text-red-600 mb-4">
            {t('apartments.notFoundDescription') || 'The requested apartment could not be found.'}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('apartments.backToList') || 'Back to List'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Toaster />
      
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('apartments.backToList')}
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {apartment.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t('apartments.apartmentDetailsDescription')}
            </p>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex">
            {apartment.picture ? (
              <img 
                src={`${BASE_URL}${apartment.picture}`}
                alt={apartment.name}
                className="max-w-full h-auto object-contain rounded-2xl"
              />
            ) : (
              <div className="w-64 h-64 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-6xl font-bold rounded-lg">
                {apartment.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              {t('apartments.basicInfo')}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('apartments.name')}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {apartment.name || t('apartments.notProvided')}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    ID
                  </label>
                  <p className="text-lg font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    {apartment.id}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('apartments.priceForClean')}
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(apartment.priceForClean) || t('apartments.notProvided')}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('apartments.vat')}
                  </label>
                  <p className="text-xl font-semibold text-blue-600">
                    {formatVat(apartment.vat) || t('apartments.notProvided')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('apartments.canFaktura')}
                  </label>
                  <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-lg ${
                    apartment.canFaktura 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {apartment.canFaktura ? t('apartments.canInvoice') : t('apartments.cannotInvoice')}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('apartments.createdAt')}
                  </label>
                  <p className="text-base text-gray-700">
                    {formatDate(apartment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-start">
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            {t('apartments.backToList')}
          </button>
        </div>
      </div>
    </div>
  );
}
