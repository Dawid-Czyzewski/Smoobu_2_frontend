import { useCallback, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { getToken, parseJwt } from '../services/tokenService';


export default function useAuth() {
  const [user, setUser] = useState(() => {
    const t = getToken();
    return t ? parseJwt(t) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { token, user: refreshedUser } = await authService.refreshToken();
        if (!mounted) return;
        setUser(refreshedUser || (token ? parseJwt(token) : null));
      } catch (e) {
        // On refresh failure, log out to clear token
        authService.logout();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onTokenChanged(e) {
      const token = e?.detail?.token ?? null;
      setUser(token ? parseJwt(token) : null);
    }
    window.addEventListener('jwtTokenChanged', onTokenChanged);

    function onStorage(e) {
      if (e.key === 'jwt_token') {
        setUser(e.newValue ? parseJwt(e.newValue) : null);
      }
    }
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('jwtTokenChanged', onTokenChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = useCallback(async (credentials, persist = false) => {
    const { token, user: loggedUser } = await authService.login(credentials, persist);
    const userObj = loggedUser || (token ? parseJwt(token) : null);

    setUser(userObj);
    return userObj;
  }, []);

  const logout = useCallback(() => {

    authService.logout();
    setUser(null);
  }, []);

  const forceRefresh = useCallback(async () => {
    try {
      const { token, user: refreshedUser } = await authService.refreshToken();
      const userObj = refreshedUser || (token ? parseJwt(token) : null);
      setUser(userObj);
      return userObj;
    } catch (e) {
      // On refresh failure, log out to clear token
      authService.logout();
      setUser(null);
      throw e;
    }
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    forceRefresh
  };
}
