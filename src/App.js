import { HashRouter, Route, Routes, useLocation } from "react-router";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavPanel from "./components/NavPanel";

function App() {
  function AppRoutes() {
    const location = useLocation();
    const showHeader = location.pathname !== '/login';
    const showFooter = location.pathname !== '/login';
    const showNav = location.pathname !== '/login';

    return (
  <div className="flex min-h-screen w-full font-sans">
        {showNav && <NavPanel />}
        <div className="flex flex-col flex-1 min-h-screen">
          {showHeader && <Header />}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          {showFooter && <Footer />}
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
