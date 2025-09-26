import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import { post, put } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import ApartmentForm from "../components/ApartmentForm/ApartmentForm";
import ShareholdersManagerForCreate from "../components/ApartmentForm/ShareholdersManagerForCreate";

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
  const [shareholders, setShareholders] = useState([]);

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

      // Jeśli są udziałowcy, dodaj ich po utworzeniu apartamentu
      if (shareholders.length > 0) {
        try {
          const shareholdersData = shareholders.map(shareholder => ({
            user_id: shareholder.userId,
            procent: shareholder.percentage
          }));

          const sharesResponse = await put(`/udzialy/apartment/${data.apartment.id}`, {
            shareholders: shareholdersData
          });

          if (!sharesResponse.ok) {
            const errorData = await sharesResponse.json();
            console.error('Error creating shares:', errorData);
            toast.error('Apartament został utworzony, ale wystąpił błąd przy dodawaniu udziałowców');
          } else {
            toast.success(t('apartments.createSuccess'));
          }
        } catch (error) {
          console.error('Error creating shares:', error);
          toast.error('Apartament został utworzony, ale wystąpił błąd przy dodawaniu udziałowców');
        }
      } else {
        toast.success(t('apartments.createSuccess'));
      }

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

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <ShareholdersManagerForCreate 
          onShareholdersChange={setShareholders}
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
          disabled={loading}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t('apartments.form.creating')}
            </span>
          ) : (
            t('apartments.form.createApartment')
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
