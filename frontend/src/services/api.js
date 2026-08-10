// API Configuration. Vite supplies mode-specific values from .env.development
// and .env.production. Refuse to start a development client pointed at a
// non-local server, even if .env.local accidentally overrides the mode file.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error('VITE_API_URL is required for this Vite mode');
}

const rawApiUrl = configuredApiUrl.replace(/\/$/, '');
const configuredHostname = new URL(rawApiUrl).hostname;

if (import.meta.env.DEV && !['localhost', '127.0.0.1', '::1'].includes(configuredHostname)) {
  throw new Error('Development VITE_API_URL must point to the local backend');
}

export const BACKEND_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.replace(/\/api$/, '') : rawApiUrl;
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export const resolveBackendUrl = (value) => {
  if (!value || typeof value !== 'string') return value || null;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
  if (!value.startsWith('/')) return value;
  return `${BACKEND_BASE_URL}${value}`;
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('API Error:', error);
    
    // If unauthorized, clear token and prompt re-login
    if (response.status === 401) {
      if (error.code === 'SESSION_REPLACED') {
        alert('Your session has ended because your account was signed in from another location.');
      } else if (error.code === 'SESSION_EXPIRED') {
        alert('Your session has expired. Please log in again.');
      }
      
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_authenticated');
      
      // Redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
    
    throw new Error(error.error || error.message || 'Something went wrong');
  }
  return response.json();
};

// ============================================================================
// PORTFOLIO API
// ============================================================================

export const portfolioAPI = {
  // Get all portfolio data
  getPortfolio: async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio`);
    return handleResponse(response);
  },

  // Update entire portfolio
  updatePortfolio: async (data) => {
    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Update specific section
  updateSection: async (section, data) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/section/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },

  // Update specific project
  updateProject: async (projectId, projectData) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },

  // Delete specific project
  deleteProject: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return handleResponse(response);
  }
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(response);
    
    // Store the token returned by the backend (supports both token and access_token)
    const authToken = data.token || data.access_token;
    if (authToken) {
      localStorage.setItem('admin_token', authToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Register
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    const data = await handleResponse(response);
    
    // Store the token returned by the backend (supports both token and access_token)
    const authToken = data.token || data.access_token;
    if (authToken) {
      localStorage.setItem('admin_token', authToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Server logout error:', err);
      }
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_authenticated');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// ============================================================================
// CONTACT API
// ============================================================================

export const contactAPI = {
  // Submit contact form
  submitMessage: async (data) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Get all messages (admin only)
  getMessages: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/contact?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return handleResponse(response);
  },

  // Get single message
  getMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return handleResponse(response);
  },

  // Mark as read/unread
  markAsRead: async (id, read = true) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ read })
    });
    return handleResponse(response);
  },

  // Add reply
  addReply: async (id, replyMessage) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}/reply`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ replyMessage })
    });
    return handleResponse(response);
  },

  // Delete message
  deleteMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return handleResponse(response);
  },

  // Delete multiple messages
  deleteMessages: async (ids) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ ids })
    });
    return handleResponse(response);
  }
};

// ============================================================================
// UPLOAD API
// ============================================================================

export const uploadAPI = {
  // Upload file
  uploadFile: async (file, type = 'image') => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      
      // If unauthorized, clear token and prompt re-login
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_authenticated');
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json();
  },

  // Delete file
  deleteFile: async (publicId, resourceType = 'image') => {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ public_id: publicId, resource_type: resourceType })
    });
    return handleResponse(response);
  }
};

export default {
  portfolio: portfolioAPI,
  auth: authAPI,
  contact: contactAPI,
  upload: uploadAPI
};
