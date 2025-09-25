import { useState, useCallback } from 'react';
import { post } from '../services/apiService';

export function useUsernameCheck(t) {
  const [checking, setChecking] = useState(false);

  const checkUsername = useCallback(async (username, excludeUserId = null) => {
    if (!username || username.trim().length < 3) {
      return { available: false, error: t('users.usernameTooShort') };
    }

    try {
      setChecking(true);
      const response = await post('/users/check-username', {
        username: username.trim(),
        excludeUserId
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t('users.authRequired'));
        } else if (response.status === 403) {
          throw new Error(t('users.accessDeniedDelete'));
        } else {
          throw new Error(t('users.checkUsernameFailed'));
        }
      }

      const data = await response.json();
      return { available: data.available, error: null };
    } catch (error) {
      return { available: false, error: error.message };
    } finally {
      setChecking(false);
    }
  }, [t]);

  return { checkUsername, checking };
}
