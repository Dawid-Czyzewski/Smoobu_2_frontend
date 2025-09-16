import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-0" style={{ backgroundColor: '#343A40' }}>
      <h1 className="text-3xl sm:text-5xl font-bold text-white mb-8 text-center">YourSpain</h1>
      <form className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-4 sm:gap-6">
        <p className="text-base sm:text-lg text-center text-black mb-4">{t('signInMessage')}</p>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-black">{t('emailLabel')}</label>
          <input
            id="email"
            type="email"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F29416]"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-black">{t('passwordLabel')}</label>
          <input
            id="password"
            type="password"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F29416]"
            placeholder={t('passwordPlaceholder')}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#F29416] hover:bg-[#cc7d13] text-white font-semibold py-2 rounded-md transition-colors cursor-pointer"
        >
          {t('loginButton')}
        </button>

        <div className="text-center">
          <a
            href="#"
            className="text-sm text-black hover:underline cursor-pointer"
          >
            {t('forgotPassword')}
          </a>
        </div>

        <div className="text-center text-xs text-gray-400 mt-2">&copy; {new Date().getFullYear()} YourSpain</div>
      </form>
    </div>
  );
}
