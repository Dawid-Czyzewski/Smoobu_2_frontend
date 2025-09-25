import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getHighestRole } from "../../utils/roleUtils";
import ActionButton from "../common/ActionButton";

export default function UserCard({ user, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewUser = () => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
    <div className="p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-bold flex-shrink-0">
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
              getHighestRole(user.roles) === 'Admin'
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
            {getHighestRole(user.roles) === 'Admin' ? t('roles.Admin') : t('roles.User')}
          </span>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <ActionButton 
              type="view" 
              size="sm" 
              onClick={handleViewUser}
            />
            <ActionButton type="edit" size="sm" />
            <ActionButton 
              type="delete" 
              size="sm" 
              onClick={() => onDelete(user)}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {t('users.createdAt')}: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );
}
