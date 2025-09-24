import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { isAdmin } from "../utils/roleUtils";
import { useUser } from "../context/UserProvider";
import { post } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";

export default function CreateUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_USER"
  });
  const [loading, setLoading] = useState(false);

  if (!isAdmin(fullUser?.roles)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('users.accessDenied')}
          </h2>
          <p className="text-red-600">
            {t('users.adminRequired')}
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(t('users.form.nameRequired') || 'Name is required');
      return false;
    }

    if (!formData.surname.trim()) {
      toast.error(t('users.form.surnameRequired') || 'Surname is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error(t('users.form.emailRequired') || 'Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error(t('users.form.emailInvalid') || 'Email is invalid');
      return false;
    }

    if (!formData.username.trim()) {
      toast.error(t('users.form.usernameRequired') || 'Username is required');
      return false;
    }

    if (formData.phone.trim() && !/^\+[1-9]\d{1,14}$/.test(formData.phone.trim())) {
      toast.error(t('users.form.phoneInvalid') || 'Phone number must start with + and country code (e.g., +48123456789)');
      return false;
    }

    if (!formData.password) {
      toast.error(t('users.form.passwordRequired') || 'Password is required');
      return false;
    } else if (formData.password.length < 6) {
      toast.error(t('users.form.passwordTooShort') || 'Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('users.form.passwordsDoNotMatch') || 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone || null,
        roles: [formData.role]
      });

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
          const errorMessages = data.errors.join(', ');
          toast.error(errorMessages);
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error(t('users.form.createError') || 'Error creating user');
        }
        return;
      }

      toast.success('User created successfully!');
      setTimeout(() => {
        navigate('/admin/users', { state: { newUser: data.user } });
      }, 1500);
        } catch (error) {
          toast.error(t('users.form.createError') || 'Error creating user');
        } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('users.form.backToUsers') || 'Back to Users'}
          </button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('users.form.createUser') || 'Create New User'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('users.form.createUserDescription') || 'Fill in the form below to create a new user account'}
        </p>
      </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.name') || 'Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.form.namePlaceholder') || 'Enter name'}
              />
            </div>

            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.surname') || 'Surname'}
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.form.surnamePlaceholder') || 'Enter surname'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.email') || 'Email'}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('users.form.emailPlaceholder') || 'Enter email'}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.username') || 'Username'}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('users.form.usernamePlaceholder') || 'Enter username'}
            />
          </div>

          <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.form.phone') || 'Phone Number'} <span className="text-gray-500 text-xs">(optional)</span>
                </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('users.form.phonePlaceholder') || '+48123456789 (optional)'}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.role') || 'Role'}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="ROLE_USER">{t('roles.User') || 'User'}</option>
              <option value="ROLE_ADMIN">{t('roles.Admin') || 'Admin'}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.password') || 'Password'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.form.passwordPlaceholder') || 'Enter password'}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.confirmPassword') || 'Confirm Password'}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.form.confirmPasswordPlaceholder') || 'Confirm password'}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t('users.form.cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('users.form.creating') || 'Creating...'}
                </span>
              ) : (
                t('users.form.create') || 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
}
