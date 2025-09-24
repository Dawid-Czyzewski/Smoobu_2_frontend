import { useTranslation } from "react-i18next";

export default function UserCard({ user }) {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-bold flex-shrink-0">
            {`${user.name?.[0] || ''}${user.surname?.[0] || ''}`.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {`${user.name || ''} ${user.surname || ''}`.trim()}
            </div>
            <div className="text-xs text-gray-500">ID: {user.id}</div>
            <div className="text-xs text-gray-600 mt-1 truncate">{user.email}</div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 sm:space-y-2 flex-shrink-0 ml-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.roles.includes('ROLE_ADMIN') 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {user.roles.includes('ROLE_ADMIN') ? t('roles.Admin') : t('roles.User')}
          </span>
          <div className="flex space-x-1 sm:space-x-2">
            <button className="text-green-600 hover:text-green-900 text-xs cursor-pointer">
              {t('users.view')}
            </button>
            <button className="text-blue-600 hover:text-blue-900 text-xs cursor-pointer">
              {t('users.edit')}
            </button>
            <button className="text-red-600 hover:text-red-900 text-xs cursor-pointer">
              {t('users.delete')}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {t('users.createdAt')}: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );
}
