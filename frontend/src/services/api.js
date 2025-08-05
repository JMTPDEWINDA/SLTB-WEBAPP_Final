const API_BASE_URL = 'http://localhost:8070/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.errors || `HTTP error! status: ${response.status}`;
    const error = new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    error.response = { data: errorData, status: response.status };
    throw error;
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Authentication API calls
export const authAPI = {
  // User login
  signin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.token && data.user) {
      apiUtils.setAuthData(data.token, data.user);
    }
    
    return data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Planting applications API calls
export const plantingAPI = {
  // Submit new planting application
  apply: async (applicationData) => {
    const response = await fetch(`${API_BASE_URL}/planting/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  // Get user's planting applications
  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/planting/applications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get specific planting application
  getApplication: async (id) => {
    const response = await fetch(`${API_BASE_URL}/planting/applications/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update planting application
  updateApplication: async (id, applicationData) => {
    const response = await fetch(`${API_BASE_URL}/planting/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  // Delete planting application
  deleteApplication: async (id) => {
    const response = await fetch(`${API_BASE_URL}/planting/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Replanting applications API calls
export const replantingAPI = {
  // Submit new replanting application
  apply: async (applicationData) => {
    const response = await fetch(`${API_BASE_URL}/replanting/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  // Get user's replanting applications
  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/replanting/applications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get specific replanting application
  getApplication: async (id) => {
    const response = await fetch(`${API_BASE_URL}/replanting/applications/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update replanting application
  updateApplication: async (id, applicationData) => {
    const response = await fetch(`${API_BASE_URL}/replanting/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  // Delete replanting application
  deleteApplication: async (id) => {
    const response = await fetch(`${API_BASE_URL}/replanting/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Reference tracking API calls
export const referenceAPI = {
  // Track application by reference number
  trackByReference: async (referenceNo) => {
    const response = await fetch(`${API_BASE_URL}/reference/track/${referenceNo}`);
    return handleResponse(response);
  },

  // Search applications
  searchApplications: async (searchCriteria) => {
    const response = await fetch(`${API_BASE_URL}/reference/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchCriteria)
    });
    return handleResponse(response);
  },

  // Get application statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/reference/statistics`);
    return handleResponse(response);
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user's applications
  getApplications: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/applications?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get dashboard statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/statistics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get notifications
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Set authentication data
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}; 