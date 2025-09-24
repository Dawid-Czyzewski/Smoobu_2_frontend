import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-slate-700 bg-slate-800/90 backdrop-blur">
      <div className="w-full px-6 sm:px-8 lg:px-10 py-6 text-sm text-slate-300 flex justify-between">
        <div className="ml-0">
          © {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.rights')}
        </div>

        <div className="mr-0 text-slate-400">
          {t('version')} 2.0
        </div>
      </div>
    </footer>
  );
}