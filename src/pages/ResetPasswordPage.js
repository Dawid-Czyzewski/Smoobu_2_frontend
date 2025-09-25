import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { API_URL } from "../config";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error(t('auth.resetPassword.invalidToken'));
      navigate('/login');
      return;
    }

    verifyToken();
  }, [token, navigate, t]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/password-reset/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setUserEmail(data.email);
      } else {
        toast.error(data.error || t('auth.resetPassword.invalidToken'));
        navigate('/login');
      }
    } catch (error) {
      toast.error(t('auth.resetPassword.error'));
      navigate('/login');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error(t('auth.resetPassword.passwordRequired'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.resetPassword.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.resetPassword.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/password-reset/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('auth.resetPassword.success'));
        navigate('/login');
      } else {
        toast.error(data.error || t('auth.resetPassword.error'));
      }
    } catch (error) {
      toast.error(t('auth.resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#343A40' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('auth.resetPassword.verifying')}
              </h2>
              <p className="text-gray-600">
                {t('auth.resetPassword.verifyingMessage')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#343A40' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.resetPassword.title')}
            </h1>
            <p className="text-gray-600">
              {t('auth.resetPassword.subtitle', { email: userEmail })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.resetPassword.newPasswordLabel')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.resetPassword.confirmPasswordLabel')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F29416] hover:bg-[#cc7d13] text-white font-semibold py-2 rounded-md transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('auth.resetPassword.resetting')}
                </span>
              ) : (
                t('auth.resetPassword.resetPassword')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-black hover:text-gray-700 font-medium transition-colors cursor-pointer"
            >
              {t('auth.resetPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
