import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUserDetails } from "../../hooks/useUserDetails";

export default function UserDetails({ userId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, error } = useUserDetails(userId);

  const handleBack = () => {
    navigate('/admin/users');
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('users.notProvided');
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRoles = (roles) => {
    if (!roles || roles.length === 0) return t('users.none');
    return roles.map(role => {
      switch (role) {
        case 'ROLE_ADMIN':
          return t('roles.Admin');
        case 'ROLE_USER':
          return t('roles.User');
        default:
          return role;
      }
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('users.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('users.error')}
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('users.backToList')}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t('users.userNotFound')}
          </h2>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {t('users.backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title={t('users.backToList')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {t('users.userDetails')}
            </h1>
            <p className="text-gray-600 mt-1">
              {user.name} {user.surname}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.[0]?.toUpperCase()}{user.surname?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.name} {user.surname}
              </h2>
              <p className="text-lg text-gray-600 mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.roles?.includes('ROLE_ADMIN') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.roles?.includes('ROLE_ADMIN') ? t('roles.Admin') : t('roles.User')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('users.userInfo')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.firstName')}</label>
                <p className="text-gray-900 font-medium">{user.name || t('users.notProvided')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.lastName')}</label>
                <p className="text-gray-900 font-medium">{user.surname || t('users.notProvided')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.email')}</label>
                <p className="text-gray-900 font-medium">{user.email || t('users.notProvided')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.phone')}</label>
                <p className="text-gray-900 font-medium">{user.phone || t('users.notProvided')}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.username')}</label>
                <p className="text-gray-900 font-medium">{user.username || t('users.notProvided')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.roles')}</label>
                <p className="text-gray-900 font-medium">{formatRoles(user.roles)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.createdAt')}</label>
                <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">{t('users.userId')}</label>
                <p className="text-gray-900 font-medium font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('users.invoiceInfo')}
            </h3>
            
            {user.invoiceInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.invoiceInfo.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('users.country')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.country}</p>
                  </div>
                )}
                
                {user.invoiceInfo.city && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('users.city')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.city}</p>
                  </div>
                )}
                
                {user.invoiceInfo.companyName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('users.companyName')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.companyName}</p>
                  </div>
                )}
                
                {user.invoiceInfo.nip && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('users.nip')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.nip}</p>
                  </div>
                )}
                
                {user.invoiceInfo.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">{t('users.address')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.address}</p>
                  </div>
                )}
                
                {user.invoiceInfo.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t('users.invoiceEmail')}</label>
                    <p className="text-gray-900 font-medium">{user.invoiceInfo.email}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('users.noInvoiceData')}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {t('users.backToList')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
