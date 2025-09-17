import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-0"
      style={{ backgroundColor: '#343A40' }}
    >
      <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 text-center">
        404
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center">
        {t('pageNotFoundMessage')}
      </p>

      <button
        onClick={() => navigate('/')}
        className="bg-[#F29416] hover:bg-[#cc7d13] text-white font-semibold px-6 py-2 rounded-md transition-colors cursor-pointer"
      >
        {t('goBackHome')}
      </button>

      <div className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} YourSpain
      </div>
    </div>
  );
}
