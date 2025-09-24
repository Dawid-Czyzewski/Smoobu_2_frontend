import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUsers } from "../hooks/useUsers";
import { useUserFilters } from "../hooks/useUserFilters";
import PageHeader from "../components/UsersPage/PageHeader";
import SearchAndFilters from "../components/UsersPage/SearchAndFilters";
import UserCard from "../components/UsersPage/UserCard";
import UserTable from "../components/UsersPage/UserTable";
import Pagination from "../components/UsersPage/Pagination";
import DeleteUserModal from "../components/UsersPage/DeleteUserModal";

export default function UsersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    users,
    loading,
    error,
    isUserAdmin,
    availableRoles,
    deleteModal,
    deleting,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteUser
  } = useUsers();

  const {
    searchTerm,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    activeTab,
    filteredAndSortedUsers,
    paginatedUsers,
    totalPages,
    startIndex,
    handleSort,
    handleSearch,
    handleTabChange,
    handlePageChange
  } = useUserFilters(users);

  const handleOpenCreateUser = () => {
    navigate('/admin/users/create');
  };


  if (!isUserAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('users.accessDenied')}
          </h2>
          <p className="text-red-600">
            {t('users.adminRequired')}
          </p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
          <PageHeader onAddUser={handleOpenCreateUser} />
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        availableRoles={availableRoles}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        users={users}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-base lg:text-lg font-semibold text-gray-800">
            {t('users.list')} ({filteredAndSortedUsers.length})
          </h2>
        </div>

            <div className="block lg:hidden">
              {paginatedUsers.map((user) => (
                <UserCard key={user.id} user={user} onDelete={openDeleteModal} />
              ))}
            </div>

            <UserTable
              users={paginatedUsers}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onDelete={openDeleteModal}
            />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedUsers.length}
        />
      </div>

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteUser(deleteModal.user)}
        user={deleteModal.user}
        loading={deleting}
      />
    </div>
  );
}
