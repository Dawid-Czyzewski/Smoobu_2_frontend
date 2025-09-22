import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t bg-white/70 backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 flex justify-between">
        <div className="ml-0">
          © {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.rights')}
        </div>

        <div className="mr-0 text-gray-500">
          {t('version')} 2.0
        </div>
      </div>
    </footer>
  );
}