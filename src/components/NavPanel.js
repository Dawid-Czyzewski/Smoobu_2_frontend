import { useUser } from "../context/UserProvider";
import { isAdmin } from "../utils/roleUtils";
import AdminNavPanel from "./AdminNavPanel";

export default function NavPanel() {
  const { fullUser } = useUser();

  // Always show AdminNavPanel - it contains both user and admin sections
  return <AdminNavPanel />;
}
