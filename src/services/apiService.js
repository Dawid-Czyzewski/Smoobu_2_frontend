import { API_URL } from '../config';
import { getToken, setToken } from './tokenService';
import * as authService from './authService';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

function addAuthHeader(options = {}) {
  const token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return options;
}

export async function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const finalOptions = addAuthHeader({
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const response = await fetch(fullUrl, finalOptions);

  if (response.status !== 401) {
    return response;
  }

  if (url.includes('/api/token/refresh')) {
    authService.logout();
    throw new Error('Refresh token jest nieprawidłowy');
  }

  return handle401(fullUrl, finalOptions);
}

async function handle401(originalUrl, originalOptions) {
  if (isRefreshing) {

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(newToken => {
        if (!newToken) {
          reject(new Error('Brak tokenu po odświeżeniu'));
          return;
        }
        const retryOptions = {
          ...originalOptions,
          headers: {
            ...originalOptions.headers,
            Authorization: `Bearer ${newToken}`
          }
        };
        fetch(originalUrl, retryOptions).then(resolve).catch(reject);
      });
    });
  }

  isRefreshing = true;
  try {
    const { token } = await authService.refreshToken();

    if (token) {
      setToken(token, true);
      onRefreshed(token);

      const retryOptions = {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          Authorization: `Bearer ${token}`
        }
      };
      return fetch(originalUrl, retryOptions);
    } else {
      throw new Error('Brak tokenu po refresh');
    }
  } catch (err) {
    authService.logout();
    onRefreshed(null);
    throw err;
  } finally {
    isRefreshing = false;
  }
}

export async function get(url) {
  return apiFetch(url, { method: 'GET' });
}

export async function post(url, data) {
  return apiFetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });
}

export async function put(url, data) {
  return apiFetch(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });
}

export async function del(url) {
  return apiFetch(url, { method: 'DELETE' });
}

export default {
  get,
  post,
  put,
  del,
  fetch: apiFetch
};
