import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ form: null, username: null, password: null });

  function validate() {
    const next = { form: null, username: null, password: null };

    if (!username.trim()) {
      next.username = t('usernameRequired') || 'Nazwa użytkownika jest wymagana';
    }

    if (!password) {
      next.password = t('passwordRequired') || 'Hasło jest wymagane';
    } else if (password.length < 6) {
      next.password = t('passwordTooShort') || 'Hasło musi mieć co najmniej 6 znaków';
    }

    setErrors(next);
    return !next.username && !next.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({ form: null, username: null, password: null });

    if (!validate()) return;

    setLoading(true);
    try {
      await login({ username: username.trim(), password }, true);
      navigate('/', { replace: true });
    } catch (err) {
      let message = t('loginFailed') || 'Błąd logowania';

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.response?.status === 401) {
        message = t('invalidCredentials') || 'Nieprawidłowa nazwa użytkownika lub hasło';
      } else if (err?.message) {
        message = err.message;
      }

      setErrors(prev => ({ ...prev, form: message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-0" style={{ backgroundColor: '#343A40' }}>
      <h1 className="text-3xl sm:text-5xl font-bold text-white mb-8 text-center">YourSpain</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-4 sm:gap-6"
        noValidate
      >
        <p className="text-base sm:text-lg text-center text-black mb-4">{t('signInMessage')}</p>

        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm text-center">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-black">
            {t('usernameLabel') || 'Nazwa użytkownika'}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
              errors.username ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder={t('usernamePlaceholder') || 'Wpisz swoją nazwę użytkownika'}
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            required
          />
          {errors.username && (
            <div id="username-error" className="text-red-600 text-sm mt-1">
              {errors.username}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-black">
            {t('passwordLabel')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder={t('passwordPlaceholder')}
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            required
          />
          {errors.password && (
            <div id="password-error" className="text-red-600 text-sm mt-1">
              {errors.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#F29416] hover:bg-[#cc7d13] text-white font-semibold py-2 rounded-md transition-colors cursor-pointer disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (t('loggingIn') || 'Logowanie...') : t('loginButton')}
        </button>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-black hover:underline cursor-pointer"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <div className="text-center text-xs text-gray-400 mt-2">
          &copy; {new Date().getFullYear()} YourSpain
        </div>
      </form>
    </div>
  );
}
