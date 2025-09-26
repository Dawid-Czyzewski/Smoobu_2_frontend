import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getHighestRole } from "../../utils/roleUtils";
import ActionButton from "../common/ActionButton";

export default function UserTable({ users, onSort, sortField, sortDirection, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewUser = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleEditUser = (user) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-1">
                {t('users.name')}
                {sortField === "name" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("email")}
            >
              <div className="flex items-center gap-1">
                {t('users.email')}
                {sortField === "email" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('users.role')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-1">
                {t('users.createdAt')}
                {sortField === "created_at" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('shares.apartments')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('users.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold">
                  {`${user.name?.[0] || ''}${user.surname?.[0] || ''}`.toUpperCase()}
                </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {`${user.name || ''} ${user.surname || ''}`.trim()}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  getHighestRole(user.roles) === 'Admin'
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {getHighestRole(user.roles) === 'Admin' ? t('roles.Admin') : t('roles.User')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.udzialy && user.udzialy.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {user.udzialy
                      .filter(share => share.apartment && share.apartment.name)
                      .map((share, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {share.apartment.name}
                        </span>
                      ))}
                  </div>
                ) : (
                  <span className="text-gray-500">{t('shares.noApartments')}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <ActionButton 
                            type="view" 
                            size="md" 
                            onClick={() => handleViewUser(user)}
                          />
                          <ActionButton 
                            type="edit" 
                            size="md" 
                            onClick={() => handleEditUser(user)}
                          />
                          <ActionButton 
                            type="delete" 
                            size="md" 
                            onClick={() => onDelete(user)}
                          />
                        </div>
                      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
