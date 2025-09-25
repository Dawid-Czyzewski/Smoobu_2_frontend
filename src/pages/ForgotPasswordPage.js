import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { API_URL } from "../config";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('auth.forgotPassword.emailRequired'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success(t('auth.forgotPassword.success'));
      } else {
        toast.error(data.error || t('auth.forgotPassword.error'));
      }
    } catch (error) {
      toast.error(t('auth.forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#343A40' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('auth.forgotPassword.checkEmail')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('auth.forgotPassword.checkEmailMessage')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-[#F29416] hover:bg-[#cc7d13] text-white font-semibold rounded-md transition-colors cursor-pointer"
              >
                {t('auth.forgotPassword.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#343A40' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-gray-600">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.forgotPassword.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                required
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
                  {t('auth.forgotPassword.sending')}
                </span>
              ) : (
                t('auth.forgotPassword.sendResetLink')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-black hover:text-gray-700 font-medium transition-colors cursor-pointer"
            >
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
