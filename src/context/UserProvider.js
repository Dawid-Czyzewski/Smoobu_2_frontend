import { createContext, useContext, useEffect, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import * as userService from "../services/userService";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user: authUser, login, logout, loading, isAuthenticated } = useAuth();
  const [fullUser, setFullUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    if (!authUser) {
      setFullUser(null);
      return;
    }

    setLoadingUser(true);
    try {
      const data = await userService.getCurrentUser();
      setFullUser(data);
    } catch (error) {
      setFullUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchUserDetails();
    } else {
      setFullUser(null);
    }
  }, [authUser, fetchUserDetails]);

  const loginAndFetchUser = useCallback(
    async (credentials, persist = false) => {
      const loggedUser = await login(credentials, persist);
      await fetchUserDetails();
      return loggedUser;
    },
    [login, fetchUserDetails]
  );

  return (
    <UserContext.Provider
      value={{
        authUser,
        fullUser,
        loading,
        loadingUser,
        isAuthenticated,
        login: loginAndFetchUser,
        logout,
        refreshUser: fetchUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser musi być użyty wewnątrz <UserProvider>");
  }
  return context;
}
