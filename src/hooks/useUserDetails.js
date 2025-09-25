import { useState, useEffect } from 'react';
import { get } from '../services/apiService';

export function useUserDetails(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await get(`/users/${userId}`);

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Brak uprawnień administratora');
          } else if (response.status === 404) {
            throw new Error('Użytkownik nie został znaleziony');
          } else {
            throw new Error('Błąd podczas pobierania danych użytkownika');
          }
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
