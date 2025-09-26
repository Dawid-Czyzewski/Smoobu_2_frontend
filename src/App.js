import { HashRouter, Route, Routes, useLocation } from "react-router";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import UsersPage from "./pages/UsersPage";
import CreateUserPage from "./pages/CreateUserPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserEditPage from "./pages/UserEditPage";
import ApartmentsPage from "./pages/ApartmentsPage";
import ApartmentsDashboardPage from "./pages/ApartmentsDashboardPage";
import CreateApartmentPage from "./pages/CreateApartmentPage";
import ApartmentDetailsPage from "./pages/ApartmentDetailsPage";
import ApartmentViewPage from "./pages/ApartmentViewPage";
import EditApartmentPage from "./pages/EditApartmentPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavPanel from "./components/NavPanel";
import { useUser } from "./context/UserProvider";
import { useTranslation } from "react-i18next";
import AuthGuard from "./components/AuthGuard";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  function AppRoutes() {
    const location = useLocation();
    const { isAuthenticated, loading, loadingUser } = useUser();
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const validPaths = ["/", "/login", "/forgot-password", "/reset-password", "/contact", "/admin/users", "/admin/users/create", "/admin/apartments", "/admin/apartments/create", "/apartments"];
    const hideLayout = location.pathname === "/login" || location.pathname === "/forgot-password" || location.pathname === "/reset-password" || 
                      (!validPaths.includes(location.pathname) && !location.pathname.startsWith("/admin/users/") && !location.pathname.startsWith("/admin/apartments/") && !location.pathname.startsWith("/apartments/"));
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
                    path="/forgot-password"
                    element={
                      <AuthGuard type="public">
                        <ForgotPasswordPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/reset-password"
                    element={
                      <AuthGuard type="public">
                        <ResetPasswordPage />
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
                    path="/admin/users/create"
                    element={
                      <AuthGuard type="private">
                        <CreateUserPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/admin/users/:id"
                    element={
                      <AuthGuard type="private">
                        <UserDetailsPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/admin/users/edit/:id"
                    element={
                      <AuthGuard type="private">
                        <UserEditPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/admin/apartments"
                    element={
                      <AuthGuard type="private">
                        <ApartmentsPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/apartments"
                    element={
                      <AuthGuard type="private">
                        <ApartmentsDashboardPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/apartments/:id"
                    element={
                      <AuthGuard type="private">
                        <ApartmentViewPage />
                      </AuthGuard>
                    }
                  />

                  <Route
                    path="/admin/apartments/create"
                    element={
                      <AuthGuard type="private">
                        <CreateApartmentPage />
                      </AuthGuard>
                    }
                  />

                 <Route
                   path="/admin/apartments/:id"
                   element={
                     <AuthGuard type="private">
                       <ApartmentDetailsPage />
                     </AuthGuard>
                   }
                 />
                 <Route
                   path="/admin/apartments/edit/:id"
                   element={
                     <AuthGuard type="private">
                       <EditApartmentPage />
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </HashRouter>
  );
}

export default App;
