import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import { get, del } from "../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import { useApartmentFilters } from "../hooks/useApartmentFilters";
import SearchAndFilters from "../components/ApartmentsPage/SearchAndFilters";
import ApartmentTable from "../components/ApartmentsPage/ApartmentTable";
import ApartmentCard from "../components/ApartmentsPage/ApartmentCard";
import Pagination from "../components/ApartmentsPage/Pagination";
import DeleteApartmentModal from "../components/ApartmentsPage/DeleteApartmentModal";

export default function ApartmentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullUser } = useUser();
  
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, apartment: null });
  const [deleting, setDeleting] = useState(false);

  const {
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
  } = useApartmentFilters(apartments);

  useEffect(() => {
    if (!isAdmin(fullUser?.roles)) {
      navigate('/');
      return;
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [fullUser?.roles, navigate]);

  useEffect(() => {
    if (isAdmin(fullUser?.roles)) {
      fetchApartments();
    }
  }, [fullUser?.roles]);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await get('/apartments');
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error(t('apartments.accessDenied'));
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch apartments');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setApartments(data);
      } else if (data['hydra:member']) {
        setApartments(data['hydra:member']);
      } else {
        console.error('Unexpected data format:', data);
        setApartments([]);
      }
    } catch (err) {
      toast.error(t('apartments.fetchError') || 'Error fetching apartments.');
      console.error("Error fetching apartments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApartment = async (apartment) => {
    if (!apartment) return;

    setDeleting(true);
    try {
      const response = await del(`/apartments/${apartment.id}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t('apartments.authRequired'));
          return;
        }
        if (response.status === 403) {
          toast.error(t('apartments.accessDenied'));
          return;
        }
        throw new Error('Failed to delete apartment');
      }

      toast.success(t('apartments.deleteSuccess', { name: apartment.name }));
      
      setApartments(prevApartments => prevApartments.filter(a => a.id !== apartment.id));
      setDeleteModal({ isOpen: false, apartment: null });
    } catch (error) {
      toast.error(t('apartments.deleteError', { 
        name: apartment.name, 
        error: error.message 
      }));
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (apartment) => {
    setDeleteModal({ isOpen: true, apartment });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, apartment: null });
  };

  const handleEditApartment = (apartmentId) => {
    navigate(`/admin/apartments/edit/${apartmentId}`);
  };

  const handleViewApartment = (apartmentId) => {
    navigate(`/admin/apartments/${apartmentId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('apartments.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('apartments.apartments')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {t('apartments.apartmentsDescription') || 'Manage your apartments'}
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/admin/apartments/create')}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          {t('apartments.addApartment')}
        </button>
      </div>

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        apartments={apartments}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-base lg:text-lg font-semibold text-gray-800">
            {t('apartments.list')} ({filteredAndSortedApartments.length})
          </h2>
        </div>

        {filteredAndSortedApartments.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center m-4">
            <div className="text-gray-500 mb-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm || activeTab !== "all" 
                ? (t('apartments.noResults') || 'No apartments match your filters')
                : (t('apartments.noApartments') || 'No apartments found')
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || activeTab !== "all"
                ? (t('apartments.noResultsDescription') || 'Try adjusting your search or filters.')
                : (t('apartments.noApartmentsDescription') || 'Get started by adding your first apartment.')
              }
            </p>
            {!searchTerm && activeTab === "all" && (
              <button
                onClick={() => navigate('/admin/apartments/create')}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                {t('apartments.addApartment')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="block lg:hidden">
              {paginatedApartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  onEdit={handleEditApartment}
                  onView={handleViewApartment}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
            <div className="hidden lg:block">
              <ApartmentTable
                apartments={paginatedApartments}
                onEdit={handleEditApartment}
                onView={handleViewApartment}
                onDelete={openDeleteModal}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedApartments.length}
            />
          </>
        )}
      </div>

      <DeleteApartmentModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteApartment(deleteModal.apartment)}
        apartment={deleteModal.apartment}
        loading={deleting}
      />
    </div>
  );
}
