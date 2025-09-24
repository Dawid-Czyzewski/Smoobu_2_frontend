import { API_URL } from "../config";
import { getToken, isTokenValid } from "./tokenService";

export async function getCurrentUser() {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
    throw new Error("Brak ważnego tokenu");
  }

  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Nie udało się pobrać użytkownika";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  return await res.json();
}


