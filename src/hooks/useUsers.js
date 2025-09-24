import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserProvider";
import { isAdmin, getHighestRole } from "../utils/roleUtils";
import { get, deleteUser } from "../services/apiService";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";

export function useUsers() {
  const { t } = useTranslation();
  const { fullUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const isUserAdmin = isAdmin(fullUser?.roles);
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
      
      setUsers(allUsers);
      setHasLoaded(true);
    } catch (err) {
      toast.error(t('users.fetchError') || 'Failed to fetch users');
      setError(t('users.fetchError') || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!user) return;

    setDeleting(true);
    try {
      const response = await deleteUser(user.id);
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t('users.authRequired'));
          return;
        }
        if (response.status === 403) {
          toast.error(t('users.accessDeniedDelete'));
          return;
        }
        throw new Error('Failed to delete user');
      }

      toast.success(t('users.deleteSuccess', { 
        name: user.name, 
        surname: user.surname, 
        email: user.email 
      }));
      
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      setTotalUsers(prev => prev - 1);
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      toast.error(t('users.deleteError', { 
        name: user.name, 
        surname: user.surname, 
        error: error.message 
      }));
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };
  const availableRoles = useMemo(() => {
    const roles = new Set();
    users.forEach(user => {
      const highestRole = getHighestRole(user.roles);
      roles.add(highestRole === 'Admin' ? 'ROLE_ADMIN' : 'ROLE_USER');
    });
    return Array.from(roles);
  }, [users]);

  useEffect(() => {
    if (!isUserAdmin) {
      setLoading(false);
      return;
    }
  }, [isUserAdmin]);

  useEffect(() => {
    if (!isUserAdmin || hasLoaded) {
      setLoading(false);
      return;
    }
    
    fetchUsers();
  }, [isUserAdmin, hasLoaded]);

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

  return {
    users,
    loading,
    error,
    totalUsers,
    isUserAdmin,
    availableRoles,
    deleteModal,
    deleting,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteUser
  };
}
