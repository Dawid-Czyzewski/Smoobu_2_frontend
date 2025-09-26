import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get, post } from '../../services/apiService';
import toast from 'react-hot-toast';

export default function AddApartmentShareholder({ apartmentId, onShareholderAdded }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [percentage, setPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await get('/users');
        const usersData = response.data;
        
        if (usersData['hydra:member']) {
          setUsers(usersData['hydra:member']);
        } else if (Array.isArray(usersData)) {
          setUsers(usersData);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Błąd podczas ładowania użytkowników');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !percentage) {
      toast.error('Proszę wypełnić wszystkie pola');
      return;
    }

    const percentageNum = parseFloat(percentage);
    if (percentageNum <= 0 || percentageNum > 100) {
      toast.error('Procent musi być między 0 a 100');
      return;
    }

    try {
      setLoading(true);
      await post('/api/udzialy', {
        user_id: parseInt(selectedUser),
        apartment_id: apartmentId,
        procent: percentage
      });

      toast.success('Udziałowiec został dodany');
      setSelectedUser('');
      setPercentage('');
      
      if (onShareholderAdded) {
        onShareholderAdded();
      }
    } catch (err) {
      console.error('Error adding shareholder:', err);
      toast.error(err.response?.data?.error || 'Błąd podczas dodawania udziałowca');
    } finally {
      setLoading(false);
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Ładowanie użytkowników...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-md font-semibold text-gray-900 mb-4">
        {t('shares.addShareholder')}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('shares.selectUser')}
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">{t('shares.chooseUser')}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} {user.surname} (@{user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('shares.percentage')}
          </label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            min="0.01"
            max="100"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('shares.adding') : t('shares.addShareholder')}
        </button>
      </form>
    </div>
  );
}
