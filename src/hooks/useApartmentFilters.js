import { useState, useMemo } from "react";

export function useApartmentFilters(apartments) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAndSortedApartments = useMemo(() => {
    let filtered = apartments;

    if (searchTerm) {
      filtered = filtered.filter(apartment => {
        const searchLower = searchTerm.toLowerCase();
        return (
          apartment.name?.toLowerCase().includes(searchLower) ||
          apartment.id?.toString().includes(searchTerm) ||
          apartment.priceForClean?.toString().includes(searchTerm) ||
          apartment.vat?.toString().includes(searchTerm) ||
          new Date(apartment.createdAt).toLocaleDateString().includes(searchTerm)
        );
      });
    }

     if (activeTab === "canInvoice") {
       filtered = filtered.filter(apartment => apartment.canFaktura === true);
     } else if (activeTab === "cannotInvoice") {
       filtered = filtered.filter(apartment => apartment.canFaktura === false);
     }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "priceForClean" || sortField === "vat") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
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
  }, [apartments, searchTerm, sortField, sortDirection, activeTab]);

  const totalPages = Math.ceil(filteredAndSortedApartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApartments = filteredAndSortedApartments.slice(startIndex, startIndex + itemsPerPage);

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
    
    filteredAndSortedApartments,
    paginatedApartments,
    totalPages,
    startIndex,
    
    handleSort,
    handleSearch,
    handleTabChange,
    handlePageChange
  };
}
