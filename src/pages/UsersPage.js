import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import PageHeader from "../components/UsersPage/PageHeader";
import SearchAndFilters from "../components/UsersPage/SearchAndFilters";
import UserCard from "../components/UsersPage/UserCard";
import UserTable from "../components/UsersPage/UserTable";
import Pagination from "../components/UsersPage/Pagination";
import { useNavigate, useLocation } from "react-router";
import { get } from "../services/apiService";
import toast from "react-hot-toast";

export default function UsersPage() {
  const { t } = useTranslation();
  const { fullUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingPages, setLoadingPages] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      setLoading(false);
      return;
    }
  }, [fullUser?.roles]);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      return;
    }
    
    if (hasLoaded) {
      setLoading(false);
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const firstResponse = await get('/users?page=1');
        
        if (!firstResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const firstData = await firstResponse.json();
        
        let totalItems, firstPageUsers;
        if (Array.isArray(firstData)) {
          firstPageUsers = firstData;
          totalItems = firstData.length;
        } else {
          totalItems = firstData['hydra:totalItems'] || 0;
          firstPageUsers = firstData['hydra:member'] || [];
        }
        
        const itemsPerPage = 10;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        setTotalUsers(totalItems);
        const allUsers = [];

        allUsers.push(...firstPageUsers);
        
        if (!Array.isArray(firstData)) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(
              get(`/users?page=${page}`).then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error(`Failed to fetch page ${page}`);
              })
            );
          }
          
          if (pagePromises.length > 0) {
            const remainingPages = await Promise.all(pagePromises);
            remainingPages.forEach(pageData => {
              const pageUsers = pageData['hydra:member'] || [];
              allUsers.push(...pageUsers);
            });
          }
        }
        
        const filteredUsers = allUsers.filter(user => !user.roles.includes('ROLE_ADMIN'));
        
        setUsers(filteredUsers);
        setHasLoaded(true);
      } catch (err) {
        toast.error(t('users.fetchError') || 'Failed to fetch users');
        setError(t('users.fetchError') || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t, hasLoaded]);

  useEffect(() => {
    if (location.state?.newUser) {
      const newUser = location.state.newUser;
      setUsers(prevUsers => {
        const userExists = prevUsers.some(user => user.id === newUser.id);
        if (!userExists) {
          return [...prevUsers, newUser];
        }
        return prevUsers;
      });
      setTotalUsers(prev => prev + 1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const availableRoles = useMemo(() => {
    const roles = new Set();
    users.forEach(user => {
      user.roles.forEach(role => {
        roles.add(role);
      });
    });
    return Array.from(roles);
  }, [users]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.surname?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.id?.toString().includes(searchTerm) ||
          user.roles?.join(' ').toLowerCase().includes(searchLower) ||
          new Date(user.createdAt).toLocaleDateString().includes(searchTerm)
        );
      });
    }

        if (activeTab !== "all") {
          filtered = filtered.filter(user => user.roles.includes(activeTab));
        }

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

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleOpenCreateUser = () => {
    navigate('/admin/users/create');
  };


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
          <PageHeader onAddUser={handleOpenCreateUser} />
      
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
