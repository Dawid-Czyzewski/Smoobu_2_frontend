import { useParams } from "react-router";
import { useUser } from "../context/UserProvider";
import UserDetails from "../components/UsersPage/UserDetails";

export default function UserDetailsPage() {
  const { id } = useParams();
  const { fullUser: currentUser } = useUser();

  if (!currentUser?.roles?.includes('ROLE_ADMIN')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Brak uprawnień
          </h2>
          <p className="text-red-600">
            Tylko administratorzy mogą przeglądać szczegóły użytkowników.
          </p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Błąd
          </h2>
          <p className="text-red-600">
            Nie podano ID użytkownika.
          </p>
        </div>
      </div>
    );
  }

  return <UserDetails userId={id} />;
}
