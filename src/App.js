import { HashRouter, Route, Routes, useLocation } from "react-router";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import UsersPage from "./pages/UsersPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavPanel from "./components/NavPanel";
import { useUser } from "./context/UserProvider";
import { useTranslation } from "react-i18next";
import AuthGuard from "./components/AuthGuard";
import { useState, useEffect } from "react";

function App() {
  function AppRoutes() {
    const location = useLocation();
    const { isAuthenticated, loading, loadingUser } = useUser();
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const validPaths = ["/", "/login", "/contact", "/admin/users"];
    const hideLayout = location.pathname === "/login" || !validPaths.includes(location.pathname);
    const layoutReady = !loading && (!isAuthenticated || (isAuthenticated && !loadingUser));

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    }, [isMobile]);

    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isMobileMenuOpen]);

    if (!hideLayout && isAuthenticated && (loading || loadingUser)) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm">{t('loading.user')}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen w-full font-sans overflow-hidden">
        {!hideLayout && layoutReady && <NavPanel isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />}
        
        <div className="flex flex-col flex-1 h-screen">
          {!hideLayout && layoutReady && <Header onToggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full flex flex-col">
              <div className="flex-1">
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <AuthGuard type="public">
                        <LoginPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/"
                    element={
                      <AuthGuard type="private">
                        <div className="p-4">
                          <h1 className="text-xl font-bold">Dashboard</h1>
                          <p>Witamy w panelu!</p>
                        </div>
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <AuthGuard type="private">
                        <div className="p-4">
                          <h1 className="text-xl font-bold">Kontakt</h1>
                          <p>Napisz do nas: support@example.com</p>
                        </div>
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/admin/users"
                    element={
                      <AuthGuard type="private">
                        <UsersPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="*"
                    element={
                      <AuthGuard type="public">
                        <NotFoundPage />
                      </AuthGuard>
                    }
                  />
                </Routes>
              </div>
              {!hideLayout && layoutReady && <Footer />}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
