let inMemoryToken = null;
const TOKEN_KEY = 'token';

function emitTokenChange(token) {
  try {
    const ev = new CustomEvent('jwtTokenChanged', { detail: { token } });
    window.dispatchEvent(ev);
  } catch (e) {
    const ev = document.createEvent('CustomEvent');
    ev.initCustomEvent('jwtTokenChanged', false, false, { token });
    window.dispatchEvent(ev);
  }
}

export function setToken(token, persist = false) {
  inMemoryToken = token;
  if (persist) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('Nie udało się zapisać tokena do localStorage', e);
    }
  }
  emitTokenChange(token);
}

export function getToken() {
  if (inMemoryToken) return inMemoryToken;
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored;
      return stored;
    }
  } catch (e) {

  }
  return null;
}

export function clearToken() {
  inMemoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {

  }
  emitTokenChange(null);
}

export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token) {
  if (!token) return false;
  const data = parseJwt(token);
  if (!data || !data.exp) return false;
  const now = Math.floor(Date.now() / 1000);
 
  return data.exp > now + 10;
}
