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

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
      localStorage.removeItem('mm_admin_user');
      localStorage.removeItem('mm_user');
      window.location.reload();
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

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
};

export const api = {
  get: async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: getHeaders(options)
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: getHeaders(options),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  postFormData: async (endpoint, formData, options = {}) => {
    const headers = new Headers(options.headers || {});
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type header manually for FormData, browser sets it with boundary

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: headers,
      body: formData
    });
    return handleResponse(response);
  },

  put: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: getHeaders(options),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: getHeaders(options)
    });
    return handleResponse(response);
  }
};
