import { HashRouter, Route, Routes, useLocation } from "react-router";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavPanel from "./components/NavPanel";
import AuthGuard from "./components/AuthGuard";

function App() {
  function AppRoutes() {
    const location = useLocation();
    const validPaths = ["/", "/login"];
    const hideLayout = location.pathname === "/login" || !validPaths.includes(location.pathname);

    return (
      <div className="flex min-h-screen w-full font-sans">
        {!hideLayout && <NavPanel />}
        <div className="flex flex-col flex-1 min-h-screen">
          {!hideLayout && <Header />}
          <main className="flex-1 overflow-auto">
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
                path="*"
                element={
                  <AuthGuard type="public">
                    <NotFoundPage />
                  </AuthGuard>
                }
              />
            </Routes>
          </main>
          {!hideLayout && <Footer />}
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
