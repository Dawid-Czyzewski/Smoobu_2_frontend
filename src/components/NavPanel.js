import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import AdminNavPanel from "./AdminNavPanel";

export default function NavPanel({ isMobileMenuOpen, closeMobileMenu }) {
  const { fullUser } = useUser();

  return <AdminNavPanel isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />;
}
