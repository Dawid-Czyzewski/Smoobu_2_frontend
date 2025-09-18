import { API_URL } from '../config';
import { setToken, clearToken, getToken, parseJwt, isTokenValid } from './tokenService';

export async function login({ username, password }, persistToken = false) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const errorData = await safeJson(res);
    throw new Error(errorData?.message || 'Nie udało się zalogować');
  }

  const data = await res.json();
  const { token } = data;

  if (!token) {
    throw new Error('Brak tokena w odpowiedzi logowania');
  }

  setToken(token, persistToken);
  const user = parseJwt(token);

  return { token, user };
}

export async function refreshToken() {
  const res = await fetch(`${API_URL}/token/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await safeJson(res);
    throw new Error(errorData?.message || 'Nie udało się odświeżyć tokenu');
  }

  const data = await res.json();
  const { token } = data;

  if (!token) {
    throw new Error('Brak tokena w odpowiedzi refresh');
  }

  setToken(token, true);

  const user = parseJwt(token);
  return { token, user };
}

export function logout() {
  clearToken();
}

export function getCurrentUserFromToken() {
  const t = getToken();
  if (!t) return null;
  return parseJwt(t);
}

export function isAuthenticated() {
  const t = getToken();
  return isTokenValid(t);
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
