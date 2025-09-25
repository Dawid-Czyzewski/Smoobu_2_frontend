import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUsernameCheck } from "../../hooks/useUsernameCheck";
import toast from "react-hot-toast";

export default function UserForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  loading = false, 
  showPasswordFields = false,
  isEditing = false 
}) {
  const { t } = useTranslation();
  const { checkUsername, checking: checkingUsername } = useUsernameCheck(t);
  
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    surname: initialData.surname || "",
    email: initialData.email || "",
    username: initialData.username || "",
    phone: initialData.phone || "",
    role: initialData.role || "ROLE_USER",
    password: "",
    confirmPassword: ""
  });

  const [usernameStatus, setUsernameStatus] = useState({ available: null, error: null });

  useEffect(() => {
    if (initialData.name) {
      setFormData({
        name: initialData.name || "",
        surname: initialData.surname || "",
        email: initialData.email || "",
        username: initialData.username || "",
        phone: initialData.phone || "",
        role: initialData.role || "ROLE_USER",
        password: "",
        confirmPassword: ""
      });
    }
  }, [initialData]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.username.trim().length >= 3 && (!isEditing || formData.username !== initialData.username)) {
        const result = await checkUsername(formData.username, initialData.id);
        setUsernameStatus(result);
      } else if (isEditing && formData.username === initialData.username) {
        setUsernameStatus({ available: true, error: null });
      } else {
        setUsernameStatus({ available: null, error: null });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsername, initialData.id, initialData.username, isEditing]);

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

    if (formData.username.trim().length < 3) {
      toast.error(t('users.usernameTooShortToast'));
      return false;
    }

    if (usernameStatus.available === false) {
      toast.error(t('users.usernameTakenToast'));
      return false;
    }

    if (usernameStatus.available === null && formData.username.trim().length >= 3 && (!isEditing || formData.username !== initialData.username)) {
      toast.error(t('users.usernameCheckingToast'));
      return false;
    }

    if (formData.phone.trim() && !/^\+[1-9]\d{1,14}$/.test(formData.phone.trim())) {
      toast.error(t('users.form.phoneInvalid') || 'Phone number must start with + and country code (e.g., +48123456789)');
      return false;
    }

    if (showPasswordFields) {
      if (formData.password && formData.password.length < 6) {
        toast.error(t('users.passwordTooShort'));
        return false;
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error(t('users.passwordsDoNotMatch'));
        return false;
      }
    } else {
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
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = { ...formData };
      if (!showPasswordFields || !submitData.password) {
        delete submitData.confirmPassword;
      }
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('users.form.name') || 'Name'} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('users.form.namePlaceholder') || 'Enter name'}
            required
          />
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
            {t('users.form.surname') || 'Surname'} *
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('users.form.surnamePlaceholder') || 'Enter surname'}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('users.form.email') || 'Email'} *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder={t('users.form.emailPlaceholder') || 'Enter email'}
          required
        />
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          {t('users.form.username') || 'Username'} *
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('users.form.usernamePlaceholder') || 'Enter username'}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {checkingUsername ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
            ) : usernameStatus.available === true && formData.username.trim().length >= 3 && (!isEditing || formData.username !== initialData.username) ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : usernameStatus.available === false ? (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : null}
          </div>
        </div>
        {usernameStatus.available === true && formData.username.trim().length >= 3 && (!isEditing || formData.username !== initialData.username) && (
          <p className="mt-1 text-sm text-green-600">✓ {t('users.usernameAvailable')}</p>
        )}
        {usernameStatus.available === false && (
          <p className="mt-1 text-sm text-red-600">✗ {t('users.usernameTaken')}</p>
        )}
        {usernameStatus.error && (
          <p className="mt-1 text-sm text-red-600">✗ {usernameStatus.error}</p>
        )}
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

      {showPasswordFields && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('users.changePassword')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('users.passwordOptional')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.newPassword')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.newPassword')}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.confirmNewPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('users.confirmNewPassword')}
              />
            </div>
          </div>
        </div>
      )}

      {!showPasswordFields && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.password') || 'Password'} *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('users.form.passwordPlaceholder') || 'Enter password'}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.confirmPassword') || 'Confirm Password'} *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('users.form.confirmPasswordPlaceholder') || 'Confirm password'}
              required
            />
          </div>
        </>
      )}

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

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? (t('users.updating') || 'Updating...') : (t('users.form.creating') || 'Creating...')}
            </span>
          ) : (
            isEditing ? (t('users.updateUser') || 'Update User') : (t('users.form.createUser') || 'Create New User')
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('users.form.cancel') || 'Cancel'}
          </button>
        )}
      </div>
    </form>
  );
}
