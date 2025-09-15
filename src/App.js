import { HashRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
