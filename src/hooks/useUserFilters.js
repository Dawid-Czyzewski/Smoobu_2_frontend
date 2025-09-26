import { useState, useMemo } from "react";
import { getHighestRole } from "../utils/roleUtils";

export function useUserFilters(users) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

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
          new Date(user.createdAt).toLocaleDateString().includes(searchTerm) ||
          user.udzialy?.some(share => 
            share.apartment?.name?.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    if (activeTab !== "all") {
      filtered = filtered.filter(user => {
        const highestRole = getHighestRole(user.roles);
        const roleToCheck = highestRole === 'Admin' ? 'ROLE_ADMIN' : 'ROLE_USER';
        return roleToCheck === activeTab;
      });
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
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
  };
}
