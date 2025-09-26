import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { get, put } from "../services/apiService";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import ApartmentForm from "../components/ApartmentForm/ApartmentForm";
import ShareholdersManager from "../components/ApartmentForm/ShareholdersManager";
import toast, { Toaster } from "react-hot-toast";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default function EditApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { fullUser } = useUser();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [shareholders, setShareholders] = useState([]);

  const fetchApartment = useCallback(async () => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const response = await get(`/apartments/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(t('apartments.notFound'));
        } else if (response.status === 403) {
          toast.error(t('apartments.accessDenied'));
          navigate('/');
        } else {
          throw new Error('Failed to fetch apartment details');
        }
        setApartment(null);
        return;
      }
      
      const data = await response.json();
      setApartment(data);
    } catch (err) {
      setError(t('apartments.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [id, fullUser?.roles, navigate, t]);

  useEffect(() => {
    fetchApartment();
  }, [fetchApartment]);

  const handleSubmit = async (formData, selectedFile) => {
    setUpdating(true);
    try {
      
      if (!formData.name || !formData.name.trim()) {
        toast.error('Nazwa apartamentu jest wymagana');
        setUpdating(false);
        return;
      }
      
      if (!formData.priceForClean || isNaN(parseFloat(formData.priceForClean))) {
        toast.error('Cena za sprzątanie jest wymagana i musi być liczbą');
        setUpdating(false);
        return;
      }
      
      if (!formData.vat || isNaN(parseFloat(formData.vat))) {
        toast.error('VAT jest wymagany i musi być liczbą');
        setUpdating(false);
        return;
      }

      const apartmentData = {
        name: formData.name.trim(),
        priceForClean: parseFloat(formData.priceForClean),
        vat: parseFloat(formData.vat),
        canFaktura: Boolean(formData.canFaktura)
      };
      
      if (selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        apartmentData.image = base64;
      } else if (formData.picture && !formData.picture.startsWith('/uploads/')) {
        apartmentData.picture = formData.picture;
      } else {
        apartmentData.picture = apartment.picture;
      }
      const response = await put(`/apartments/${id}`, apartmentData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to update apartment');
      }
      
      const shareholdersData = shareholders.map(shareholder => ({
        user_id: shareholder.userId,
        procent: shareholder.percentage
      }));
      
      const sharesResponse = await put(`/udzialy/apartment/${id}`, {
        shareholders: shareholdersData
      });
      
      if (!sharesResponse.ok) {
        const sharesErrorData = await sharesResponse.json();
        toast.error('Apartament został zaktualizowany, ale wystąpił błąd przy aktualizacji udziałowców');
      }
      
      toast.success(t('apartments.updateSuccess'));
      navigate('/admin/apartments');
    } catch (err) {
      toast.error(t('apartments.updateError') || 'Error updating apartment');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/apartments');
  };

  const handleShareholdersChange = useCallback((newShareholders) => {
    setShareholders(newShareholders);
  }, []);

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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('apartments.error')}
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {t('apartments.notFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('apartments.notFoundDescription')}
          </p>
          <button
            onClick={() => navigate('/admin/apartments')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
          >
            {t('apartments.backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Toaster />
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('apartments.backToList')}
          </button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('apartments.editApartment')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('apartments.editApartmentDescription')}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <ApartmentForm
          initialData={apartment}
          onSubmit={handleSubmit}
          loading={updating}
          isEditing={true}
        />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <ShareholdersManager 
          apartment={apartment} 
          onShareholdersChange={handleShareholdersChange}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-start">
        <button
          onClick={() => {
            const form = document.querySelector('form');
            if (form) {
              form.requestSubmit();
            }
          }}
          disabled={updating}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {updating ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t('apartments.form.updating')}
            </span>
          ) : (
            t('apartments.form.updateApartment')
          )}
        </button>
        
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          {t('apartments.form.cancel')}
        </button>
      </div>
    </div>
  );
}
