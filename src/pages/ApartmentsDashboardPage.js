import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserProvider';
import { isAdmin } from '../utils/roleUtils';
import { get } from '../services/apiService';
import toast from 'react-hot-toast';

export default function ApartmentsDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullUser } = useUser();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchApartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isAdmin(fullUser?.roles)) {
        response = await get('/apartments');
      } else {
        response = await get('/me');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch apartments');
      }

      const data = await response.json();
      
      if (isAdmin(fullUser?.roles)) {
        if (data['hydra:member']) {
          setApartments(data['hydra:member']);
        } else if (Array.isArray(data)) {
          setApartments(data);
        } else {
          setApartments([]);
        }
      } else {
        const userApartments = data.udzialy
          ?.filter(share => share.apartment && share.apartment.name)
          .map(share => ({
            ...share.apartment,
            userPercentage: parseFloat(share.procent) || 0
          })) || [];
        setApartments(userApartments);
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError(err.message);
      toast.error('Błąd podczas ładowania apartamentów');
    } finally {
      setLoading(false);
    }
  }, [fullUser?.roles]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const handleApartmentClick = (apartment) => {
    navigate(`/apartments/${apartment.id}`);
  };

  // Filter apartments based on search term
  const filteredApartments = useMemo(() => {
    if (!searchTerm.trim()) {
      return apartments;
    }
    return apartments.filter(apartment =>
      apartment.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apartments, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApartments = filteredApartments.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">{t('apartments.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {t('apartments.error')}
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchApartments}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('apartments.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {isAdmin(fullUser?.roles) ? t('apartments.allApartments') : t('apartments.myApartments')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isAdmin(fullUser?.roles) 
            ? t('apartments.allApartmentsDescription')
            : t('apartments.myApartmentsDescription')
          }
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('apartments.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {filteredApartments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? t('apartments.noResults') : (isAdmin(fullUser?.roles) ? t('apartments.noApartments') : t('apartments.noMyApartments'))}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? t('apartments.noResultsDescription')
              : (isAdmin(fullUser?.roles) 
                ? t('apartments.noApartmentsDescription')
                : t('apartments.noMyApartmentsDescription'))
            }
          </p>
          {isAdmin(fullUser?.roles) && !searchTerm && (
            <button
              onClick={() => navigate('/admin/apartments/create')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
            >
              {t('apartments.createFirst')}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentApartments.map((apartment) => (
              <div
                key={apartment.id}
                onClick={() => handleApartmentClick(apartment)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  {apartment.picture ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${apartment.picture}`}
                      alt={apartment.name}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors p-4">
                    {apartment.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('apartments.showingResults', {
                  start: startIndex + 1,
                  end: Math.min(endIndex, filteredApartments.length),
                  total: filteredApartments.length
                })}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('apartments.previous')}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      page === currentPage
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('apartments.next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
