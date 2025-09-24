// src/context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import { getToken, parseJwt } from '../services/tokenService';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = getToken();
    return t ? parseJwt(t) : null;
  });
  const [loading, setLoading] = useState(true);

  const refreshUserFromToken = useCallback(() => {
    const t = getToken();
    setUser(t ? parseJwt(t) : null);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { token, user: refreshedUser } = await authService.refreshToken();
        if (!mounted) return;

        setUser(refreshedUser || (token ? parseJwt(token) : null));
      } catch (e) {
        // On refresh failure, force logout to clear token and session
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
    setUser(loggedUser || (token ? parseJwt(token) : null));
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
