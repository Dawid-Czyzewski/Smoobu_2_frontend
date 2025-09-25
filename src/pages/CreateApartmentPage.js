import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import { post } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import ApartmentForm from "../components/ApartmentForm/ApartmentForm";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default function CreateApartmentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullUser } = useUser();
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/admin/apartments');
    }
  }, [fullUser?.roles, navigate]);

  const handleSubmit = async (formData, selectedFile) => {
    setLoading(true);
    try {
      const apartmentData = {
        name: formData.name,
        priceForClean: formData.priceForClean,
        vat: formData.vat,
        canFaktura: formData.canFaktura
      };
      
      if (selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        apartmentData.image = base64;
      }

      const response = await post('/apartments', apartmentData);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t('apartments.authRequired'));
          return;
        }
        if (response.status === 403) {
          toast.error(t('apartments.accessDenied'));
          return;
        }
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(error => toast.error(error));
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error(t('apartments.createError'));
        }
        return;
      }

      toast.success(t('apartments.createSuccess'));
      setTimeout(() => {
        navigate('/admin/apartments', { state: { newApartment: data.apartment } });
      }, 1500);
    } catch (error) {
      toast.error(t('apartments.createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/apartments');
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('apartments.backToList')}
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('apartments.addApartment')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('apartments.addApartmentDescription')}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <ApartmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEditing={false}
        />
      </div>
    </div>
  );
}
