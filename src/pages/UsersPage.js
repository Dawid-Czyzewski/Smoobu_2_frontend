import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import PageHeader from "../components/UsersPage/PageHeader";
import SearchAndFilters from "../components/UsersPage/SearchAndFilters";
import UserCard from "../components/UsersPage/UserCard";
import UserTable from "../components/UsersPage/UserTable";
import Pagination from "../components/UsersPage/Pagination";

export default function UsersPage() {
  const { t } = useTranslation();
  const { fullUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      setLoading(false);
      return;
    }
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const mockUsers = [
          {
            id: 1,
            name: "Jan",
            surname: "Kowalski",
            email: "jan.kowalski@example.com",
            roles: ["ROLE_USER"],
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            name: "Anna",
            surname: "Nowak",
            email: "anna.nowak@example.com",
            roles: ["ROLE_ADMIN"],
            created_at: "2024-01-10T14:20:00Z"
          },
          {
            id: 3,
            name: "Piotr",
            surname: "Wiśniewski",
            email: "piotr.wisniewski@example.com",
            roles: ["ROLE_USER"],
            created_at: "2024-01-20T09:15:00Z"
          }
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        setError(t('users.fetchError'));
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t, fullUser?.roles]);

  // Get unique roles (excluding admin)
  const availableRoles = useMemo(() => {
    const roles = new Set();
    users.forEach(user => {
      user.roles.forEach(role => {
        if (role !== 'ROLE_ADMIN') {
          roles.add(role);
        }
      });
    });
    return Array.from(roles);
  }, [users]);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Filter by search term - search in all fields
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.surname?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.id?.toString().includes(searchTerm) ||
          user.roles?.join(' ').toLowerCase().includes(searchLower) ||
          new Date(user.created_at).toLocaleDateString().includes(searchTerm)
        );
      });
    }

    // Filter by role tab - exclude admins from all views
    if (activeTab === "all") {
      filtered = filtered.filter(user => !user.roles.includes('ROLE_ADMIN'));
    } else {
      // Filter by specific role (excluding admin)
      filtered = filtered.filter(user => 
        !user.roles.includes('ROLE_ADMIN') && user.roles.includes(activeTab)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "name") {
        aValue = `${a.name} ${a.surname}`;
        bValue = `${b.name} ${b.surname}`;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDirection, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Check if user is admin - after hooks
  if (!isAdmin(fullUser?.roles)) {
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
      <PageHeader />
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        availableRoles={availableRoles}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        users={users}
      />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">
            {t('users.list')} ({filteredAndSortedUsers.length})
          </h2>
        </div>

        <div className="block lg:hidden">
          {paginatedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        <UserTable
          users={paginatedUsers}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedUsers.length}
        />
      </div>
    </div>
  );
}
