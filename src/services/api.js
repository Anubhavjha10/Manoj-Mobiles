const API_BASE_URL = '/api'; // Use relative path because of Vite proxy

export const getToken = () => {
  return localStorage.getItem('mm_jwt_token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('mm_jwt_token', token);
  } else {
    localStorage.removeItem('mm_jwt_token');
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem('mm_refresh_token');
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('mm_refresh_token', token);
  } else {
    localStorage.removeItem('mm_refresh_token');
  }
};

export const getUserId = () => {
  return localStorage.getItem('mm_user_id');
};

export const setUserId = (id) => {
  if (id) {
    localStorage.setItem('mm_user_id', id);
  } else {
    localStorage.removeItem('mm_user_id');
  }
};

const clearAuthData = () => {
  setToken(null);
  setRefreshToken(null);
  setUserId(null);
  localStorage.removeItem('mm_admin_user');
  localStorage.removeItem('mm_user');
};

const getHeaders = (options = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {})
  });

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

// Silent Token Refresh Queue & Lock
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newToken);
    }
  });
  failedQueue = [];
};

const attemptSilentRefresh = async () => {
  const refreshToken = getRefreshToken();
  const userId = getUserId();

  if (!refreshToken || !userId) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, refreshToken })
  });

  if (!response.ok) {
    throw new Error('Refresh token invalid or expired');
  }

  const result = await response.json();
  const data = result?.data || result;
  const newAccessToken = data?.token || data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  if (newAccessToken) {
    setToken(newAccessToken);
    if (newRefreshToken) setRefreshToken(newRefreshToken);
    return newAccessToken;
  }

  throw new Error('Failed to retrieve new access token');
};

const handleResponse = async (response, retryOriginalRequest) => {
  if (!response.ok) {
    // 401 Unauthorized -> Attempt Silent Refresh if token exists
    if (response.status === 401 && !response.url.includes('/auth/refresh') && !response.url.includes('/auth/login')) {
      const refreshToken = getRefreshToken();
      const userId = getUserId();

      if (refreshToken && userId) {
        if (isRefreshing) {
          // If a refresh is already in progress, wait for it
          try {
            const newToken = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            return retryOriginalRequest(newToken);
          } catch (err) {
            clearAuthData();
            window.location.reload();
            throw err;
          }
        }

        isRefreshing = true;

        try {
          const newToken = await attemptSilentRefresh();
          isRefreshing = false;
          processQueue(null, newToken);
          return retryOriginalRequest(newToken);
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr, null);
          clearAuthData();
          window.location.reload();
          throw refreshErr;
        }
      } else {
        clearAuthData();
        window.location.reload();
      }
    }

    // Try to parse error message from backend
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    } catch (e) {
      if (e.message) throw e;
      throw new Error('Network response was not ok');
    }
  }

  // Handle empty or JSON responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  } else {
    return response.text();
  }
};

export const api = {
  get: async (endpoint, options = {}) => {
    const makeRequest = async (overrideToken) => {
      const headers = getHeaders(options);
      if (overrideToken) {
        headers.set('Authorization', `Bearer ${overrideToken}`);
      }
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'GET',
        headers
      });
    };

    const response = await makeRequest();
    return handleResponse(response, makeRequest);
  },

  post: async (endpoint, data, options = {}) => {
    const makeRequest = async (overrideToken) => {
      const headers = getHeaders(options);
      if (overrideToken) {
        headers.set('Authorization', `Bearer ${overrideToken}`);
      }
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
    };

    const response = await makeRequest();
    return handleResponse(response, makeRequest);
  },

  postFormData: async (endpoint, formData, options = {}) => {
    const makeRequest = async (overrideToken) => {
      const headers = new Headers(options.headers || {});
      const token = overrideToken || getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'POST',
        headers,
        body: formData
      });
    };

    const response = await makeRequest();
    return handleResponse(response, makeRequest);
  },

  put: async (endpoint, data, options = {}) => {
    const makeRequest = async (overrideToken) => {
      const headers = getHeaders(options);
      if (overrideToken) {
        headers.set('Authorization', `Bearer ${overrideToken}`);
      }
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
    };

    const response = await makeRequest();
    return handleResponse(response, makeRequest);
  },

  delete: async (endpoint, options = {}) => {
    const makeRequest = async (overrideToken) => {
      const headers = getHeaders(options);
      if (overrideToken) {
        headers.set('Authorization', `Bearer ${overrideToken}`);
      }
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'DELETE',
        headers
      });
    };

    const response = await makeRequest();
    return handleResponse(response, makeRequest);
  }
};
