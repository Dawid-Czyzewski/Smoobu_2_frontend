import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { get, post } from "../../services/apiService";
import toast from "react-hot-toast";

export default function ShareholdersManagerForCreate({ onShareholdersChange }) {
  const { t } = useTranslation();
  const [shareholders, setShareholders] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await get('/users');
      const usersData = await response.json();
      
      if (usersData['hydra:member']) {
        setUsers(usersData['hydra:member']);
      } else if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error('Unexpected users data format:', usersData);
        toast.error('Nieprawidłowy format danych użytkowników');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Błąd podczas ładowania użytkowników');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const handleAddShareholder = async () => {
    if (users.length === 0) {
      await fetchUsers();
    }
    setShowAddForm(true);
  };

  const addShareholder = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const existingShareholder = shareholders.find(sh => sh.userId === userId);
    if (existingShareholder) {
      toast.error('Ten użytkownik już ma udział w apartamencie');
      return;
    }

    const newShareholders = [...shareholders, {
      userId: userId,
      user: user,
      percentage: 0
    }];

    const equalPercentage = Math.floor(100 / newShareholders.length);
    const remainder = 100 - (equalPercentage * newShareholders.length);
    
    const updatedShareholders = newShareholders.map((sh, index) => ({
      ...sh,
      percentage: equalPercentage + (index < remainder ? 1 : 0)
    }));

    setShareholders(updatedShareholders);
    setShowAddForm(false);
  };

  const removeShareholder = (userId) => {
    const newShareholders = shareholders.filter(sh => sh.userId !== userId);
    
    if (newShareholders.length > 0) {
      const equalPercentage = Math.floor(100 / newShareholders.length);
      const remainder = 100 - (equalPercentage * newShareholders.length);
      
      const updatedShareholders = newShareholders.map((sh, index) => ({
        ...sh,
        percentage: equalPercentage + (index < remainder ? 1 : 0)
      }));
      
      setShareholders(updatedShareholders);
    } else {
      setShareholders([]);
    }
  };

  const updatePercentage = (userId, newPercentage) => {
    const totalWithoutUser = shareholders
      .filter(sh => sh.userId !== userId)
      .reduce((sum, sh) => sum + sh.percentage, 0);

    if (totalWithoutUser + newPercentage > 100) {
      toast.error('Łączne udziały nie mogą przekraczać 100%');
      return;
    }

    setShareholders(prev => prev.map(sh => 
      sh.userId === userId ? { ...sh, percentage: newPercentage } : sh
    ));
  };

  const totalPercentage = shareholders.reduce((sum, sh) => sum + sh.percentage, 0);
  const availableUsers = users.filter(user => 
    !shareholders.some(sh => sh.userId === user.id)
  );


  useEffect(() => {
    if (onShareholdersChange) {
      onShareholdersChange(shareholders);
    }
  }, [shareholders, onShareholdersChange]);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('shares.shareholders')}
        </h3>
        
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={handleAddShareholder}
              disabled={usersLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {usersLoading ? t('shares.loadingUsers') : t('shares.addShareholder')}
            </button>
          ) : (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700">
                {t('shares.selectUser')}
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addShareholder(parseInt(e.target.value));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">{t('shares.chooseUser')}</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                {t('shares.cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {shareholders.map((shareholder) => (
            <div key={shareholder.userId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {shareholder.user.name?.[0]?.toUpperCase()}{shareholder.user.surname?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {shareholder.user.name} {shareholder.user.surname}
                    </h4>
                    <p className="text-sm text-gray-600">
                      @{shareholder.user.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeShareholder(shareholder.userId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  {t('shares.remove')}
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {t('shares.percentage')}
                  </label>
                  <span className="text-sm font-bold text-blue-600">
                    {shareholder.percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shareholder.percentage}
                  onChange={(e) => updatePercentage(shareholder.userId, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${shareholder.percentage}%, #e5e7eb ${shareholder.percentage}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {shareholders.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                {t('shares.totalShares')}:
              </span>
              <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage}%
              </span>
            </div>
            {totalPercentage !== 100 && (
              <p className="text-xs text-red-600 mt-1">
                {t('shares.mustBe100')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
