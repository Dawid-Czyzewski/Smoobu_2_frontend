import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { get, put } from '../../services/apiService';
import toast from 'react-hot-toast';

export default function UserSharesManager({ user, onSharesChange }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (user?.udzialy) {
      const mappedShares = user.udzialy
        .filter(share => share && share.apartment && share.apartment.name)
        .map((share, index) => ({
          id: share.id || `existing-${index}`,
          apartmentId: share.apartment.id,
          apartment: share.apartment,
          percentage: parseFloat(share.procent) || 0
        }));
      setShares(mappedShares);
    }
  }, [user]);

  const fetchApartments = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await get('/apartments');
      const apartmentsData = await response.json();
      
      if (apartmentsData['hydra:member']) {
        setUsers(apartmentsData['hydra:member']);
      } else if (Array.isArray(apartmentsData)) {
        setUsers(apartmentsData);
      } else {
        console.error('Unexpected apartments data format:', apartmentsData);
        toast.error('Nieprawidłowy format danych apartamentów');
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
      toast.error('Błąd podczas ładowania apartamentów');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const handleAddShare = () => {
    if (!selectedApartment || !percentage) {
      toast.error('Wybierz apartament i podaj procent');
      return;
    }

    const apartment = users.find(apt => apt.id === parseInt(selectedApartment));
    if (!apartment) {
      toast.error('Nie znaleziono apartamentu');
      return;
    }

    const existingShare = shares.find(share => share.apartmentId === apartment.id);
    if (existingShare) {
      toast.error('Użytkownik już ma udział w tym apartamencie');
      return;
    }

    const newShare = {
      id: `temp-${Date.now()}`,
      apartmentId: apartment.id,
      apartment: apartment,
      percentage: parseFloat(percentage)
    };

    setShares(prev => [...prev, newShare]);
    setSelectedApartment('');
    setPercentage('');
    setShowAddForm(false);

    if (onSharesChange) {
      onSharesChange([...shares, newShare]);
    }
  };

  const handleRemoveShare = (shareId) => {
    setShares(prev => {
      const newShares = prev.filter(share => share.id !== shareId);
      if (onSharesChange) {
        onSharesChange(newShares);
      }
      return newShares;
    });
  };

  const handlePercentageChange = (shareId, newPercentage) => {
    setShares(prev => {
      const newShares = prev.map(share => 
        share.id === shareId ? { ...share, percentage: parseFloat(newPercentage) || 0 } : share
      );
      if (onSharesChange) {
        onSharesChange(newShares);
      }
      return newShares;
    });
  };

  const availableApartments = users.filter(apartment => 
    !shares.some(share => share.apartmentId === apartment.id)
  );

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('shares.title')}
      </h2>

      {shares.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{t('shares.noShares')}</p>
          <button
            onClick={() => {
              setShowAddForm(true);
              if (users.length === 0) {
                fetchApartments();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('shares.addShare')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {shares.map((share) => (
              <div key={share.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {share.apartment.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('shares.apartmentId')}: {share.apartment.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={share.percentage}
                      onChange={(e) => handlePercentageChange(share.id, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <button
                      onClick={() => handleRemoveShare(share.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                      title={t('shares.removeShare')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAddForm ? (
            <div className="mt-4">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  if (users.length === 0) {
                    fetchApartments();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {t('shares.addShare')}
              </button>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('shares.addNewShare')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('shares.selectApartment')}
                  </label>
                  <select
                    value={selectedApartment}
                    onChange={(e) => setSelectedApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={usersLoading}
                  >
                    <option value="">{usersLoading ? t('shares.loadingApartments') : t('shares.selectApartment')}</option>
                    {availableApartments.map((apartment) => (
                      <option key={apartment.id} value={apartment.id}>
                        {apartment.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('shares.percentage')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleAddShare}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    {t('shares.add')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedApartment('');
                      setPercentage('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {t('shares.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
