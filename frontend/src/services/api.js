export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('adminToken');
}

export async function apiRequest(path, options = {}) {
  const {
    auth = false,
    headers = {},
    ...fetchOptions
  } = options;

  const requestHeaders = {
    ...headers,
  };

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || 'حدث خطأ أثناء الاتصال بالخادم'
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}