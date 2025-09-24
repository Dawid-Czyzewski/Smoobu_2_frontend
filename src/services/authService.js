import { API_URL } from '../config';
import { setToken, setRefreshToken, clearToken, getToken, getRefreshToken, parseJwt, isTokenValid } from './tokenService';

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
  const { token, refresh_token } = data;

  if (!token) {
    throw new Error('Brak tokena w odpowiedzi logowania');
  }

  if (!refresh_token) {
    throw new Error('Brak refresh tokena w odpowiedzi logowania');
  }

  setToken(token, persistToken);
  setRefreshToken(refresh_token, persistToken);
  const user = parseJwt(token);

  return { token, refresh_token, user };
}

export async function refreshToken() {
  const refreshTokenValue = getRefreshToken();
  
  if (!refreshTokenValue) {
    throw new Error('Brak refresh tokena');
  }

  const res = await fetch(`${API_URL}/token/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshTokenValue })
  });

  if (!res.ok) {
    const errorData = await safeJson(res);
    throw new Error(errorData?.message || 'Nie udało się odświeżyć tokenu');
  }

  const data = await res.json();
  const { token, refresh_token } = data;

  if (!token) {
    throw new Error('Brak tokena w odpowiedzi refresh');
  }

  if (!refresh_token) {
    throw new Error('Brak nowego refresh tokena w odpowiedzi - backend powinien zwrócić nowy refresh token');
  }

  // Always save the new JWT token
  setToken(token, true);
  
  // Always save the new refresh token
  setRefreshToken(refresh_token, true);

  const user = parseJwt(token);
  return { token, refresh_token, user };
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
