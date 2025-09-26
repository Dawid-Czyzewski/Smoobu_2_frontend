import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { isAdmin } from "../utils/roleUtils";
import { useUser } from "../context/UserProvider";
import { get, put } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import UserForm from "../components/UserForm/UserForm";

export default function UserEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { fullUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/admin/users');
      return;
    }
  }, [fullUser?.roles, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAdmin(fullUser?.roles)) return;
      
      try {
        setLoading(true);
        const response = await get(`/users/${id}`);
        
        if (!response.ok) {
          if (response.status === 403) {
            toast.error('Access denied. You need administrator privileges to view user details.');
            navigate('/admin/users');
            return;
          }
          if (response.status === 404) {
            toast.error('User not found.');
            navigate('/admin/users');
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error loading user data');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, fullUser?.roles, navigate]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        username: formData.username,
        phone: formData.phone || null,
        roles: [formData.role]
      };

      if (formData.password) {
        updateData.password = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      updateData.invoiceInfo = formData.invoiceInfo;

      const response = await put(`/users/${id}`, updateData);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required. Please log in again.');
          return;
        }
        if (response.status === 403) {
          toast.error('Access denied. You need administrator privileges to edit users.');
          return;
        }
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(error => toast.error(error));
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('Error updating user');
        }
        return;
      }


      if (formData.password) {
        toast.success(t('users.passwordChanged'));
      } else {
        toast.success('User updated successfully!');
      }
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (error) {
      toast.error('Error updating user');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  if (!isAdmin(fullUser?.roles)) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('users.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('users.userNotFound')}
          </h2>
        </div>
      </div>
    );
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
          {t('users.editUser')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('users.editUserDescription')}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <UserForm
          initialData={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
          showPasswordFields={true}
          isEditing={true}
        />
      </div>
    </div>
  );
}