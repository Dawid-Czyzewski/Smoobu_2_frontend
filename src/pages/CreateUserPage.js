import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { isAdmin } from "../utils/roleUtils";
import { useUser } from "../context/UserProvider";
import { post } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import UserForm from "../components/UserForm/UserForm";

export default function CreateUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullUser } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/admin/users');
    }
  }, [fullUser?.roles, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone || null,
        roles: [formData.role]
      };

      userData.invoiceInfo = formData.invoiceInfo;

      const response = await post('/users/register', userData);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required. Please log in again.');
          return;
        }
        if (response.status === 403) {
          toast.error('Access denied. You need administrator privileges to create users.');
          return;
        }
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(error => toast.error(error));
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('Error creating user');
        }
        return;
      }

      toast.success('User created successfully!');
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (error) {
      toast.error('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  if (!isAdmin(fullUser?.roles)) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('users.backToList')}
          </button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('users.addUser')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('users.addUserDescription')}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          showPasswordFields={true}
          isEditing={false}
        />
      </div>
    </div>
  );
}