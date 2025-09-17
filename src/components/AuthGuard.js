import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthGuard({ children, type = "private" }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (type === "private" && !token) {
      navigate("/login", { replace: true });
    }
    if (type === "public" && token) {
      navigate("/", { replace: true });
    }
  }, [navigate, type]);

  return children;
}
