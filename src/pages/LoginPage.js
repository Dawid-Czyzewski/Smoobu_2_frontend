import { useTranslation } from 'react-i18next';

export default function LoginPage() {
    const { t } = useTranslation();
    return <div className="bg-red-500">{t('login')}</div>;
}